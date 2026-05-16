import { Router, type IRouter } from "express";
import { eq } from "drizzle-orm";
import { db, userSettingsTable } from "@workspace/db";
import { UpdateMySettingsBody } from "@workspace/api-zod";
import { requireAuth, getUser } from "../lib/auth";

const router: IRouter = Router();

router.get("/me/settings", requireAuth(), async (req, res): Promise<void> => {
  const user = getUser(req);
  let [s] = await db.select().from(userSettingsTable).where(eq(userSettingsTable.userId, user.id));
  if (!s) {
    [s] = await db.insert(userSettingsTable).values({ userId: user.id }).returning();
  }
  res.json({
    language: s!.language,
    theme: s!.theme,
    notifyEmail: s!.notifyEmail,
    notifyPush: s!.notifyPush,
  });
});

router.patch("/me/settings", requireAuth(), async (req, res): Promise<void> => {
  const parsed = UpdateMySettingsBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const user = getUser(req);
  await db.insert(userSettingsTable).values({ userId: user.id, ...parsed.data }).onConflictDoNothing();
  const [s] = await db
    .update(userSettingsTable)
    .set(parsed.data)
    .where(eq(userSettingsTable.userId, user.id))
    .returning();
  res.json({
    language: s!.language,
    theme: s!.theme,
    notifyEmail: s!.notifyEmail,
    notifyPush: s!.notifyPush,
  });
});

export default router;
