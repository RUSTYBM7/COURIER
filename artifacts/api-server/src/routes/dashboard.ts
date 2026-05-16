import { Router, type IRouter } from "express";
import { desc, eq, sql } from "drizzle-orm";
import { db, shipmentsTable, paymentsTable, chatMessagesTable, messageThreadsTable } from "@workspace/db";
import { requireAuth, getUser } from "../lib/auth";
import { countByStatusForUser } from "../lib/shipments";

const router: IRouter = Router();

const ACTIVE = ["pending", "picked_up", "in_transit", "out_for_delivery"];

router.get("/dashboard/summary", requireAuth(), async (req, res): Promise<void> => {
  const user = getUser(req);
  const breakdown = await countByStatusForUser(user.id);
  const active = breakdown.filter((b) => ACTIVE.includes(b.status)).reduce((a, b) => a + b.count, 0);
  const inTransit = breakdown.find((b) => b.status === "in_transit")?.count ?? 0;
  const delivered = breakdown.find((b) => b.status === "delivered")?.count ?? 0;
  const exceptions = breakdown.find((b) => b.status === "exception")?.count ?? 0;
  const [spent] = await db
    .select({ total: sql<number>`coalesce(sum(${paymentsTable.amountGbp}), 0)::float` })
    .from(paymentsTable)
    .where(eq(paymentsTable.userId, user.id));
  res.json({
    activeShipments: active,
    inTransit,
    delivered,
    exceptions,
    spentGbp: spent?.total ?? 0,
    lastUpdated: new Date(),
    statusBreakdown: breakdown,
  });
});

router.get("/dashboard/activity", requireAuth(), async (req, res): Promise<void> => {
  const user = getUser(req);
  const shipments = await db
    .select()
    .from(shipmentsTable)
    .where(eq(shipmentsTable.userId, user.id))
    .orderBy(desc(shipmentsTable.createdAt))
    .limit(10);
  const payments = await db
    .select()
    .from(paymentsTable)
    .where(eq(paymentsTable.userId, user.id))
    .orderBy(desc(paymentsTable.createdAt))
    .limit(5);
  const recentMsgs = await db
    .select({
      id: chatMessagesTable.id,
      body: chatMessagesTable.body,
      createdAt: chatMessagesTable.createdAt,
      threadId: chatMessagesTable.threadId,
      authorName: chatMessagesTable.authorName,
    })
    .from(chatMessagesTable)
    .innerJoin(messageThreadsTable, eq(chatMessagesTable.threadId, messageThreadsTable.id))
    .where(eq(messageThreadsTable.userId, user.id))
    .orderBy(desc(chatMessagesTable.createdAt))
    .limit(5);

  const items = [
    ...shipments.map((s) => ({
      id: s.id,
      kind: "shipment" as const,
      title: `Shipment ${s.trackingNumber}`,
      description: `${s.origin} → ${s.destination} (${s.status.replace("_", " ")})`,
      shipmentId: s.id,
      createdAt: s.createdAt,
    })),
    ...payments.map((p) => ({
      id: 100000 + p.id,
      kind: "payment" as const,
      title: `Payment £${p.amountGbp.toFixed(2)}`,
      description: `Reference ${p.reference} (${p.method})`,
      shipmentId: p.shipmentId,
      createdAt: p.createdAt,
    })),
    ...recentMsgs.map((m) => ({
      id: 200000 + m.id,
      kind: "message" as const,
      title: `Message from ${m.authorName}`,
      description: m.body.length > 80 ? m.body.slice(0, 80) + "…" : m.body,
      shipmentId: null,
      createdAt: m.createdAt,
    })),
  ]
    .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
    .slice(0, 20);

  res.json(items);
});

export default router;
