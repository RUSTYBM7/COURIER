import { pgTable, text, serial, timestamp, boolean } from "drizzle-orm/pg-core";

export const usersTable = pgTable("users", {
  id: serial("id").primaryKey(),
  email: text("email").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  name: text("name").notNull(),
  avatarUrl: text("avatar_url"),
  role: text("role", { enum: ["customer", "admin"] }).notNull().default("customer"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const userSettingsTable = pgTable("user_settings", {
  userId: serial("user_id").primaryKey().references(() => usersTable.id, { onDelete: "cascade" }),
  language: text("language", { enum: ["en", "zh", "ms", "ar"] }).notNull().default("en"),
  theme: text("theme", { enum: ["light", "dark", "system"] }).notNull().default("light"),
  notifyEmail: boolean("notify_email").notNull().default(true),
  notifyPush: boolean("notify_push").notNull().default(false),
});

export type User = typeof usersTable.$inferSelect;
export type UserSettings = typeof userSettingsTable.$inferSelect;
