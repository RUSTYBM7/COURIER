import { pgTable, text, serial } from "drizzle-orm/pg-core";

export const faqsTable = pgTable("faqs", {
  id: serial("id").primaryKey(),
  category: text("category").notNull(),
  question: text("question").notNull(),
  answer: text("answer").notNull(),
});

export type Faq = typeof faqsTable.$inferSelect;
