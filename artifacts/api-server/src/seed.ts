import bcrypt from "bcryptjs";
import { db, pool, usersTable, userSettingsTable, shipmentsTable, trackingEventsTable, messageThreadsTable, chatMessagesTable, paymentsTable, faqsTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import { logger } from "./lib/logger";

async function main() {
  logger.info("Seeding database…");

  // ---- Users -----------------------------------------------------------
  const existing = await db.select().from(usersTable);
  let demoId: number, adminId: number;

  if (existing.length === 0) {
    const [demo] = await db
      .insert(usersTable)
      .values({
        email: "demo@airpak.com",
        passwordHash: bcrypt.hashSync("demo1234", 10),
        name: "Alex Morgan",
        role: "customer",
      })
      .returning();
    const [admin] = await db
      .insert(usersTable)
      .values({
        email: "admin@airpak.com",
        passwordHash: bcrypt.hashSync("admin1234", 10),
        name: "Sam Reilly",
        role: "admin",
      })
      .returning();
    demoId = demo!.id;
    adminId = admin!.id;
    await db.insert(userSettingsTable).values([
      { userId: demoId, language: "en", theme: "light" },
      { userId: adminId, language: "en", theme: "dark" },
    ]);
  } else {
    demoId = existing.find((u) => u.email === "demo@airpak.com")?.id ?? existing[0]!.id;
    adminId = existing.find((u) => u.email === "admin@airpak.com")?.id ?? demoId;
  }

  // ---- Shipments -------------------------------------------------------
  const shipmentsExisting = await db.select().from(shipmentsTable).where(eq(shipmentsTable.userId, demoId));
  if (shipmentsExisting.length === 0) {
    const samples = [
      { tn: "AP1A2B3C4D", status: "in_transit" as const, service: "express" as const, origin: "Cardiff, UK", dest: "Berlin, DE", recipient: "Lena Schmidt", weight: 2.4, cost: 22.5, lat: 50.9375, lng: 6.96 },
      { tn: "AP5E6F7G8H", status: "delivered" as const, service: "international" as const, origin: "Cardiff, UK", dest: "Kuala Lumpur, MY", recipient: "Ahmad Faizal", weight: 5.2, cost: 92.3, lat: 3.139, lng: 101.6869 },
      { tn: "AP9I0J1K2L", status: "out_for_delivery" as const, service: "domestic" as const, origin: "Cardiff, UK", dest: "London, UK", recipient: "Priya Shah", weight: 1.1, cost: 7.5, lat: 51.5074, lng: -0.1278 },
      { tn: "AP3M4N5O6P", status: "pending" as const, service: "freight" as const, origin: "Cardiff, UK", dest: "Shanghai, CN", recipient: "Wei Zhang", weight: 120, cost: 350, lat: 31.2304, lng: 121.4737 },
      { tn: "AP7Q8R9S0T", status: "exception" as const, service: "international" as const, origin: "Cardiff, UK", dest: "Dubai, AE", recipient: "Yusuf Hassan", weight: 3.8, cost: 41.2, lat: 25.2048, lng: 55.2708 },
    ];
    for (const s of samples) {
      const eta = new Date(Date.now() + 1000 * 60 * 60 * 24 * (s.service === "express" ? 1 : s.service === "international" ? 4 : 2));
      const [ship] = await db
        .insert(shipmentsTable)
        .values({
          userId: demoId,
          trackingNumber: s.tn,
          status: s.status,
          service: s.service,
          origin: s.origin,
          destination: s.dest,
          recipientName: s.recipient,
          recipientPhone: "+44 7700 900000",
          weightKg: s.weight,
          costGbp: s.cost,
          eta,
        })
        .returning();
      // event timeline
      const events: { status: "pending" | "picked_up" | "in_transit" | "out_for_delivery" | "delivered" | "exception"; message: string; location: string; lat: number; lng: number; offsetH: number }[] = [
        { status: "pending", message: "Shipment booked", location: s.origin, lat: 51.4816, lng: -3.1791, offsetH: -72 },
        { status: "picked_up", message: "Picked up by courier", location: s.origin, lat: 51.4816, lng: -3.1791, offsetH: -60 },
        { status: "in_transit", message: "Departed origin hub", location: "Cardiff Airport", lat: 51.3967, lng: -3.3433, offsetH: -48 },
      ];
      if (s.status === "out_for_delivery" || s.status === "delivered") {
        events.push({ status: "out_for_delivery", message: "Out for delivery", location: s.dest, lat: s.lat, lng: s.lng, offsetH: -4 });
      }
      if (s.status === "delivered") {
        events.push({ status: "delivered", message: "Delivered to recipient", location: s.dest, lat: s.lat, lng: s.lng, offsetH: -1 });
      }
      if (s.status === "exception") {
        events.push({ status: "exception", message: "Customs hold — documents requested", location: s.dest, lat: s.lat, lng: s.lng, offsetH: -2 });
      }
      for (const e of events) {
        await db.insert(trackingEventsTable).values({
          shipmentId: ship!.id,
          status: e.status,
          message: e.message,
          location: e.location,
          lat: e.lat,
          lng: e.lng,
          createdAt: new Date(Date.now() + e.offsetH * 60 * 60 * 1000),
        });
      }
      if (s.status === "delivered" || s.status === "in_transit" || s.status === "out_for_delivery") {
        await db.insert(paymentsTable).values({
          userId: demoId,
          shipmentId: ship!.id,
          amountGbp: s.cost,
          status: "paid",
          method: "applepay",
          reference: `AP-PAY-${ship!.id}${Date.now().toString(36).toUpperCase().slice(-4)}`,
        });
      }
    }
  }

  // ---- Messages --------------------------------------------------------
  const threads = await db.select().from(messageThreadsTable).where(eq(messageThreadsTable.userId, demoId));
  if (threads.length === 0) {
    const [t1] = await db.insert(messageThreadsTable).values({
      userId: demoId,
      subject: "Customs documentation",
      participantName: "Airpak Support",
      lastMessage: "We've received your customs forms — processing now.",
      unreadCount: 1,
      lastMessageAt: new Date(Date.now() - 1000 * 60 * 25),
    }).returning();
    const [t2] = await db.insert(messageThreadsTable).values({
      userId: demoId,
      subject: "Pickup confirmation",
      participantName: "Cardiff Hub",
      lastMessage: "Courier scheduled for Friday between 10am – 12pm.",
      unreadCount: 0,
      lastMessageAt: new Date(Date.now() - 1000 * 60 * 60 * 26),
    }).returning();
    await db.insert(chatMessagesTable).values([
      { threadId: t1!.id, fromMe: true, authorName: "Alex Morgan", body: "Hi, can you check the customs status for AP5E6F7G8H?", createdAt: new Date(Date.now() - 1000 * 60 * 60) },
      { threadId: t1!.id, fromMe: false, authorName: "Airpak Support", body: "We've received your customs forms — processing now.", createdAt: new Date(Date.now() - 1000 * 60 * 25) },
      { threadId: t2!.id, fromMe: false, authorName: "Cardiff Hub", body: "Courier scheduled for Friday between 10am – 12pm.", createdAt: new Date(Date.now() - 1000 * 60 * 60 * 26) },
    ]);
  }

  // ---- FAQs ------------------------------------------------------------
  const faqs = await db.select().from(faqsTable);
  if (faqs.length === 0) {
    await db.insert(faqsTable).values([
      { category: "Shipping", question: "How do I book a shipment?", answer: "Sign in and go to ShipNow. Pick a service, fill in origin and destination, recipient, weight, and review. Payment is taken at the end of the flow." },
      { category: "Shipping", question: "What services do you offer?", answer: "Domestic (UK), International, Express (next-day), and Freight (pallet/over 30kg)." },
      { category: "Shipping", question: "What's the maximum parcel weight?", answer: "Standard parcels up to 30 kg. Heavier consignments are handled by our Freight service." },
      { category: "Tracking", question: "Where can I track my parcel?", answer: "Use the tracking input on the homepage or the Tracking page in the app. You can also enter a tracking number directly into the URL." },
      { category: "Tracking", question: "How often is tracking updated?", answer: "Events arrive in real time from our hubs and couriers. The map and timeline update as soon as a new event is recorded." },
      { category: "Payment", question: "What payment methods do you accept?", answer: "Card, Apple Pay, Google Pay, and bank transfer for business accounts." },
      { category: "Payment", question: "When am I charged?", answer: "At the end of the ShipNow flow, before the courier collects." },
      { category: "Account", question: "How do I reset my password?", answer: "Go to the Sign in page and tap 'Forgot password'." },
      { category: "Account", question: "Can I change my language?", answer: "Yes — open Settings and pick from English, 中文, Bahasa Melayu, or العربية." },
      { category: "Account", question: "Where is Airpak Express based?", answer: "Our HQ is at Unit 7, Wales International Hub, Cardiff Bay, CF10 5AL, United Kingdom." },
    ]);
  }

  logger.info("Seed complete");
  await pool.end();
}

main().catch((err) => {
  logger.error({ err }, "Seed failed");
  process.exit(1);
});
