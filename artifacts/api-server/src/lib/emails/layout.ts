export interface BrandConfig {
  appName: string;
  primary: string;
  primaryDark: string;
  accent: string;
  logoUrl: string;
  baseUrl: string;
  address: string;
  supportEmail: string;
}

export function getBrand(): BrandConfig {
  const baseUrl = getPublicBaseUrl();
  return {
    appName: "Airpak Express",
    primary: "#CD2727",
    primaryDark: "#9c1c1c",
    accent: "#ff5a4d",
    logoUrl: `${baseUrl}/brand/logo.png`,
    baseUrl,
    address:
      "Unit 7, Wales International Hub, Cardiff Bay, Wales CF10 5AL, United Kingdom",
    supportEmail: "support@airpak-express.site",
  };
}

export function getPublicBaseUrl(): string {
  const fromEnv = process.env["PUBLIC_BASE_URL"];
  if (fromEnv) return fromEnv.replace(/\/$/, "");
  const domains = process.env["REPLIT_DOMAINS"];
  if (domains) {
    const first = domains.split(",")[0]?.trim();
    if (first) return `https://${first}`;
  }
  return "https://airpak-express.site";
}

export function safeUrl(input: string | undefined | null): string {
  if (!input) return "#";
  const trimmed = String(input).trim();
  if (/^(https?:|mailto:|tel:)/i.test(trimmed)) return trimmed;
  if (trimmed.startsWith("/")) return trimmed;
  return "#";
}

export function escapeHtml(input: unknown): string {
  return String(input ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export function formatGbp(value: number): string {
  return new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "GBP",
  }).format(value);
}

export function formatDate(value: string | Date): string {
  const d = value instanceof Date ? value : new Date(value);
  return d.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export function formatDateTime(value: string | Date): string {
  const d = value instanceof Date ? value : new Date(value);
  return d.toLocaleString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export interface ButtonOpts {
  href: string;
  label: string;
}

export function button(brand: BrandConfig, opts: ButtonOpts): string {
  return `
  <table role="presentation" cellpadding="0" cellspacing="0" border="0">
    <tr>
      <td style="border-radius: 999px; background: linear-gradient(135deg, ${brand.primary} 0%, ${brand.accent} 100%);">
        <a href="${escapeHtml(safeUrl(opts.href))}"
           style="display:inline-block; padding:12px 28px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-size:15px; font-weight:600; color:#ffffff; text-decoration:none; border-radius:999px;">
          ${escapeHtml(opts.label)}
        </a>
      </td>
    </tr>
  </table>`;
}

export interface LayoutOpts {
  brand: BrandConfig;
  preheader: string;
  title: string;
  body: string;
}

export function layout(opts: LayoutOpts): string {
  const { brand, preheader, title, body } = opts;
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1" />
  <title>${escapeHtml(title)}</title>
</head>
<body style="margin:0; padding:0; background-color:#f4f4f7; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; color:#1f2937;">
  <div style="display:none; max-height:0; overflow:hidden; opacity:0; color:transparent;">${escapeHtml(preheader)}</div>
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#f4f4f7;">
    <tr>
      <td align="center" style="padding:24px 12px;">
        <table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" style="max-width:600px; width:100%; background:#ffffff; border-radius:16px; overflow:hidden; box-shadow: 0 1px 3px rgba(0,0,0,0.06);">
          <tr>
            <td style="padding:24px 32px; background: linear-gradient(135deg, ${brand.primary} 0%, ${brand.accent} 100%);">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td align="left">
                    <img src="${escapeHtml(brand.logoUrl)}" alt="${escapeHtml(brand.appName)}" height="36" style="display:block; height:36px; max-height:36px;" />
                  </td>
                  <td align="right" style="color:#ffffff; font-size:13px; font-weight:500; letter-spacing:0.3px;">
                    ${escapeHtml(brand.appName)}
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td style="padding:32px;">${body}</td>
          </tr>
          <tr>
            <td style="padding:24px 32px; background:#fafafa; border-top:1px solid #eeeef2; color:#6b7280; font-size:12px; line-height:1.6;">
              <div style="margin-bottom:6px;">${escapeHtml(brand.appName)} &middot; ${escapeHtml(brand.address)}</div>
              <div>Questions? Reach us at <a href="mailto:${escapeHtml(brand.supportEmail)}" style="color:${brand.primary}; text-decoration:none;">${escapeHtml(brand.supportEmail)}</a></div>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

export function htmlToText(html: string): string {
  return html
    .replace(/<style[\s\S]*?<\/style>/gi, "")
    .replace(/<script[\s\S]*?<\/script>/gi, "")
    .replace(/<\/(p|div|tr|li|h[1-6])>/gi, "\n")
    .replace(/<br\s*\/?>(\s|$)/gi, "\n")
    .replace(/<[^>]+>/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/[ \t]+\n/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}
