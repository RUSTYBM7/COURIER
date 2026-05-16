import { Router, type IRouter } from "express";
import { asc, desc, eq, and, sql } from "drizzle-orm";
import { db, messageThreadsTable, chatMessagesTable } from "@workspace/db";
import { GetMessageThreadParams, SendMessageBody, SendMessageParams } from "@workspace/api-zod";
import { requireAuth, getUser } from "../lib/auth";

const router: IRouter = Router();

router.get("/messages", requireAuth(), async (req, res): Promise<void> => {
  const user = getUser(req);
  const rows = await db
    .select()
    .from(messageThreadsTable)
    .where(eq(messageThreadsTable.userId, user.id))
    .orderBy(desc(messageThreadsTable.lastMessageAt));
  res.json(rows);
});

router.get("/messages/:threadId", requireAuth(), async (req, res): Promise<void> => {
  const p = GetMessageThreadParams.safeParse(req.params);
  if (!p.success) {
    res.status(400).json({ error: p.error.message });
    return;
  }
  const user = getUser(req);
  const [thread] = await db.select().from(messageThreadsTable).where(eq(messageThreadsTable.id, p.data.threadId));
  if (!thread || thread.userId !== user.id) {
    res.status(404).json({ error: "Thread not found" });
    return;
  }
  // Mark read
  await db.update(messageThreadsTable).set({ unreadCount: 0 }).where(eq(messageThreadsTable.id, thread.id));
  const messages = await db
    .select()
    .from(chatMessagesTable)
    .where(eq(chatMessagesTable.threadId, thread.id))
    .orderBy(asc(chatMessagesTable.createdAt));
  res.json(messages);
});

router.post("/messages/:threadId", requireAuth(), async (req, res): Promise<void> => {
  const p = SendMessageParams.safeParse(req.params);
  if (!p.success) {
    res.status(400).json({ error: p.error.message });
    return;
  }
  const parsed = SendMessageBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const user = getUser(req);
  const [thread] = await db.select().from(messageThreadsTable).where(eq(messageThreadsTable.id, p.data.threadId));
  if (!thread || thread.userId !== user.id) {
    res.status(404).json({ error: "Thread not found" });
    return;
  }
  const [m] = await db
    .insert(chatMessagesTable)
    .values({
      threadId: thread.id,
      userId: user.id,
      fromMe: true,
      authorName: user.name,
      body: parsed.data.body,
    })
    .returning();
  await db
    .update(messageThreadsTable)
    .set({ lastMessage: parsed.data.body, lastMessageAt: new Date() })
    .where(eq(messageThreadsTable.id, thread.id));

  // Simulated auto-reply from support after a tick
  await db.insert(chatMessagesTable).values({
    threadId: thread.id,
    fromMe: false,
    authorName: thread.participantName,
    body: "Thanks for getting in touch. An Airpak agent will follow up shortly.",
  });
  await db
    .update(messageThreadsTable)
    .set({ unreadCount: sql`${messageThreadsTable.unreadCount} + 1`, lastMessageAt: new Date() })
    .where(eq(messageThreadsTable.id, thread.id));

  res.status(201).json(m);
});

export default router;
