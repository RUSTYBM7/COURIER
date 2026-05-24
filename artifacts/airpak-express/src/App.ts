app_ts_fix = '''import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import cookieParser from "cookie-parser";
import { sessionMiddleware } from "./lib/session";
import { registerRoutes } from "./routes";

const isProd = process.env["NODE_ENV"] === "production";

export async function createApp() {
  const app = express();

  // Trust proxy (required for secure cookies behind reverse proxy)
  app.set("trust proxy", 1);

  // Security headers via Helmet
  app.use(helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
        fontSrc: ["'self'", "https://fonts.gstatic.com"],
        scriptSrc: ["'self'"],
        imgSrc: ["'self'", "data:", "https:"],
        connectSrc: ["'self'", isProd ? "https://airpak-express.site" : "http://localhost:5173"],
      },
    },
    crossOriginEmbedderPolicy: false, // Allow embedding if needed
  }));

  // CORS - Restrict to known origins in production
  const allowedOrigins = isProd
    ? ["https://airpak-express.site", "https://www.airpak-express.site"]
    : ["http://localhost:5173", "http://localhost:3000", "http://localhost:5000"];

  app.use(cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (mobile apps, curl, etc.)
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) return callback(null, true);
      if (!isProd) return callback(null, true); // Allow all in dev
      callback(new Error(`CORS policy: Origin ${origin} not allowed`));
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
  }));

  // Rate limiting
  const limiter = rateLimit({
    windowMs: parseInt(process.env["RATE_LIMIT_WINDOW_MS"] || "900000"), // 15 minutes
    max: parseInt(process.env["RATE_LIMIT_MAX_REQUESTS"] || "100"),
    message: { error: "Too many requests, please try again later." },
    standardHeaders: true,
    legacyHeaders: false,
  });
  app.use("/api/", limiter);

  // Stricter rate limiting for auth endpoints
  const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 10, // 10 attempts per window
    message: { error: "Too many authentication attempts, please try again later." },
    skipSuccessfulRequests: true,
  });
  app.use("/api/auth/", authLimiter);

  // Body parsing
  app.use(express.json({ limit: "10mb" }));
  app.use(express.urlencoded({ extended: true, limit: "10mb" }));
  app.use(cookieParser());

  // Session middleware
  app.use(sessionMiddleware);

  // Request logging (development only)
  if (!isProd) {
    app.use((req, res, next) => {
      console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
      next();
    });
  }

  // Register all routes
  await registerRoutes(app);

  // Health check endpoint
  app.get("/health", (req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
  });

  // 404 handler
  app.use((req, res) => {
    res.status(404).json({ error: "Not found" });
  });

  // Global error handler
  app.use((err: any, req: express.Request, res: express.Response, _next: express.NextFunction) => {
    console.error("Error:", err);
    
    // Don't leak error details in production
    const message = isProd && err.status !== 400 
      ? "Internal server error" 
      : err.message || "Internal server error";
    
    res.status(err.status || 500).json({
      error: message,
      ...(isProd ? {} : { stack: err.stack }),
    });
  });

  return app;
}
'''

with open('/mnt/agents/output/airpak-repair/app.ts', 'w') as f:
    f.write(app_ts_fix)

