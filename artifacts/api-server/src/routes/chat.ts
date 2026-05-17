import { Router, type IRouter } from "express";
import Anthropic from "@anthropic-ai/sdk";

const router: IRouter = Router();

const SYSTEM_PROMPT = `You are AirpakAI, the official virtual assistant for Airpak Express (airpak-express.com), an international courier and logistics company headquartered in the United Kingdom (Cardiff CF10 5AL, United Kingdom).

ABOUT AIRPAK EXPRESS:
- International courier and logistics specialist serving the UK and worldwide
- UK headquarters: Cardiff CF10 5AL, United Kingdom
- Services: domestic UK delivery, international shipping, e-commerce logistics, freight forwarding, warehousing & fulfillment, same-day / next-day / standard delivery, COD, document express, palletized cargo
- Tracking: customers track parcels at /tracking.html using a tracking number / consignment note
- Account portals: customer portal /shipnow.html (sign up to ship online); staff/admin portal at /ship.html
- Contact: hotline + email available on the Contact Us page (/contact.html)
- Languages supported on this site: English, 中文 (Chinese), Bahasa Melayu, Bahasa Indonesia, Tamil, Thai, Japanese, Korean, Vietnamese

KEY PAGES YOU CAN POINT USERS TO:
- / : Homepage with track-shipment bar
- /tracking.html : Track a parcel
- /shipnow.html : Sign in to user portal (or sign up to ship online)
- /ship.html : Staff/admin portal
- /aboutus.html : Company info
- /contact.html : Contact details
- /faq.html : Frequently asked questions
- /documents.html : Generate shipping paperwork (invoice, waybill, receipt, label)

HUMAN HANDOFF:
- If the user asks to speak to a human, agent, representative, real person, customer care, staff, or says they're frustrated / their problem isn't being solved, you MUST end your reply with the exact token \`[[HANDOFF]]\` on its own line. The website will then display a "Connect with a customer care representative" card with phone, email, WhatsApp and a callback request form.
- Before emitting [[HANDOFF]], briefly acknowledge ("Of course — let me connect you with a representative") in 1 short sentence. Do not invent a phone number or email; the handoff card supplies the real contact options.

YOUR PERSONALITY:
- Warm, professional, concise. Use plain English unless the user writes in another language — then reply in their language.
- Always identify as "Airpak's virtual assistant" or "AirpakAI". Never claim to be a human staff member.
- For tracking questions, ask for the tracking number and direct users to /tracking.html.
- For pricing, sign-up, or account issues, point users to the relevant page above.
- If you don't know something specific (a real-time price, a live shipment status, a specific staff member), say so and offer the contact page or a human handoff.
- Keep answers under ~120 words unless the user asks for detail. Use short paragraphs and bullet points where helpful.
- Never invent prices, transit times, branch addresses, or staff names. If unsure, route to /contact.html or trigger [[HANDOFF]].
- Never produce content unrelated to Airpak's business. Politely redirect.`;

const client = new Anthropic({
  baseURL: process.env.AI_INTEGRATIONS_ANTHROPIC_BASE_URL,
  apiKey: process.env.AI_INTEGRATIONS_ANTHROPIC_API_KEY,
});

router.post("/chat", async (req, res): Promise<void> => {
  try {
    const body = req.body as {
      messages?: Array<{ role: "user" | "assistant"; content: string }>;
    };
    const messages = Array.isArray(body?.messages) ? body.messages : [];
    if (messages.length === 0) {
      res.status(400).json({ error: "messages array required" });
      return;
    }

    const cleaned = messages
      .filter(
        (m) =>
          (m.role === "user" || m.role === "assistant") &&
          typeof m.content === "string" &&
          m.content.trim().length > 0,
      )
      .slice(-20)
      .map((m) => ({ role: m.role, content: m.content.slice(0, 4000) }));

    const result = await client.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 1024,
      system: SYSTEM_PROMPT,
      messages: cleaned,
    });

    const raw = result.content
      .filter((b) => b.type === "text")
      .map((b) => (b as { type: "text"; text: string }).text)
      .join("\n");

    const handoff = /\[\[HANDOFF\]\]/i.test(raw);
    const text = raw.replace(/\[\[HANDOFF\]\]/gi, "").trim();

    res.json({ reply: text, handoff });
  } catch (err) {
    req.log?.error({ err }, "chat error");
    res.status(500).json({ error: "AI is unavailable right now. Please try again shortly." });
  }
});

type CallbackBody = {
  name?: string;
  phone?: string;
  email?: string;
  message?: string;
  preferredTime?: string;
};

router.post("/support/callback", (req, res): void => {
  const body = (req.body || {}) as CallbackBody;
  const name = (body.name || "").trim().slice(0, 120);
  const phone = (body.phone || "").trim().slice(0, 40);
  const email = (body.email || "").trim().slice(0, 200);
  const message = (body.message || "").trim().slice(0, 2000);
  const preferredTime = (body.preferredTime || "").trim().slice(0, 60);

  if (!name || (!phone && !email)) {
    res.status(400).json({ error: "Please provide your name and either a phone number or email." });
    return;
  }

  req.log?.info(
    { name, phone, email, preferredTime, message: message.slice(0, 200) },
    "support callback requested",
  );

  res.json({
    ok: true,
    message:
      "Thanks — a customer care representative will contact you shortly. We typically reply within 1 working hour.",
  });
});

export default router;
