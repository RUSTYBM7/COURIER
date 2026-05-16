import type { Request, Response, NextFunction } from "express";
import { db, usersTable, type User } from "@workspace/db";
import { eq } from "drizzle-orm";

export async function loadUser(req: Request): Promise<User | null> {
  const uid = req.session?.userId;
  if (!uid) return null;
  const [u] = await db.select().from(usersTable).where(eq(usersTable.id, uid));
  return u ?? null;
}

export function requireAuth(): (req: Request, res: Response, next: NextFunction) => Promise<void> {
  return async (req, res, next) => {
    const user = await loadUser(req);
    if (!user) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }
    (req as Request & { user: User }).user = user;
    next();
  };
}

export function requireAdmin(): (req: Request, res: Response, next: NextFunction) => Promise<void> {
  return async (req, res, next) => {
    const user = await loadUser(req);
    if (!user) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }
    if (user.role !== "admin") {
      res.status(403).json({ error: "Forbidden" });
      return;
    }
    (req as Request & { user: User }).user = user;
    next();
  };
}

export function getUser(req: Request): User {
  return (req as Request & { user: User }).user;
}

export function userToDto(u: User) {
  return {
    id: u.id,
    email: u.email,
    name: u.name,
    avatarUrl: u.avatarUrl,
    role: u.role,
    createdAt: u.createdAt,
  };
}
