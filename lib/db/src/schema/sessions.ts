import { pgTable, text, timestamp, jsonb, index } from "drizzle-orm/pg-core";

// Required by connect-pg-simple
export const sessionsTable = pgTable(
  "session",
  {
    sid: text("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire", { withTimezone: false, precision: 6 }).notNull(),
  },
  (t) => [index("IDX_session_expire").on(t.expire)],
);
