import { Router, type IRouter } from "express";
import { desc, eq } from "drizzle-orm";
import { db, shipmentsTable, trackingEventsTable } from "@workspace/db";
import { TrackByNumberParams } from "@workspace/api-zod";
import { getShipmentDto } from "../lib/shipments";

const router: IRouter = Router();

router.get("/tracking/:number", async (req, res): Promise<void> => {
  const p = TrackByNumberParams.safeParse(req.params);
  if (!p.success) {
    res.status(400).json({ error: p.error.message });
    return;
  }
  const [s] = await db.select().from(shipmentsTable).where(eq(shipmentsTable.trackingNumber, p.data.number.toUpperCase()));
  if (!s) {
    res.status(404).json({ error: "Tracking number not found" });
    return;
  }
  const events = await db
    .select()
    .from(trackingEventsTable)
    .where(eq(trackingEventsTable.shipmentId, s.id))
    .orderBy(desc(trackingEventsTable.createdAt));
  res.json({ shipment: await getShipmentDto(s), events });
});

export default router;
