session_fix = '''import session from "express-session";
import createMemoryStore from "memorystore";

const MemoryStore = createMemoryStore(session);
const isProd = process.env["NODE_ENV"] === "production";

// Validate session secret in production
const envSecret = process.env["SESSION_SECRET"];
if (isProd) {
  if (!envSecret) {
    throw new Error(
      "SESSION_SECRET environment variable must be set in production. " +
      "Generate one with: openssl rand -base64 32"
    );
  }
  if (envSecret.length < 32) {
    throw new Error(
      "SESSION_SECRET must be at least 32 characters long in production."
    );
  }
}

const SESSION_SECRET = envSecret ?? "airpak-dev-secret-change-me";

// Session store configuration
const store = isProd
  ? new MemoryStore({
      checkPeriod: 86400000, // Prune expired entries every 24h
    })
  : new MemoryStore({
      checkPeriod: 86400000,
    });

export const sessionMiddleware = session({
  store,
  secret: SESSION_SECRET,
  name: "airpak.sid", // Custom session cookie name (security through obscurity)
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: isProd, // HTTPS only in production
    httpOnly: true, // Prevent XSS access to cookie
    maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
    sameSite: isProd ? "strict" : "lax", // CSRF protection
    domain: isProd ? ".airpak-express.site" : undefined,
  },
});

// Extend session types
declare module "express-session" {
  interface SessionData {
    userId?: number;
    email?: string;
    role?: string;
    csrfToken?: string;
  }
}
'''

with open('/mnt/agents/output/airpak-repair/session.ts', 'w') as f:
    f.write(session_fix)

