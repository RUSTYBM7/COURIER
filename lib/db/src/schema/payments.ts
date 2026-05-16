import { pgTable, text, serial, integer, timestamp, doublePrecision } from "drizzle-orm/pg-core";
import { usersTable } from "./users";
import { shipmentsTable } from "./shipments";

export const paymentsTable = pgTable("payments", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => usersTable.id, { onDelete: "cascade" }),
  shipmentId: integer("shipment_id").references(() => shipmentsTable.id, { onDelete: "set null" }),
  amountGbp: doublePrecision("amount_gbp").notNull(),
  status: text("status", { enum: ["paid", "pending", "failed", "refunded"] }).notNull().default("paid"),
  method: text("method", { enum: ["card", "applepay", "googlepay", "bank"] }).notNull(),
  reference: text("reference").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export type Payment = typeof paymentsTable.$inferSelect;
