import { Router, type IRouter } from "express";
import { desc, eq, sql, gte } from "drizzle-orm";
import { db, usersTable, shipmentsTable, paymentsTable, trackingEventsTable } from "@workspace/db";
import {
  AdminSetShipmentStatusBody,
  AdminSetShipmentStatusParams,
  AdminAddTrackingEventBody,
  AdminAddTrackingEventParams,
} from "@workspace/api-zod";
import { requireAdmin } from "../lib/auth";
import { countByStatus, getShipmentDto, shipmentsToDtos } from "../lib/shipments";

const router: IRouter = Router();

router.get("/admin/stats", requireAdmin(), async (_req, res): Promise<void> => {
  const [{ users }] = await db
    .select({ users: sql<number>`count(*)::int` })
    .from(usersTable);
  const [{ shipments }] = await db
    .select({ shipments: sql<number>`count(*)::int` })
    .from(shipmentsTable);
  const [{ revenue }] = await db
    .select({ revenue: sql<number>`coalesce(sum(${paymentsTable.amountGbp}), 0)::float` })
    .from(paymentsTable)
    .where(eq(paymentsTable.status, "paid"));
  const breakdown = await countByStatus();
  const active = breakdown
    .filter((b) => ["pending", "picked_up", "in_transit", "out_for_delivery"].includes(b.status))
    .reduce((a, b) => a + b.count, 0);

  const since = new Date(Date.now() - 1000 * 60 * 60 * 24 * 7);
  const recentRev = await db
    .select({
      day: sql<string>`to_char(date_trunc('day', ${paymentsTable.createdAt}), 'YYYY-MM-DD')`,
      amountGbp: sql<number>`coalesce(sum(${paymentsTable.amountGbp}), 0)::float`,
    })
    .from(paymentsTable)
    .where(gte(paymentsTable.createdAt, since))
    .groupBy(sql`date_trunc('day', ${paymentsTable.createdAt})`)
    .orderBy(sql`date_trunc('day', ${paymentsTable.createdAt})`);

  res.json({
    users,
    shipments,
    revenueGbp: revenue,
    activeNow: active,
    statusBreakdown: breakdown,
    recentRevenue: recentRev,
  });
});

router.get("/admin/users", requireAdmin(), async (_req, res): Promise<void> => {
  const rows = await db.select().from(usersTable).orderBy(desc(usersTable.createdAt));
  res.json(
    rows.map((u) => ({
      id: u.id,
      email: u.email,
      name: u.name,
      avatarUrl: u.avatarUrl,
      role: u.role,
      createdAt: u.createdAt,
    })),
  );
});

router.get("/admin/shipments", requireAdmin(), async (_req, res): Promise<void> => {
  const rows = await db.select().from(shipmentsTable).orderBy(desc(shipmentsTable.createdAt));
  res.json(await shipmentsToDtos(rows));
});

router.post("/admin/shipments/:id/status", requireAdmin(), async (req, res): Promise<void> => {
  const p = AdminSetShipmentStatusParams.safeParse(req.params);
  if (!p.success) {
    res.status(400).json({ error: p.error.message });
    return;
  }
  const parsed = AdminSetShipmentStatusBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const [s] = await db
    .update(shipmentsTable)
    .set({ status: parsed.data.status })
    .where(eq(shipmentsTable.id, p.data.id))
    .returning();
  if (!s) {
    res.status(404).json({ error: "Shipment not found" });
    return;
  }
  if (parsed.data.note) {
    await db.insert(trackingEventsTable).values({
      shipmentId: s.id,
      status: parsed.data.status,
      message: parsed.data.note,
      location: s.destination,
      lat: 51.4816,
      lng: -3.1791,
    });
  }
  res.json(await getShipmentDto(s));
});

router.post("/admin/shipments/:id/events", requireAdmin(), async (req, res): Promise<void> => {
  const p = AdminAddTrackingEventParams.safeParse(req.params);
  if (!p.success) {
    res.status(400).json({ error: p.error.message });
    return;
  }
  const parsed = AdminAddTrackingEventBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const [e] = await db
    .insert(trackingEventsTable)
    .values({ ...parsed.data, shipmentId: p.data.id })
    .returning();
  if (!e) {
    res.status(500).json({ error: "Failed to create event" });
    return;
  }
  // Sync shipment status to latest event status
  await db.update(shipmentsTable).set({ status: parsed.data.status }).where(eq(shipmentsTable.id, p.data.id));
  res.status(201).json(e);
});

export default router;
