import { db, shipmentsTable, trackingEventsTable, type Shipment, type TrackingEvent } from "@workspace/db";
import { desc, eq, inArray, sql } from "drizzle-orm";

export function generateTrackingNumber(): string {
  const ts = Date.now().toString(36).toUpperCase();
  const rnd = Math.random().toString(36).slice(2, 8).toUpperCase();
  return `AP${ts}${rnd}`;
}

export function priceForShipment(weightKg: number, service: string): number {
  const base = { domestic: 5.99, international: 18.5, express: 14.5, freight: 49 }[service] ?? 9.99;
  const perKg = { domestic: 1.2, international: 3.4, express: 2.6, freight: 0.9 }[service] ?? 1.5;
  return Math.round((base + weightKg * perKg) * 100) / 100;
}

export async function latestEventsFor(shipmentIds: number[]): Promise<Map<number, TrackingEvent>> {
  const map = new Map<number, TrackingEvent>();
  if (shipmentIds.length === 0) return map;
  // Pull all events for these shipments, then keep the latest per shipment
  const rows = await db
    .select()
    .from(trackingEventsTable)
    .where(inArray(trackingEventsTable.shipmentId, shipmentIds))
    .orderBy(desc(trackingEventsTable.createdAt));
  for (const r of rows) {
    if (!map.has(r.shipmentId)) map.set(r.shipmentId, r);
  }
  return map;
}

export function shipmentToDto(s: Shipment, latest: TrackingEvent | null) {
  return {
    id: s.id,
    userId: s.userId,
    trackingNumber: s.trackingNumber,
    status: s.status,
    service: s.service,
    origin: s.origin,
    destination: s.destination,
    recipientName: s.recipientName,
    recipientPhone: s.recipientPhone,
    weightKg: s.weightKg,
    costGbp: s.costGbp,
    eta: s.eta,
    createdAt: s.createdAt,
    updatedAt: s.updatedAt,
    latestEvent: latest ?? null,
  };
}

export async function getShipmentDto(s: Shipment) {
  const map = await latestEventsFor([s.id]);
  return shipmentToDto(s, map.get(s.id) ?? null);
}

export async function shipmentsToDtos(shipments: Shipment[]) {
  const map = await latestEventsFor(shipments.map((s) => s.id));
  return shipments.map((s) => shipmentToDto(s, map.get(s.id) ?? null));
}

export async function countByStatus(): Promise<{ status: string; count: number }[]> {
  const rows = await db
    .select({ status: shipmentsTable.status, count: sql<number>`count(*)::int` })
    .from(shipmentsTable)
    .groupBy(shipmentsTable.status);
  return rows;
}

export async function countByStatusForUser(userId: number): Promise<{ status: string; count: number }[]> {
  const rows = await db
    .select({ status: shipmentsTable.status, count: sql<number>`count(*)::int` })
    .from(shipmentsTable)
    .where(eq(shipmentsTable.userId, userId))
    .groupBy(shipmentsTable.status);
  return rows;
}
