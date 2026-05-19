import { Resend } from "resend";

const ALLOWED_FORMS = new Set(["contact", "riders-signup", "vendors-apply", "affiliate", "book-a-call"]);

// Per-form overrides — to address and subject prefix
const FORM_OVERRIDES = {
  "book-a-call": {
    to: process.env.PARTNERS_EMAIL?.trim() || "partners@gobuyme.shop",
    subjectPrefix: "[GoBuyMe] Enterprise enquiry",
  },
};

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "Content-Type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Content-Type": "application/json",
};

export const handler = async (event) => {
  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 204, headers: corsHeaders, body: "" };
  }
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, headers: corsHeaders, body: JSON.stringify({ error: "Method not allowed" }) };
  }

  try {
    const req = event.body ? JSON.parse(event.body) : {};
    const { formId, fields } = req;

    if (!formId || typeof formId !== "string" || !ALLOWED_FORMS.has(formId)) {
      return { statusCode: 400, headers: corsHeaders, body: JSON.stringify({ error: "Invalid form" }) };
    }
    if (!fields || typeof fields !== "object" || Array.isArray(fields)) {
      return { statusCode: 400, headers: corsHeaders, body: JSON.stringify({ error: "Invalid fields" }) };
    }

    const apiKey = process.env.RESEND_API_KEY?.trim();
    const from = process.env.RESEND_FROM?.trim() || "GoBuyMe <contact@notifications.gobuyme.shop>";
    const defaultTo = process.env.FORMS_TO_EMAIL?.trim();

    if (!apiKey) {
      console.error("form-submit: missing RESEND_API_KEY");
      return { statusCode: 503, headers: corsHeaders, body: JSON.stringify({ error: "Mail is not configured on the server" }) };
    }
    if (!defaultTo) {
      console.error("form-submit: missing FORMS_TO_EMAIL");
      return { statusCode: 503, headers: corsHeaders, body: JSON.stringify({ error: "Mail is not configured on the server" }) };
    }

    const override = FORM_OVERRIDES[formId] ?? {};
    const to = override.to ?? defaultTo;

    const flat = Object.fromEntries(
      Object.entries(fields).map(([k, v]) => [k, v == null ? "" : String(v)]),
    );

    const lines = Object.entries(flat).map(([k, v]) => `${k}: ${v}`);
    const textBody = [`Form: ${formId}`, `Submitted (UTC): ${new Date().toISOString()}`, "", ...lines].join("\n");
    const safeHtml = textBody
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .split("\n")
      .join("<br>\n");

    const subject = override.subjectPrefix
      ? `${override.subjectPrefix} — ${flat.businessName || flat.name || formId}`
      : `[GoBuyMe forms] ${formId}`;

    const resend = new Resend(apiKey);

    const payload = {
      from,
      to,
      subject,
      text: textBody,
      html: `<p style="font-family:system-ui,sans-serif;font-size:14px;line-height:1.6">${safeHtml}</p>`,
    };

    const replyEmail = flat.email?.trim();
    if (replyEmail && replyEmail.includes("@")) {
      payload.replyTo = replyEmail;
    }

    const { error } = await resend.emails.send(payload);

    if (error) {
      console.error("form-submit resend error:", error);
      return { statusCode: 502, headers: corsHeaders, body: JSON.stringify({ error: "Failed to send message" }) };
    }

    return { statusCode: 200, headers: corsHeaders, body: JSON.stringify({ ok: true }) };
  } catch (e) {
    console.error("form-submit:", e);
    return { statusCode: 500, headers: corsHeaders, body: JSON.stringify({ error: "Failed to send message" }) };
  }
};
