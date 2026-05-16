import { Router, type IRouter } from "express";
import { asc } from "drizzle-orm";
import { db, faqsTable } from "@workspace/db";

const router: IRouter = Router();

router.get("/faqs", async (_req, res): Promise<void> => {
  const rows = await db.select().from(faqsTable).orderBy(asc(faqsTable.category), asc(faqsTable.id));
  res.json(rows);
});

export default router;
