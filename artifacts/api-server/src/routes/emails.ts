import { Router, type IRouter } from "express";
import { z } from "zod";
import { requireAuth } from "../lib/auth";
import {
  EmailPayloadSchema,
  SendEmailSchema,
} from "../lib/emails/validators";
import {
  renderTemplate,
  sampleData,
  type EmailTemplate,
} from "../lib/emails/templates";

const router: IRouter = Router();

const PreviewParamsSchema = z.object({
  template: z.enum(["invoice", "receipt", "status", "newsletter"]),
});

router.post("/emails/render", (req, res): void => {
  const parsed = EmailPayloadSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  try {
    const out = renderTemplate(parsed.data.template, parsed.data.data);
    res.json(out);
  } catch (err) {
    req.log.error({ err }, "Failed to render email template");
    res.status(400).json({ error: "Failed to render template" });
  }
});

router.get("/emails/preview/:template", (req, res): void => {
  const parsed = PreviewParamsSchema.safeParse(req.params);
  if (!parsed.success) {
    res.status(400).type("text/plain").send(parsed.error.message);
    return;
  }
  const template = parsed.data.template as EmailTemplate;
  const data = sampleData[template]();
  const out = renderTemplate(template, data);
  res.type("text/html; charset=utf-8").send(out.html);
});

router.post("/emails/send", requireAuth(), async (req, res): Promise<void> => {
  const parsed = SendEmailSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const provider = process.env["EMAIL_PROVIDER"];
  if (!provider) {
    res.status(503).json({
      error:
        "Email provider not configured. Set EMAIL_PROVIDER and provider credentials to enable sending.",
    });
    return;
  }
  const { template, data, to, from } = parsed.data;
  try {
    const rendered = renderTemplate(template, data);
    req.log.info(
      { provider, template, to, from, subject: rendered.subject },
      "Email send requested",
    );
    // Provider integrations (resend, ses, sendgrid, ...) plug in here.
    // Bounce-handling and unsubscribe flows would also be wired here for newsletters.
    res.status(202).json({
      accepted: true,
      provider,
      messageId: `pending-${Date.now()}`,
    });
  } catch (err) {
    req.log.error({ err }, "Failed to render email for send");
    res.status(400).json({ error: "Failed to render template" });
  }
});

export default router;
