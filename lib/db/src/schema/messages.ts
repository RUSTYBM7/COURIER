import { pgTable, text, serial, integer, timestamp, boolean } from "drizzle-orm/pg-core";
import { usersTable } from "./users";
import { shipmentsTable } from "./shipments";

export const messageThreadsTable = pgTable("message_threads", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => usersTable.id, { onDelete: "cascade" }),
  subject: text("subject").notNull(),
  participantName: text("participant_name").notNull().default("Airpak Support"),
  shipmentId: integer("shipment_id").references(() => shipmentsTable.id, { onDelete: "set null" }),
  lastMessage: text("last_message").notNull().default(""),
  lastMessageAt: timestamp("last_message_at", { withTimezone: true }).notNull().defaultNow(),
  unreadCount: integer("unread_count").notNull().default(0),
});

export const chatMessagesTable = pgTable("chat_messages", {
  id: serial("id").primaryKey(),
  threadId: integer("thread_id").notNull().references(() => messageThreadsTable.id, { onDelete: "cascade" }),
  userId: integer("user_id").references(() => usersTable.id, { onDelete: "set null" }),
  fromMe: boolean("from_me").notNull(),
  authorName: text("author_name").notNull(),
  body: text("body").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export type MessageThread = typeof messageThreadsTable.$inferSelect;
export type ChatMessage = typeof chatMessagesTable.$inferSelect;
