import { pgTable, text, serial, integer, timestamp, doublePrecision } from "drizzle-orm/pg-core";
import { usersTable } from "./users";

export const shipmentsTable = pgTable("shipments", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => usersTable.id, { onDelete: "cascade" }),
  trackingNumber: text("tracking_number").notNull().unique(),
  status: text("status", {
    enum: ["pending", "picked_up", "in_transit", "out_for_delivery", "delivered", "exception", "cancelled"],
  }).notNull().default("pending"),
  service: text("service", { enum: ["domestic", "international", "express", "freight"] }).notNull(),
  origin: text("origin").notNull(),
  destination: text("destination").notNull(),
  recipientName: text("recipient_name").notNull(),
  recipientPhone: text("recipient_phone"),
  weightKg: doublePrecision("weight_kg").notNull(),
  costGbp: doublePrecision("cost_gbp").notNull(),
  eta: timestamp("eta", { withTimezone: true }),
  notes: text("notes"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow().$onUpdate(() => new Date()),
});

export const trackingEventsTable = pgTable("tracking_events", {
  id: serial("id").primaryKey(),
  shipmentId: integer("shipment_id").notNull().references(() => shipmentsTable.id, { onDelete: "cascade" }),
  status: text("status", {
    enum: ["pending", "picked_up", "in_transit", "out_for_delivery", "delivered", "exception", "cancelled"],
  }).notNull(),
  message: text("message").notNull(),
  location: text("location").notNull(),
  lat: doublePrecision("lat").notNull(),
  lng: doublePrecision("lng").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export type Shipment = typeof shipmentsTable.$inferSelect;
export type TrackingEvent = typeof trackingEventsTable.$inferSelect;
