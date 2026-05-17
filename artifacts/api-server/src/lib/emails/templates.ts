import {
  type BrandConfig,
  button,
  escapeHtml,
  formatDate,
  formatDateTime,
  formatGbp,
  getBrand,
  htmlToText,
  layout,
  safeUrl,
} from "./layout";

export interface InvoiceLineItem {
  description: string;
  quantity: number;
  unitPriceGbp: number;
}

export interface InvoiceData {
  invoiceNumber: string;
  issuedAt: string | Date;
  dueAt?: string | Date;
  customerName: string;
  customerEmail: string;
  items: InvoiceLineItem[];
  subtotalGbp?: number;
  taxGbp?: number;
  totalGbp: number;
  notes?: string;
}

export interface ReceiptData {
  reference: string;
  paidAt: string | Date;
  customerName: string;
  customerEmail: string;
  amountGbp: number;
  method: "card" | "applepay" | "googlepay" | "bank";
  shipmentNumber?: string;
  last4?: string;
}

export interface StatusEmailData {
  trackingNumber: string;
  customerName: string;
  customerEmail: string;
  status: string;
  statusLabel: string;
  location?: string;
  occurredAt: string | Date;
  etaAt?: string | Date;
  trackingUrl?: string;
}

export interface NewsletterArticle {
  title: string;
  summary: string;
  url: string;
  imageUrl?: string;
}

export interface NewsletterData {
  headline: string;
  intro: string;
  articles: NewsletterArticle[];
  ctaLabel?: string;
  ctaUrl?: string;
}

export type EmailTemplate = "invoice" | "receipt" | "status" | "newsletter";

export interface RenderedEmail {
  subject: string;
  html: string;
  text: string;
}

const methodLabels: Record<ReceiptData["method"], string> = {
  card: "Card",
  applepay: "Apple Pay",
  googlepay: "Google Pay",
  bank: "Bank transfer",
};

function lineItemRow(brand: BrandConfig, item: InvoiceLineItem): string {
  const lineTotal = item.quantity * item.unitPriceGbp;
  return `
    <tr>
      <td style="padding:10px 0; border-bottom:1px solid #eeeef2; color:#1f2937; font-size:14px;">${escapeHtml(item.description)}</td>
      <td style="padding:10px 0; border-bottom:1px solid #eeeef2; color:#6b7280; font-size:14px; text-align:right;">${escapeHtml(item.quantity)}</td>
      <td style="padding:10px 0; border-bottom:1px solid #eeeef2; color:#6b7280; font-size:14px; text-align:right;">${escapeHtml(formatGbp(item.unitPriceGbp))}</td>
      <td style="padding:10px 0; border-bottom:1px solid #eeeef2; color:${brand.primaryDark}; font-size:14px; font-weight:600; text-align:right;">${escapeHtml(formatGbp(lineTotal))}</td>
    </tr>`;
}

