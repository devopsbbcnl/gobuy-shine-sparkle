import path from "node:path";
import { fileURLToPath } from "node:url";
import dotenv from "dotenv";
import cors from "cors";
import express from "express";
import { Resend } from "resend";

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
dotenv.config({ path: path.join(projectRoot, ".env") });
dotenv.config({ path: path.join(projectRoot, ".env.local") });

const PORT = Number(process.env.FORM_API_PORT || 8787);
const ALLOWED_FORMS = new Set(["contact", "riders-signup", "vendors-apply", "affiliate", "book-a-call"]);

// Per-form overrides — to address and subject prefix
const FORM_OVERRIDES = {
  "book-a-call": {
    to: process.env.PARTNERS_EMAIL?.trim() || "partners@gobuyme.shop",
    subjectPrefix: "[GoBuyMe] Enterprise enquiry",
  },
};

const app = express();
app.use(cors({ origin: true }));
app.use(express.json({ limit: "48kb" }));

app.post("/api/form-submit", async (req, res) => {
  try {
    const { formId, fields } = req.body ?? {};
    if (!formId || typeof formId !== "string" || !ALLOWED_FORMS.has(formId)) {
      return res.status(400).json({ error: "Invalid form" });
    }
    if (!fields || typeof fields !== "object" || Array.isArray(fields)) {
      return res.status(400).json({ error: "Invalid fields" });
    }

    const apiKey = process.env.RESEND_API_KEY?.trim();
    const from = process.env.RESEND_FROM?.trim() || "GoBuyMe <contact@notifications.gobuyme.shop>";
    const defaultTo = process.env.FORMS_TO_EMAIL?.trim();

    if (!apiKey) {
      console.error("form-api: missing RESEND_API_KEY");
      return res.status(503).json({ error: "Mail is not configured on the server" });
    }
    if (!defaultTo) {
      console.error("form-api: missing FORMS_TO_EMAIL");
      return res.status(503).json({ error: "Mail is not configured on the server" });
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
      console.error("form-api resend error:", error);
      return res.status(502).json({ error: "Failed to send message" });
    }

    res.json({ ok: true });
  } catch (e) {
    console.error("form-api:", e);
    res.status(500).json({ error: "Failed to send message" });
  }
});

app.listen(PORT, "127.0.0.1", () => {
  console.log(`form-api listening on http://127.0.0.1:${PORT}`);
});
