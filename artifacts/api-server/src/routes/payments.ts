import { Router, type IRouter } from "express";
import { desc, eq } from "drizzle-orm";
import { db, paymentsTable, shipmentsTable } from "@workspace/db";
import { CreatePaymentBody } from "@workspace/api-zod";
import { requireAuth, getUser } from "../lib/auth";

const router: IRouter = Router();

router.get("/payments", requireAuth(), async (req, res): Promise<void> => {
  const user = getUser(req);
  const rows = await db
    .select()
    .from(paymentsTable)
    .where(eq(paymentsTable.userId, user.id))
    .orderBy(desc(paymentsTable.createdAt));
  res.json(rows);
});

router.post("/payments", requireAuth(), async (req, res): Promise<void> => {
  const parsed = CreatePaymentBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const user = getUser(req);
  const [s] = await db.select().from(shipmentsTable).where(eq(shipmentsTable.id, parsed.data.shipmentId));
  if (!s || s.userId !== user.id) {
    res.status(404).json({ error: "Shipment not found" });
    return;
  }
  const ref = `AP-PAY-${Date.now().toString(36).toUpperCase()}`;
  const [p] = await db
    .insert(paymentsTable)
    .values({
      userId: user.id,
      shipmentId: parsed.data.shipmentId,
      amountGbp: parsed.data.amountGbp,
      method: parsed.data.method,
      status: "paid",
      reference: ref,
    })
    .returning();
  res.status(201).json(p);
});

export default router;
