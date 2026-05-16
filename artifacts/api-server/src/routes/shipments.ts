import { Router, type IRouter } from "express";
import { and, desc, eq } from "drizzle-orm";
import { db, shipmentsTable, trackingEventsTable } from "@workspace/db";
import {
  ListShipmentsQueryParams,
  CreateShipmentBody,
  GetShipmentParams,
  ListShipmentEventsParams,
} from "@workspace/api-zod";
import { requireAuth, getUser } from "../lib/auth";
import { generateTrackingNumber, priceForShipment, getShipmentDto, shipmentsToDtos } from "../lib/shipments";

const router: IRouter = Router();

router.get("/shipments", requireAuth(), async (req, res): Promise<void> => {
  const q = ListShipmentsQueryParams.safeParse(req.query);
  if (!q.success) {
    res.status(400).json({ error: q.error.message });
    return;
  }
  const user = getUser(req);
  const where = q.data.status
    ? and(eq(shipmentsTable.userId, user.id), eq(shipmentsTable.status, q.data.status))
    : eq(shipmentsTable.userId, user.id);
  const rows = await db.select().from(shipmentsTable).where(where).orderBy(desc(shipmentsTable.createdAt));
  const dtos = await shipmentsToDtos(rows);
  res.json(dtos);
});

router.post("/shipments", requireAuth(), async (req, res): Promise<void> => {
  const parsed = CreateShipmentBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const user = getUser(req);
  const cost = priceForShipment(parsed.data.weightKg, parsed.data.service);
  const eta = new Date(Date.now() + 1000 * 60 * 60 * 24 * (parsed.data.service === "express" ? 1 : parsed.data.service === "international" ? 5 : 2));
  const [s] = await db
    .insert(shipmentsTable)
    .values({
      userId: user.id,
      trackingNumber: generateTrackingNumber(),
      service: parsed.data.service,
      origin: parsed.data.origin,
      destination: parsed.data.destination,
      recipientName: parsed.data.recipientName,
      recipientPhone: parsed.data.recipientPhone,
      weightKg: parsed.data.weightKg,
      notes: parsed.data.notes,
      costGbp: cost,
      eta,
      status: "pending",
    })
    .returning();
  if (!s) {
    res.status(500).json({ error: "Failed to create shipment" });
    return;
  }
  // Seed first event
  await db.insert(trackingEventsTable).values({
    shipmentId: s.id,
    status: "pending",
    message: "Shipment booked. Awaiting pickup.",
    location: s.origin,
    lat: 51.4816,
    lng: -3.1791,
  });
  res.status(201).json(await getShipmentDto(s));
});

router.get("/shipments/:id", requireAuth(), async (req, res): Promise<void> => {
  const p = GetShipmentParams.safeParse(req.params);
  if (!p.success) {
    res.status(400).json({ error: p.error.message });
    return;
  }
  const user = getUser(req);
  const [s] = await db.select().from(shipmentsTable).where(eq(shipmentsTable.id, p.data.id));
  if (!s || (s.userId !== user.id && user.role !== "admin")) {
    res.status(404).json({ error: "Shipment not found" });
    return;
  }
  res.json(await getShipmentDto(s));
});

router.get("/shipments/:id/events", requireAuth(), async (req, res): Promise<void> => {
  const p = ListShipmentEventsParams.safeParse(req.params);
  if (!p.success) {
    res.status(400).json({ error: p.error.message });
    return;
  }
  const user = getUser(req);
  const [s] = await db.select().from(shipmentsTable).where(eq(shipmentsTable.id, p.data.id));
  if (!s || (s.userId !== user.id && user.role !== "admin")) {
    res.status(404).json({ error: "Shipment not found" });
    return;
  }
  const events = await db
    .select()
    .from(trackingEventsTable)
    .where(eq(trackingEventsTable.shipmentId, p.data.id))
    .orderBy(desc(trackingEventsTable.createdAt));
  res.json(events);
});

export default router;
