import path from "node:path";
import { fileURLToPath } from "node:url";
import dotenv from "dotenv";
import cors from "cors";
import express from "express";
import nodemailer from "nodemailer";

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
dotenv.config({ path: path.join(projectRoot, ".env") });
dotenv.config({ path: path.join(projectRoot, ".env.local") });

const PORT = Number(process.env.FORM_API_PORT || 8787);
const ALLOWED_FORMS = new Set(["contact", "riders-signup", "vendors-apply", "affiliate"]);

function firstEnv(...keys) {
  for (const key of keys) {
    const v = process.env[key]?.trim();
    if (v) return v;
  }
  return "";
}

function createMailTransport(host, user, pass) {
  const port = Number(process.env.SMTP_FROM_PORT || 465);
  const secureRaw = process.env.SMTP_FROM_SECURE;
  const secure =
    secureRaw !== undefined && String(secureRaw).trim() !== ""
      ? String(secureRaw).toLowerCase() === "true"
      : port === 465;

  /** @type {import('nodemailer').TransportOptions} */
  const opts = {
    host,
    port,
    secure,
    auth: { user, pass },
  };
  if (!secure && [587, 2587].includes(port)) {
    opts.requireTLS = true;
  }
  return nodemailer.createTransport(opts);
}

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

    const host = process.env.SMTP_HOST?.trim();
    const user = process.env.SMTP_FROM_USER?.trim();
    const pass = firstEnv("SMTP_FROM_PASS", "SMTP_FROM_PASSWORD", "RESEND_API_KEY");
    const to = firstEnv("FORMS_TO_EMAIL", "SMTP_FROM_EMAIL");

    if (!host || !user || !pass || !to) {
      const missing = [
        !host && "SMTP_HOST",
        !user && "SMTP_FROM_USER",
        !pass && "SMTP_FROM_PASS, SMTP_FROM_PASSWORD, or RESEND_API_KEY",
        !to && "FORMS_TO_EMAIL (or SMTP_FROM_EMAIL)",
      ].filter(Boolean);
      console.error("form-api: missing env:", missing.join(", "));
      return res.status(503).json({ error: "Mail is not configured on the server" });
    }

    const transporter = createMailTransport(host, user, pass);

    const from =
      process.env.SMTP_FROM_NAME?.trim() ||
      (process.env.SMTP_FROM_EMAIL ? `"GoBuyMe" <${process.env.SMTP_FROM_EMAIL}>` : undefined);
    if (!from) {
      return res.status(503).json({ error: "Mail is not configured on the server" });
    }

    const flat = Object.fromEntries(
      Object.entries(fields).map(([k, v]) => [k, v == null ? "" : String(v)]),
    );

    const lines = Object.entries(flat).map(([k, v]) => `${k}: ${v}`);
    const text = [`Form ID: ${formId}`, `Submitted (UTC): ${new Date().toISOString()}`, "", ...lines].join("\n");
    const safeHtml = text
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .split("\n")
      .join("<br>\n");

    /** @type {import('nodemailer').SendMailOptions} */
    const mail = {
      from,
      to,
      subject: `[GoBuyMe forms] ${formId}`,
      text,
      html: `<p style="font-family:system-ui,sans-serif;font-size:14px;line-height:1.5">${safeHtml}</p>`,
    };

    const reply = flat.email?.trim();
    if (reply && reply.includes("@")) {
      mail.replyTo = reply;
    }

    await transporter.sendMail(mail);
    res.json({ ok: true });
  } catch (e) {
    console.error("form-api:", e);
    const code = /** @type {{ code?: string; responseCode?: number }} */ (e);
    if (code.code === "EAUTH" || code.responseCode === 535) {
      return res.status(502).json({
        error:
          "SMTP login rejected (535). Use a valid API key as the password; for Resend set SMTP_FROM_USER=resend. If SMTP_FROM_PASS is empty, remove it so SMTP_FROM_PASSWORD or RESEND_API_KEY is used.",
      });
    }
    res.status(500).json({ error: "Failed to send message" });
  }
});

app.listen(PORT, "127.0.0.1", () => {
  console.log(`form-api listening on http://127.0.0.1:${PORT}`);
});
