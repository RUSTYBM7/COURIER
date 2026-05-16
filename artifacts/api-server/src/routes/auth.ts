import { Router, type IRouter } from "express";
import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";
import { db, usersTable, userSettingsTable } from "@workspace/db";
import { SignInBody, SignUpBody, RequestPasswordResetBody } from "@workspace/api-zod";
import { loadUser, userToDto } from "../lib/auth";

const router: IRouter = Router();

router.get("/auth/me", async (req, res): Promise<void> => {
  const user = await loadUser(req);
  res.json({ user: user ? userToDto(user) : null });
});

router.post("/auth/signin", async (req, res): Promise<void> => {
  const parsed = SignInBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const [u] = await db.select().from(usersTable).where(eq(usersTable.email, parsed.data.email.toLowerCase()));
  if (!u || !bcrypt.compareSync(parsed.data.password, u.passwordHash)) {
    res.status(401).json({ error: "Invalid email or password" });
    return;
  }
  req.session.userId = u.id;
  res.json({ user: userToDto(u) });
});

router.post("/auth/signup", async (req, res): Promise<void> => {
  const parsed = SignUpBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const email = parsed.data.email.toLowerCase();
  const [existing] = await db.select().from(usersTable).where(eq(usersTable.email, email));
  if (existing) {
    res.status(409).json({ error: "Email already registered" });
    return;
  }
  const hash = bcrypt.hashSync(parsed.data.password, 10);
  const [u] = await db
    .insert(usersTable)
    .values({ email, passwordHash: hash, name: parsed.data.name, role: "customer" })
    .returning();
  if (!u) {
    res.status(500).json({ error: "Failed to create user" });
    return;
  }
  await db.insert(userSettingsTable).values({ userId: u.id }).onConflictDoNothing();
  req.session.userId = u.id;
  res.status(201).json({ user: userToDto(u) });
});

router.post("/auth/signout", (req, res): void => {
  req.session.destroy(() => {
    res.clearCookie("connect.sid");
    res.status(204).end();
  });
});

router.post("/auth/reset", async (req, res): Promise<void> => {
  const parsed = RequestPasswordResetBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  // Simulated: always returns ok
  res.json({ ok: true });
});

export default router;
