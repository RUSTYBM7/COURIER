import session from "express-session";
import connectPgSimple from "connect-pg-simple";
import { pool } from "@workspace/db";
import type { RequestHandler } from "express";

const PgStore = connectPgSimple(session);

const isProd = process.env["NODE_ENV"] === "production";
const envSecret = process.env["SESSION_SECRET"];
if (isProd && !envSecret) {
  throw new Error("SESSION_SECRET environment variable must be set in production");
}
const SESSION_SECRET = envSecret ?? "airpak-dev-secret-change-me";

export const sessionMiddleware: RequestHandler = session({
  store: new PgStore({
    pool,
    tableName: "session",
    createTableIfMissing: false,
  }),
  secret: SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  rolling: true,
  cookie: {
    httpOnly: true,
    secure: isProd,
    sameSite: "lax",
    maxAge: 1000 * 60 * 60 * 24 * 30,
  },
});

declare module "express-session" {
  interface SessionData {
    userId?: number;
  }
}