export function renderInvoice(data: InvoiceData): RenderedEmail {
  const brand = getBrand();
  const subtotal =
    data.subtotalGbp ??
    data.items.reduce((s, i) => s + i.quantity * i.unitPriceGbp, 0);
  const body = `
    <h1 style="margin:0 0 4px; font-size:22px; color:#0f172a;">Invoice ${escapeHtml(data.invoiceNumber)}</h1>
    <p style="margin:0 0 24px; color:#6b7280; font-size:14px;">Issued ${escapeHtml(formatDate(data.issuedAt))}${data.dueAt ? ` · Due ${escapeHtml(formatDate(data.dueAt))}` : ""}</p>
    <p style="margin:0 0 24px; font-size:15px; color:#1f2937;">Hi ${escapeHtml(data.customerName)},<br/>Thanks for shipping with us. Here are the details for this invoice.</p>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:0 0 24px;">
      <thead>
        <tr>
          <th align="left"  style="padding:0 0 10px; border-bottom:2px solid ${brand.primary}; color:#6b7280; font-size:12px; text-transform:uppercase; letter-spacing:0.5px;">Description</th>
          <th align="right" style="padding:0 0 10px; border-bottom:2px solid ${brand.primary}; color:#6b7280; font-size:12px; text-transform:uppercase; letter-spacing:0.5px;">Qty</th>
          <th align="right" style="padding:0 0 10px; border-bottom:2px solid ${brand.primary}; color:#6b7280; font-size:12px; text-transform:uppercase; letter-spacing:0.5px;">Unit</th>
          <th align="right" style="padding:0 0 10px; border-bottom:2px solid ${brand.primary}; color:#6b7280; font-size:12px; text-transform:uppercase; letter-spacing:0.5px;">Total</th>
        </tr>
      </thead>
      <tbody>${data.items.map((i) => lineItemRow(brand, i)).join("")}</tbody>
    </table>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
      <tr>
        <td></td>
        <td width="220">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
            <tr>
              <td style="padding:4px 0; color:#6b7280; font-size:14px;">Subtotal</td>
              <td align="right" style="padding:4px 0; color:#1f2937; font-size:14px;">${escapeHtml(formatGbp(subtotal))}</td>
            </tr>
            ${
              data.taxGbp != null
                ? `<tr><td style="padding:4px 0; color:#6b7280; font-size:14px;">Tax</td><td align="right" style="padding:4px 0; color:#1f2937; font-size:14px;">${escapeHtml(formatGbp(data.taxGbp))}</td></tr>`
                : ""
            }
            <tr>
              <td style="padding:10px 0 0; border-top:1px solid #eeeef2; color:#0f172a; font-size:16px; font-weight:700;">Total</td>
              <td align="right" style="padding:10px 0 0; border-top:1px solid #eeeef2; color:${brand.primaryDark}; font-size:18px; font-weight:700;">${escapeHtml(formatGbp(data.totalGbp))}</td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
    ${
      data.notes
        ? `<p style="margin:24px 0 0; padding:14px 16px; background:#fafafa; border-radius:10px; color:#6b7280; font-size:13px; line-height:1.6;">${escapeHtml(data.notes)}</p>`
        : ""
    }
    <div style="margin-top:28px;">${button(brand, { href: `${brand.baseUrl}/dashboard#invoice-${encodeURIComponent(data.invoiceNumber)}`, label: "View invoice" })}</div>
  `;
  const html = layout({
    brand,
    preheader: `Invoice ${data.invoiceNumber} · ${formatGbp(data.totalGbp)}`,
    title: `Invoice ${data.invoiceNumber}`,
    body,
  });
  return {
    subject: `Your Airpak Express invoice ${data.invoiceNumber}`,
    html,
    text: htmlToText(html),
  };
}

export function renderReceipt(data: ReceiptData): RenderedEmail {
  const brand = getBrand();
  const body = `
    <h1 style="margin:0 0 4px; font-size:22px; color:#0f172a;">Payment received</h1>
    <p style="margin:0 0 24px; color:#6b7280; font-size:14px;">Reference ${escapeHtml(data.reference)} · ${escapeHtml(formatDateTime(data.paidAt))}</p>
    <p style="margin:0 0 24px; font-size:15px; color:#1f2937;">Thanks ${escapeHtml(data.customerName)} — we&rsquo;ve received your payment.</p>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:0 0 24px; background:#fafafa; border-radius:12px;">
      <tr><td style="padding:14px 18px; color:#6b7280; font-size:13px;">Amount paid</td><td align="right" style="padding:14px 18px; color:${brand.primaryDark}; font-size:18px; font-weight:700;">${escapeHtml(formatGbp(data.amountGbp))}</td></tr>
      <tr><td style="padding:14px 18px; color:#6b7280; font-size:13px; border-top:1px solid #eeeef2;">Method</td><td align="right" style="padding:14px 18px; color:#1f2937; font-size:14px; border-top:1px solid #eeeef2;">${escapeHtml(methodLabels[data.method])}${data.last4 ? ` · ending ${escapeHtml(data.last4)}` : ""}</td></tr>
      ${
        data.shipmentNumber
          ? `<tr><td style="padding:14px 18px; color:#6b7280; font-size:13px; border-top:1px solid #eeeef2;">Shipment</td><td align="right" style="padding:14px 18px; color:#1f2937; font-size:14px; border-top:1px solid #eeeef2;">${escapeHtml(data.shipmentNumber)}</td></tr>`
          : ""
      }
    </table>
    <div>${button(brand, { href: `${brand.baseUrl}/dashboard`, label: "Open dashboard" })}</div>
  `;
  const html = layout({
    brand,
    preheader: `Payment of ${formatGbp(data.amountGbp)} received`,
    title: "Payment received",
    body,
  });
  return {
    subject: `Receipt ${data.reference} — ${formatGbp(data.amountGbp)}`,
    html,
    text: htmlToText(html),
  };
}

export function renderStatus(data: StatusEmailData): RenderedEmail {
  const brand = getBrand();
  const trackingUrl = safeUrl(
    data.trackingUrl ?? `${brand.baseUrl}/tracking/${encodeURIComponent(data.trackingNumber)}`,
  );
  const body = `
    <h1 style="margin:0 0 4px; font-size:22px; color:#0f172a;">Shipment update</h1>
    <p style="margin:0 0 24px; color:#6b7280; font-size:14px;">Tracking ${escapeHtml(data.trackingNumber)}</p>
    <p style="margin:0 0 24px; font-size:15px; color:#1f2937;">Hi ${escapeHtml(data.customerName)}, here&rsquo;s the latest on your shipment.</p>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:0 0 24px;">
      <tr>
        <td style="padding:18px 20px; background: linear-gradient(135deg, ${brand.primary}10 0%, ${brand.accent}10 100%); border:1px solid ${brand.primary}33; border-radius:12px;">
          <div style="font-size:12px; color:${brand.primaryDark}; font-weight:700; letter-spacing:0.5px; text-transform:uppercase;">${escapeHtml(data.status)}</div>
          <div style="margin-top:4px; font-size:18px; color:#0f172a; font-weight:600;">${escapeHtml(data.statusLabel)}</div>
          ${data.location ? `<div style="margin-top:4px; color:#6b7280; font-size:14px;">${escapeHtml(data.location)}</div>` : ""}
          <div style="margin-top:8px; color:#6b7280; font-size:13px;">${escapeHtml(formatDateTime(data.occurredAt))}</div>
        </td>
      </tr>
    </table>
    ${
      data.etaAt
        ? `<p style="margin:0 0 24px; font-size:14px; color:#1f2937;"><strong>Estimated delivery:</strong> ${escapeHtml(formatDateTime(data.etaAt))}</p>`
        : ""
    }
    <div>${button(brand, { href: trackingUrl, label: "Track shipment" })}</div>
  `;
  const html = layout({
    brand,
    preheader: `${data.statusLabel} — ${data.trackingNumber}`,
    title: `Shipment update — ${data.trackingNumber}`,
    body,
  });
  return {
    subject: `[${data.trackingNumber}] ${data.statusLabel}`,
    html,
    text: htmlToText(html),
  };
}

export function renderNewsletter(data: NewsletterData): RenderedEmail {
  const brand = getBrand();
  const articles = data.articles
    .map(
      (a) => {
        const url = escapeHtml(safeUrl(a.url));
        const img = a.imageUrl ? escapeHtml(safeUrl(a.imageUrl)) : null;
        return `
      <tr>
        <td style="padding:16px 0; border-bottom:1px solid #eeeef2;">
          ${img ? `<img src="${img}" alt="" width="100%" style="display:block; width:100%; max-width:100%; border-radius:10px; margin-bottom:12px;" />` : ""}
          <div style="font-size:16px; font-weight:700; color:#0f172a; margin-bottom:6px;">
            <a href="${url}" style="color:#0f172a; text-decoration:none;">${escapeHtml(a.title)}</a>
          </div>
          <div style="font-size:14px; color:#6b7280; line-height:1.6;">${escapeHtml(a.summary)}</div>
          <div style="margin-top:8px;"><a href="${url}" style="color:${brand.primary}; font-size:13px; font-weight:600; text-decoration:none;">Read more &rarr;</a></div>
        </td>
      </tr>`;
      },
    )
    .join("");
  const body = `
    <h1 style="margin:0 0 8px; font-size:24px; color:#0f172a;">${escapeHtml(data.headline)}</h1>
    <p style="margin:0 0 24px; color:#6b7280; font-size:15px; line-height:1.6;">${escapeHtml(data.intro)}</p>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">${articles}</table>
    ${
      data.ctaUrl && data.ctaLabel
        ? `<div style="margin-top:28px;">${button(brand, { href: data.ctaUrl, label: data.ctaLabel })}</div>`
        : ""
    }
  `;
  const html = layout({
    brand,
    preheader: data.intro.slice(0, 120),
    title: data.headline,
    body,
  });
  return {
    subject: data.headline,
    html,
    text: htmlToText(html),
  };
}

export const sampleData = {
  invoice: (): InvoiceData => ({
    invoiceNumber: "INV-2026-00421",
    issuedAt: new Date().toISOString(),
    dueAt: new Date(Date.now() + 14 * 24 * 3600 * 1000).toISOString(),
    customerName: "Aisha Bello",
    customerEmail: "aisha@example.com",
    items: [
      { description: "Express parcel — London → Lagos (5kg)", quantity: 1, unitPriceGbp: 84.5 },
      { description: "Signature on delivery", quantity: 1, unitPriceGbp: 4.0 },
      { description: "Insurance up to £500", quantity: 1, unitPriceGbp: 6.5 },
    ],
    taxGbp: 19.0,
    totalGbp: 114.0,
    notes: "Payment is due within 14 days. Please reference the invoice number on your transfer.",
  }),
  receipt: (): ReceiptData => ({
    reference: "PAY-9F8X2A",
    paidAt: new Date().toISOString(),
    customerName: "Aisha Bello",
    customerEmail: "aisha@example.com",
    amountGbp: 114.0,
    method: "card",
    last4: "4242",
    shipmentNumber: "AE-2026-58291",
  }),
  status: (): StatusEmailData => ({
    trackingNumber: "AE-2026-58291",
    customerName: "Aisha Bello",
    customerEmail: "aisha@example.com",
    status: "in_transit",
    statusLabel: "In transit — departed sorting facility",
    location: "London Heathrow LHR",
    occurredAt: new Date().toISOString(),
    etaAt: new Date(Date.now() + 2 * 24 * 3600 * 1000).toISOString(),
  }),
  newsletter: (): NewsletterData => ({
    headline: "Faster shipping to West Africa this month",
    intro:
      "New direct routes, tracking improvements, and a fresh dashboard — here's what's new at Airpak Express.",
    articles: [
      {
        title: "New same-day pickups in Cardiff & Bristol",
        summary:
          "Book before 11am and we'll collect the same afternoon, with live status updates from pickup to delivery.",
        url: "https://airpak-express.site/news/same-day-pickups",
      },
      {
        title: "Live route maps in the tracking page",
        summary:
          "See your parcel's path on an interactive map, including current location and ETA refinements.",
        url: "https://airpak-express.site/news/live-maps",
      },
      {
        title: "Dashboard refresh with monthly insights",
        summary:
          "A redesigned home for your shipments, with monthly spend, exception alerts, and one-tap rebooking.",
        url: "https://airpak-express.site/news/dashboard-refresh",
      },
    ],
    ctaLabel: "Open dashboard",
    ctaUrl: "https://airpak-express.site/dashboard",
  }),
};

export function renderTemplate(template: EmailTemplate, data: unknown): RenderedEmail {
  switch (template) {
    case "invoice":
      return renderInvoice(data as InvoiceData);
    case "receipt":
      return renderReceipt(data as ReceiptData);
    case "status":
      return renderStatus(data as StatusEmailData);
    case "newsletter":
      return renderNewsletter(data as NewsletterData);
  }
}
