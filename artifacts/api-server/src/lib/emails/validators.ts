import { z } from "zod";

const isoDate = z.union([z.string().datetime({ offset: true }), z.date()]);
const safeUrlString = z
  .string()
  .url()
  .refine((u) => /^https?:\/\//i.test(u), {
    message: "Only http(s) URLs are allowed",
  });

export const InvoiceLineItemSchema = z.object({
  description: z.string().min(1),
  quantity: z.number().nonnegative(),
  unitPriceGbp: z.number().nonnegative(),
});

export const InvoiceDataSchema = z.object({
  invoiceNumber: z.string().min(1),
  issuedAt: isoDate,
  dueAt: isoDate.optional(),
  customerName: z.string().min(1),
  customerEmail: z.string().email(),
  items: z.array(InvoiceLineItemSchema).min(1),
  subtotalGbp: z.number().optional(),
  taxGbp: z.number().optional(),
  totalGbp: z.number(),
  notes: z.string().optional(),
});

export const ReceiptDataSchema = z.object({
  reference: z.string().min(1),
  paidAt: isoDate,
  customerName: z.string().min(1),
  customerEmail: z.string().email(),
  amountGbp: z.number().nonnegative(),
  method: z.enum(["card", "applepay", "googlepay", "bank"]),
  shipmentNumber: z.string().optional(),
  last4: z
    .string()
    .regex(/^\d{4}$/)
    .optional(),
});

export const StatusEmailDataSchema = z.object({
  trackingNumber: z.string().min(1),
  customerName: z.string().min(1),
  customerEmail: z.string().email(),
  status: z.string().min(1),
  statusLabel: z.string().min(1),
  location: z.string().optional(),
  occurredAt: isoDate,
  etaAt: isoDate.optional(),
  trackingUrl: safeUrlString.optional(),
});

export const NewsletterArticleSchema = z.object({
  title: z.string().min(1),
  summary: z.string().min(1),
  url: safeUrlString,
  imageUrl: safeUrlString.optional(),
});

export const NewsletterDataSchema = z.object({
  headline: z.string().min(1),
  intro: z.string().min(1),
  articles: z.array(NewsletterArticleSchema).min(1),
  ctaLabel: z.string().optional(),
  ctaUrl: safeUrlString.optional(),
});

export const EmailPayloadSchema = z.discriminatedUnion("template", [
  z.object({ template: z.literal("invoice"), data: InvoiceDataSchema }),
  z.object({ template: z.literal("receipt"), data: ReceiptDataSchema }),
  z.object({ template: z.literal("status"), data: StatusEmailDataSchema }),
  z.object({ template: z.literal("newsletter"), data: NewsletterDataSchema }),
]);

export const SendEmailSchema = z
  .object({
    to: z.string().email(),
    from: z.string().email().optional(),
  })
  .and(EmailPayloadSchema);

export type EmailPayload = z.infer<typeof EmailPayloadSchema>;
