auth_backend_fix = '''import { Router } from "express";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { db } from "@db";
import { users, passwordResetTokens } from "@db/schema";
import { eq, and, gt } from "drizzle-orm";
import crypto from "crypto";

const router = Router();

// Validation schemas
const signinSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

const signupSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  company: z.string().optional(),
});

const resetRequestSchema = z.object({
  email: z.string().email("Invalid email address"),
});

const resetSchema = z.object({
  token: z.string().min(1, "Token is required"),
  newPassword: z.string().min(8, "Password must be at least 8 characters"),
});

// Helper: Generate secure token
function generateToken(): string {
  return crypto.randomBytes(32).toString("hex");
}

// Helper: Hash password with strong rounds
async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12);
}

// POST /api/auth/signin
router.post("/signin", async (req, res) => {
  try {
    const data = signinSchema.parse(req.body);
    
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.email, data.email.toLowerCase().trim()))
      .limit(1);
    
    if (!user) {
      return res.status(401).json({ error: "Invalid email or password" });
    }
    
    const valid = await bcrypt.compare(data.password, user.passwordHash);
    if (!valid) {
      return res.status(401).json({ error: "Invalid email or password" });
    }
    
    // Update last login
    await db
      .update(users)
      .set({ lastLoginAt: new Date() })
      .where(eq(users.id, user.id));
    
    // Set session
    req.session.userId = user.id;
    req.session.email = user.email;
    req.session.role = user.role;
    
    res.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        company: user.company,
        emailVerified: user.emailVerified,
        plan: user.plan,
      },
    });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return res.status(400).json({ error: err.errors[0].message });
    }
    console.error("Signin error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// POST /api/auth/signup
router.post("/signup", async (req, res) => {
  try {
    const data = signupSchema.parse(req.body);
    
    // Check if email exists
    const [existing] = await db
      .select()
      .from(users)
      .where(eq(users.email, data.email.toLowerCase().trim()))
      .limit(1);
    
    if (existing) {
      return res.status(409).json({ error: "An account with this email already exists" });
    }
    
    const passwordHash = await hashPassword(data.password);
    
    const [user] = await db
      .insert(users)
      .values({
        name: data.name,
        email: data.email.toLowerCase().trim(),
        passwordHash,
        company: data.company || null,
        role: "user",
        emailVerified: false,
        plan: "free",
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      .returning();
    
    // Set session
    req.session.userId = user.id;
    req.session.email = user.email;
    req.session.role = user.role;
    
    res.status(201).json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        company: user.company,
        emailVerified: user.emailVerified,
        plan: user.plan,
      },
    });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return res.status(400).json({ error: err.errors[0].message });
    }
    console.error("Signup error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// POST /api/auth/signout
router.post("/signout", async (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error("Signout error:", err);
      return res.status(500).json({ error: "Failed to sign out" });
    }
    res.clearCookie("airpak.sid");
    res.json({ ok: true });
  });
});

// GET /api/auth/me
router.get("/me", async (req, res) => {
  try {
    if (!req.session.userId) {
      return res.json({ user: null });
    }
    
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.id, req.session.userId))
      .limit(1);
    
    if (!user) {
      req.session.destroy(() => {});
      return res.json({ user: null });
    }
    
    res.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        company: user.company,
        phone: user.phone,
        emailVerified: user.emailVerified,
        plan: user.plan,
        twoFactorEnabled: user.twoFactorEnabled,
      },
    });
  } catch (err) {
    console.error("Me error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// POST /api/auth/reset-request
router.post("/reset-request", async (req, res) => {
  try {
    const data = resetRequestSchema.parse(req.body);
    
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.email, data.email.toLowerCase().trim()))
      .limit(1);
    
    // Always return success to prevent email enumeration
    if (!user) {
      return res.json({ 
        ok: true, 
        message: "If an account exists, reset instructions have been sent." 
      });
    }
    
    // Generate token
    const token = generateToken();
    const expiresAt = new Date(Date.now() + 1000 * 60 * 60); // 1 hour
    
    // Invalidate old tokens
    await db
      .delete(passwordResetTokens)
      .where(eq(passwordResetTokens.userId, user.id));
    
    // Store new token
    await db
      .insert(passwordResetTokens)
      .values({
        userId: user.id,
        token,
        expiresAt,
        used: false,
        createdAt: new Date(),
      });
    
    // TODO: Send email with reset link
    // const resetUrl = `${process.env.PUBLIC_BASE_URL}/reset-password?token=${token}`;
    // await sendEmail({ to: user.email, template: 'password-reset', data: { resetUrl } });
    
    // For now, log the token (remove in production)
    if (process.env.NODE_ENV !== "production") {
      console.log(`[DEV] Password reset token for ${user.email}: ${token}`);
    }
    
    res.json({ 
      ok: true, 
      message: "If an account exists, reset instructions have been sent." 
    });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return res.status(400).json({ error: err.errors[0].message });
    }
    console.error("Reset request error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// POST /api/auth/reset
router.post("/reset", async (req, res) => {
  try {
    const data = resetSchema.parse(req.body);
    
    // Find valid token
    const [tokenRecord] = await db
      .select()
      .from(passwordResetTokens)
      .where(
        and(
          eq(passwordResetTokens.token, data.token),
          eq(passwordResetTokens.used, false),
          gt(passwordResetTokens.expiresAt, new Date())
        )
      )
      .limit(1);
    
    if (!tokenRecord) {
      return res.status(400).json({ error: "Invalid or expired reset token" });
    }
    
    // Hash new password
    const passwordHash = await hashPassword(data.newPassword);
    
    // Update user password
    await db
      .update(users)
      .set({ 
        passwordHash,
        updatedAt: new Date(),
      })
      .where(eq(users.id, tokenRecord.userId));
    
    // Mark token as used
    await db
      .update(passwordResetTokens)
      .set({ used: true })
      .where(eq(passwordResetTokens.id, tokenRecord.id));
    
    // Invalidate all sessions for this user
    // (In production, you might want to store session IDs in DB)
    
    res.json({ ok: true, message: "Password reset successfully" });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return res.status(400).json({ error: err.errors[0].message });
    }
    console.error("Reset error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
'''

with open('/mnt/agents/output/airpak-repair/auth-backend.ts', 'w') as f:
    f.write(auth_backend_fix)

