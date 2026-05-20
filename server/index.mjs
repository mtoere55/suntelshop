import express from "express";
import path from "path";
import fs from "fs";
import crypto from "crypto";
import nodemailer from "nodemailer";
import { fileURLToPath } from "url";

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, "..");
const distDir = path.join(rootDir, "dist");
const dataDir = path.join(rootDir, "data");
const uploadsDir = path.join(rootDir, "public", "uploads");

fs.mkdirSync(dataDir, { recursive: true });
fs.mkdirSync(uploadsDir, { recursive: true });

function loadEnv() {
  const envFile = path.join(rootDir, ".env");
  if (!fs.existsSync(envFile)) return;
  const rows = fs.readFileSync(envFile, "utf8").split(/\r?\n/);
  for (const row of rows) {
    if (!row || row.trim().startsWith("#") || !row.includes("=")) continue;
    const idx = row.indexOf("=");
    const key = row.slice(0, idx).trim();
    const value = row.slice(idx + 1).trim();
    if (key && process.env[key] === undefined) process.env[key] = value;
  }
}

loadEnv();

const PORT = process.env.PORT || 3015;
const ADMIN_USER = process.env.ADMIN_USER || "admin";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "admin";
const ADMIN_TOKEN = process.env.ADMIN_TOKEN || "suntel-admin-token";

app.use(express.json({ limit: "25mb" }));
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static(uploadsDir));

function readJson(name, fallback) {
  const file = path.join(dataDir, name);
  try {
    if (!fs.existsSync(file)) {
      fs.writeFileSync(file, JSON.stringify(fallback, null, 2));
      return fallback;
    }
    return JSON.parse(fs.readFileSync(file, "utf8"));
  } catch {
    return fallback;
  }
}

function writeJson(name, data) {
  const file = path.join(dataDir, name);
  fs.writeFileSync(file, JSON.stringify(data, null, 2));
}

function slugify(value) {
  return String(value)
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/ä/g, "ae")
    .replace(/ö/g, "oe")
    .replace(/ü/g, "ue")
    .replace(/ß/g, "ss")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}


function mailConfigured() {
  return Boolean(
    process.env.SMTP_HOST &&
    process.env.SMTP_PORT &&
    process.env.SMTP_USER &&
    process.env.SMTP_PASS &&
    process.env.SMTP_FROM
  );
}

function getMailer() {
  if (!mailConfigured()) return null;

  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT || 587),
    secure: String(process.env.SMTP_SECURE || "false") === "true",
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS
    }
  });
}

async function sendMailSafe({ to, subject, html, text }) {
  try {
    const mailer = getMailer();

    if (!mailer) {
      console.log("[MAIL SKIPPED] SMTP not configured:", subject);
      return { ok: false, skipped: true, reason: "smtp_not_configured" };
    }

    const result = await mailer.sendMail({
      from: process.env.SMTP_FROM,
      to,
      subject,
      text: text || html.replace(/<[^>]+>/g, " "),
      html
    });

    console.log("[MAIL SENT]", subject, result.messageId || "");
    return { ok: true, messageId: result.messageId || "" };
  } catch (err) {
    console.error("[MAIL ERROR]", subject, err);
    return { ok: false, error: String(err?.message || err) };
  }
}

function adminMail() {
  return process.env.ADMIN_EMAIL || process.env.SMTP_USER || "suntel58135@gmail.com";
}

function orderMailHtml(order) {
  const items = (order.items || []).map(i => `<li>${i.qty}× ${i.title} — ${i.lineTotal} €</li>`).join("");
  return `
  <div style="font-family:Arial,sans-serif;line-height:1.6;color:#111">
    <h2>Sun-TEL Bestellung ${order.orderNo}</h2>
    <p>Vielen Dank für Ihre Bestellung bei Sun-TEL in Hagen.</p>
    <p><b>Status:</b> ${order.status}</p>
    <p><b>Kunde:</b> ${order.customer?.firstName || ""} ${order.customer?.lastName || ""}</p>
    <p><b>Telefon:</b> ${order.customer?.phone || ""}</p>
    <p><b>E-Mail:</b> ${order.customer?.email || ""}</p>
    <p><b>Zahlungsart:</b> ${order.payment || ""}</p>
    <p><b>Lieferart:</b> ${order.delivery?.type || ""}</p>
    <h3>Artikel</h3>
    <ul>${items}</ul>
    <p><b>Gesamt:</b> ${order.total} €</p>
    <hr />
    <p>Sun-TEL · Badstraße 6 · 58095 Hagen<br/>
    Tel.: 02331 3484182 · WhatsApp: 015739684985</p>
  </div>`;
}

function repairMailHtml(repair) {
  return `
  <div style="font-family:Arial,sans-serif;line-height:1.6;color:#111">
    <h2>Sun-TEL Reparaturauftrag ${repair.ticketNo}</h2>
    <p>Ihre Reparaturanfrage wurde aufgenommen.</p>
    <p><b>Status:</b> ${repair.status}</p>
    <p><b>Kunde:</b> ${repair.customer?.firstName || ""} ${repair.customer?.lastName || ""}</p>
    <p><b>Telefon:</b> ${repair.customer?.phone || ""}</p>
    <p><b>E-Mail:</b> ${repair.customer?.email || ""}</p>
    <p><b>Gerät:</b> ${repair.device?.brand || ""} ${repair.device?.model || ""}</p>
    <p><b>Fehler:</b> ${repair.issue?.type || ""}</p>
    <p><b>Abgabeart:</b> ${repair.delivery || ""}</p>
    <p><b>Beschreibung:</b><br/>${repair.note || ""}</p>
    <p>Formular / Druckansicht:<br/>
    https://handyreparatur.shop/api/repairs/${repair.ticketNo}/print</p>
    <hr />
    <p>Sun-TEL · Badstraße 6 · 58095 Hagen<br/>
    Tel.: 02331 3484182 · WhatsApp: 015739684985</p>
  </div>`;
}

function publicProduct(p) {
  return p;
}


function xmlEscape(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function visualKindForProduct(product) {
  const text = [
    product.title,
    product.brand,
    product.model,
    product.category,
    product.subcategory,
    product.imageType
  ].join(" ").toLowerCase();

  if (text.includes("iphone") || text.includes("galaxy") || text.includes("smartphone") || text.includes("pixel") || text.includes("redmi") || text.includes("moto") || text.includes("oppo") || text.includes("nokia")) return "phone";
  if (text.includes("book") || text.includes("wallet") || text.includes("tasche")) return "wallet";
  if (text.includes("hülle") || text.includes("huelle") || text.includes("case") || text.includes("cover")) return "case";
  if (text.includes("panzerglas") || text.includes("schutzfolie") || text.includes("schutzglas")) return "glass";
  if (text.includes("ladegerät") || text.includes("ladegeraet") || text.includes("charger") || text.includes("adapter")) return "charger";
  if (text.includes("kabel") || text.includes("usb") || text.includes("lightning")) return "cable";
  if (text.includes("powerbank")) return "powerbank";
  if (text.includes("airpods") || text.includes("earbuds") || text.includes("kopfhörer") || text.includes("kopfhoerer") || text.includes("buds")) return "audio";
  if (text.includes("sim") || text.includes("lyca") || text.includes("ortel") || text.includes("ayy")) return "sim";
  if (text.includes("reparatur") || text.includes("service") || text.includes("diagnose") || text.includes("akkuwechsel")) return "repair";
  return product.imageType || "accessory";
}


function buildAIProductSvg(product) {
  const title = xmlEscape(product.title || "Suntel Produkt");
  const brand = xmlEscape(product.brand || "Suntel");
  const category = xmlEscape(product.category || "Shop");
  const price = Number(product.price || 0);
  const priceText = price > 0 ? `${price.toLocaleString("de-DE", { minimumFractionDigits: price % 1 ? 2 : 0, maximumFractionDigits: 2 })} €` : "auf Anfrage";
  const kind = visualKindForProduct(product);

  const palette = {
    phone: ["#dbeafe", "#2563eb", "#020617"],
    case: ["#111827", "#ff7600", "#0b1b2c"],
    wallet: ["#7c2d12", "#d97706", "#0b1b2c"],
    glass: ["#e0f2fe", "#38bdf8", "#0b1b2c"],
    charger: ["#f8fafc", "#94a3b8", "#0b1b2c"],
    cable: ["#f1f5f9", "#64748b", "#0b1b2c"],
    powerbank: ["#111827", "#64748b", "#0b1b2c"],
    audio: ["#f8fafc", "#111827", "#0b1b2c"],
    sim: ["#dc2626", "#172554", "#0b1b2c"],
    repair: ["#ff7600", "#1e293b", "#0b1b2c"],
    accessory: ["#ff7600", "#2563eb", "#0b1b2c"]
  };

  const [a, b, bg] = palette[kind] || palette.accessory;

  const drawings = {
    phone: `
      <rect x="220" y="58" width="180" height="310" rx="32" fill="#07111f" filter="url(#shadow)"/>
      <rect x="236" y="78" width="148" height="270" rx="24" fill="url(#deviceGrad)"/>
      <circle cx="262" cy="108" r="15" fill="#020617"/>
      <circle cx="296" cy="108" r="12" fill="#020617"/>
      <circle cx="262" cy="142" r="12" fill="#020617"/>
      <rect x="275" y="86" width="70" height="8" rx="4" fill="#020617" opacity=".8"/>
      <text x="310" y="222" text-anchor="middle" font-size="24" font-weight="800" fill="white">${brand}</text>
    `,
    case: `
      <rect x="210" y="65" width="200" height="300" rx="36" fill="url(#deviceGrad)" filter="url(#shadow)"/>
      <rect x="238" y="98" width="65" height="80" rx="24" fill="#020617" opacity=".82"/>
      <circle cx="262" cy="122" r="15" fill="#334155"/>
      <circle cx="288" cy="122" r="12" fill="#334155"/>
      <circle cx="262" cy="152" r="12" fill="#334155"/>
      <rect x="240" y="205" width="140" height="92" rx="18" fill="rgba(255,255,255,.14)"/>
      <text x="310" y="256" text-anchor="middle" font-size="23" font-weight="800" fill="white">CASE</text>
    `,
    wallet: `
      <rect x="170" y="70" width="250" height="295" rx="24" fill="url(#deviceGrad)" filter="url(#shadow)"/>
      <line x1="295" y1="75" x2="295" y2="360" stroke="rgba(255,255,255,.35)" stroke-width="4"/>
      <rect x="195" y="105" width="76" height="26" rx="8" fill="rgba(255,255,255,.28)"/>
      <rect x="195" y="146" width="76" height="26" rx="8" fill="rgba(255,255,255,.20)"/>
      <rect x="320" y="112" width="70" height="120" rx="18" fill="rgba(0,0,0,.20)"/>
      <text x="295" y="290" text-anchor="middle" font-size="22" font-weight="800" fill="white">BOOK CASE</text>
    `,
    glass: `
      <rect x="205" y="60" width="190" height="310" rx="34" fill="#07111f" filter="url(#shadow)"/>
      <rect x="225" y="82" width="150" height="266" rx="24" fill="rgba(255,255,255,.12)" stroke="#e0f2fe" stroke-width="4"/>
      <rect x="250" y="120" width="100" height="170" rx="18" fill="rgba(255,255,255,.22)" stroke="#38bdf8" stroke-width="3"/>
      <text x="300" y="315" text-anchor="middle" font-size="25" font-weight="800" fill="#e0f2fe">9H</text>
    `,
    charger: `
      <rect x="205" y="125" width="190" height="170" rx="30" fill="url(#deviceGrad)" filter="url(#shadow)"/>
      <rect x="242" y="82" width="28" height="62" rx="10" fill="#f8fafc"/>
      <rect x="328" y="82" width="28" height="62" rx="10" fill="#f8fafc"/>
      <rect x="242" y="205" width="114" height="28" rx="14" fill="#020617" opacity=".75"/>
      <circle cx="280" cy="219" r="7" fill="#38bdf8"/>
      <circle cx="318" cy="219" r="7" fill="#ff7600"/>
      <text x="300" y="267" text-anchor="middle" font-size="24" font-weight="800" fill="#020617">FAST</text>
    `,
    cable: `
      <path d="M190 180 C190 95, 405 95, 405 185 C405 275, 190 275, 190 190" fill="none" stroke="url(#deviceGrad)" stroke-width="26" stroke-linecap="round" filter="url(#shadow)"/>
      <rect x="165" y="165" width="70" height="48" rx="14" fill="#e2e8f0"/>
      <rect x="365" y="165" width="70" height="48" rx="14" fill="#e2e8f0"/>
      <text x="300" y="330" text-anchor="middle" font-size="28" font-weight="800" fill="white">USB-C</text>
    `,
    powerbank: `
      <rect x="190" y="110" width="235" height="190" rx="28" fill="url(#deviceGrad)" filter="url(#shadow)"/>
      <rect x="225" y="145" width="92" height="36" rx="14" fill="#020617" opacity=".78"/>
      <text x="271" y="170" text-anchor="middle" font-size="18" font-weight="800" fill="#8bffd4">100%</text>
      <rect x="345" y="146" width="38" height="14" rx="7" fill="#94a3b8"/>
      <text x="308" y="255" text-anchor="middle" font-size="25" font-weight="800" fill="white">POWERBANK</text>
    `,
    audio: `
      <rect x="190" y="170" width="210" height="115" rx="48" fill="url(#deviceGrad)" filter="url(#shadow)"/>
      <circle cx="255" cy="185" r="38" fill="#f8fafc"/>
      <circle cx="335" cy="185" r="38" fill="#f8fafc"/>
      <rect x="225" y="245" width="150" height="25" rx="12" fill="rgba(0,0,0,.20)"/>
      <text x="300" y="332" text-anchor="middle" font-size="28" font-weight="800" fill="white">AUDIO</text>
    `,
    sim: `
      <rect x="178" y="105" width="110" height="175" rx="16" fill="#dc2626" filter="url(#shadow)"/>
      <rect x="310" y="92" width="110" height="188" rx="16" fill="#172554" filter="url(#shadow)"/>
      <rect x="205" y="195" width="55" height="40" rx="8" fill="#fbbf24"/>
      <rect x="338" y="190" width="55" height="40" rx="8" fill="#fbbf24"/>
      <text x="233" y="155" text-anchor="middle" font-size="18" font-weight="800" fill="white">SIM</text>
      <text x="365" y="153" text-anchor="middle" font-size="18" font-weight="800" fill="white">TARIF</text>
    `,
    repair: `
      <rect x="170" y="170" width="260" height="135" rx="22" fill="#111827" filter="url(#shadow)"/>
      <rect x="205" y="115" width="155" height="220" rx="24" fill="url(#deviceGrad)"/>
      <path d="M385 110 L430 155 L295 290 L250 295 L255 250 Z" fill="#e5e7eb" filter="url(#shadow)"/>
      <circle cx="280" cy="160" r="22" fill="#020617"/>
      <text x="300" y="360" text-anchor="middle" font-size="28" font-weight="800" fill="white">REPAIR</text>
    `
  };

  const drawing = drawings[kind] || drawings.accessory || drawings.case;

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="900" height="700" viewBox="0 0 900 700">
  <defs>
    <linearGradient id="bgGrad" x1="0" x2="1" y1="0" y2="1">
      <stop stop-color="#06101d"/>
      <stop offset=".55" stop-color="${bg}"/>
      <stop offset="1" stop-color="#020811"/>
    </linearGradient>
    <linearGradient id="deviceGrad" x1="0" x2="1" y1="0" y2="1">
      <stop stop-color="${a}"/>
      <stop offset="1" stop-color="${b}"/>
    </linearGradient>
    <filter id="shadow">
      <feDropShadow dx="0" dy="24" stdDeviation="18" flood-color="#000000" flood-opacity=".55"/>
    </filter>
  </defs>

  <rect width="900" height="700" fill="url(#bgGrad)"/>
  <circle cx="735" cy="95" r="190" fill="#ff7600" opacity=".14"/>
  <circle cx="155" cy="120" r="160" fill="#43a6ff" opacity=".12"/>

  <rect x="42" y="42" width="816" height="616" rx="38" fill="rgba(255,255,255,.045)" stroke="rgba(145,201,255,.18)"/>

  <text x="76" y="98" font-family="Arial, sans-serif" font-size="30" font-weight="900" fill="#ffffff">Sun-TEL</text>
  <text x="76" y="130" font-family="Arial, sans-serif" font-size="18" font-weight="700" fill="#ff9d2e">KI-Symbolbild · Hagen</text>

  ${drawing}

  <rect x="75" y="475" width="750" height="125" rx="24" fill="rgba(2,8,17,.58)" stroke="rgba(145,201,255,.20)"/>
  <text x="105" y="525" font-family="Arial, sans-serif" font-size="34" font-weight="900" fill="#ffffff">${title}</text>
  <text x="105" y="562" font-family="Arial, sans-serif" font-size="22" font-weight="700" fill="#a6b8c9">${brand} · ${category}</text>
  <text x="105" y="604" font-family="Arial, sans-serif" font-size="30" font-weight="900" fill="#ff9d2e">${xmlEscape(priceText)}</text>

  <text x="825" y="632" text-anchor="end" font-family="Arial, sans-serif" font-size="15" font-weight="700" fill="#8bffd4">Symbolbild</text>
</svg>`;
}

function createLocalAIImage(product) {
  const uploadDir = path.join(rootDir, "public", "uploads", "ai-products");
  fs.mkdirSync(uploadDir, { recursive: true });

  const safeTitle = slugify(product.title || "suntel-produkt").slice(0, 70) || "suntel-produkt";
  const idPart = String(product.id || Date.now()).replace(/[^a-zA-Z0-9-]/g, "");
  const filename = `ai-${idPart}-${safeTitle}.svg`;
  const filePath = path.join(uploadDir, filename);

  fs.writeFileSync(filePath, buildAIProductSvg(product), "utf8");

  return `/uploads/ai-products/${filename}`;
}

function ensureLocalAIImage(product, force = false) {
  const current = String(product.imageUrl || "");
  const shouldCreate =
    force ||
    !current ||
    current.includes("loremflickr.com") ||
    current.includes("unsplash.com") ||
    current.includes("pixabay.com") ||
    current.includes("pexels.com");

  if (shouldCreate) {
    product.imageUrl = createLocalAIImage(product);
    product.gallery = [product.imageUrl];
    product.imageSource = "KI-Symbolbild";
    product.imageAlt = `${product.title || "Suntel Produkt"} - KI-Symbolbild`;
  }

  return product;
}

function nextNo(prefix) {
  const now = new Date();
  const stamp = [
    now.getFullYear(),
    String(now.getMonth() + 1).padStart(2, "0"),
    String(now.getDate()).padStart(2, "0")
  ].join("");
  return `${prefix}-${stamp}-${crypto.randomBytes(3).toString("hex").toUpperCase()}`;
}

function requireAdmin(req, res, next) {
  const header = req.headers.authorization || "";
  const token = header.replace(/^Bearer\s+/i, "");
  if (token && token === ADMIN_TOKEN) return next();
  return res.status(401).json({ ok: false, error: "not_authorized" });
}

app.get("/api/health", (_req, res) => {
  res.json({
    ok: true,
    app: "suntelshop-full-v1",
    domain: "handyreparatur.shop",
    business: "Sun-TEL / Suntel",
    city: "Hagen",
    products: readJson("products.json", []).length,
    time: new Date().toISOString()
  });
});

app.get("/api/business", (_req, res) => {
  res.json({
    name: "Sun-TEL",
    seoName: "Suntel",
    owner: "Ali Sun",
    address: "Badstraße 6, 58095 Hagen",
    phone: "02331 3484182",
    whatsapp: "015739684985",
    email: "suntel58135@gmail.com",
    since: "Seit 24 Jahren in Hagen",
    openingHours: [
      "Montag - Freitag: 09:30 - 18:30 Uhr",
      "Samstag: 10:00 - 16:00 Uhr",
      "Sonntag: Geschlossen"
    ]
  });
});

app.get("/api/products", (req, res) => {
  const products = readJson("products.json", []).filter((p) => p.status !== "deleted");
  const { q, category, brand, subcategory } = req.query;
  let list = products;
  if (q) {
    const s = String(q).toLowerCase();
    list = list.filter((p) => [p.title, p.brand, p.model, p.category, p.subcategory, p.description].join(" ").toLowerCase().includes(s));
  }
  if (category) list = list.filter((p) => p.category === category);
  if (brand) list = list.filter((p) => p.brand === brand);
  if (subcategory) list = list.filter((p) => p.subcategory === subcategory);
  res.json({ ok: true, products: list.map(publicProduct) });
});

app.get("/api/products/:slug", (req, res) => {
  const products = readJson("products.json", []);
  const product = products.find((p) => p.slug === req.params.slug || String(p.id) === req.params.slug);
  if (!product || product.status === "deleted") return res.status(404).json({ ok: false, error: "not_found" });
  res.json({ ok: true, product });
});

app.post("/api/orders", (req, res) => {
  const orders = readJson("orders.json", []);
  const products = readJson("products.json", []);
  const body = req.body || {};
  const items = Array.isArray(body.items) ? body.items : [];
  const safeItems = items.map((item) => {
    const p = products.find((x) => String(x.id) === String(item.productId));
    const qty = Math.max(1, Number(item.qty || 1));
    return p ? {
      productId: p.id,
      title: p.title,
      price: p.price,
      qty,
      lineTotal: Number((p.price * qty).toFixed(2))
    } : null;
  }).filter(Boolean);
  const total = safeItems.reduce((sum, item) => sum + item.lineTotal, 0);
  const order = {
    id: crypto.randomUUID(),
    orderNo: nextNo("ST-B"),
    status: "Neu",
    createdAt: new Date().toISOString(),
    customer: body.customer || {},
    delivery: body.delivery || {},
    payment: body.payment || "Bar bei Abholung",
    note: body.note || "",
    items: safeItems,
    total: Number(total.toFixed(2))
  };
  orders.unshift(order);
  writeJson("orders.json", orders);

  const html = orderMailHtml(order);

  if (order.customer?.email) {
    sendMailSafe({
      to: order.customer.email,
      subject: `Sun-TEL Bestellung ${order.orderNo}`,
      html
    });
  }

  sendMailSafe({
    to: adminMail(),
    subject: `Neue Bestellung: ${order.orderNo}`,
    html
  });

  res.json({ ok: true, orderNo: order.orderNo, order });
});

app.post("/api/repairs", (req, res) => {
  const repairs = readJson("repairs.json", []);
  const body = req.body || {};
  const repair = {
    id: crypto.randomUUID(),
    ticketNo: nextNo("ST-R"),
    status: "Neu eingegangen",
    createdAt: new Date().toISOString(),
    customer: body.customer || {},
    device: body.device || {},
    issue: body.issue || {},
    delivery: body.delivery || "Im Laden abgeben",
    note: body.note || "",
    acceptedTerms: Boolean(body.acceptedTerms)
  };
  repairs.unshift(repair);
  writeJson("repairs.json", repairs);

  const html = repairMailHtml(repair);

  if (repair.customer?.email) {
    sendMailSafe({
      to: repair.customer.email,
      subject: `Sun-TEL Reparaturauftrag ${repair.ticketNo}`,
      html
    });
  }

  sendMailSafe({
    to: adminMail(),
    subject: `Neue Reparaturanfrage: ${repair.ticketNo}`,
    html
  });

  res.json({ ok: true, ticketNo: repair.ticketNo, repair });
});

app.get("/api/repairs/:ticketNo/print", (req, res) => {
  const repairs = readJson("repairs.json", []);
  const r = repairs.find((x) => x.ticketNo === req.params.ticketNo);
  if (!r) return res.status(404).send("Auftrag nicht gefunden");
  res.setHeader("Content-Type", "text/html; charset=utf-8");
  res.end(`<!doctype html>
<html lang="de">
<head>
<meta charset="utf-8" />
<title>Reparaturauftrag ${r.ticketNo}</title>
<style>
body{font-family:Arial,sans-serif;margin:30px;color:#111}
h1{font-size:26px;margin:0 0 5px}
.box{border:1px solid #333;padding:14px;margin:12px 0}
.grid{display:grid;grid-template-columns:1fr 1fr;gap:10px}
.small{font-size:12px;line-height:1.45}
.sign{display:grid;grid-template-columns:1fr 1fr;gap:30px;margin-top:40px}
.line{border-top:1px solid #111;padding-top:8px}
@media print{button{display:none}}
</style>
</head>
<body>
<button onclick="window.print()">Drucken / als PDF speichern</button>
<h1>Sun-TEL Reparaturauftrag</h1>
<div>Badstraße 6, 58095 Hagen · 02331 3484182 · suntel58135@gmail.com</div>
<div><b>Auftragsnummer:</b> ${r.ticketNo}</div>
<div class="grid">
<div class="box">
<h3>Kundendaten</h3>
<p>Name: ${r.customer.firstName || ""} ${r.customer.lastName || ""}</p>
<p>Telefon: ${r.customer.phone || ""}</p>
<p>E-Mail: ${r.customer.email || ""}</p>
<p>Adresse: ${r.customer.address || ""}</p>
</div>
<div class="box">
<h3>Gerätedaten</h3>
<p>Marke: ${r.device.brand || ""}</p>
<p>Modell: ${r.device.model || ""}</p>
<p>IMEI/Seriennummer: ${r.device.serial || ""}</p>
<p>Abgabeart: ${r.delivery || ""}</p>
</div>
</div>
<div class="box">
<h3>Fehlerbeschreibung</h3>
<p>${r.issue.type || ""}</p>
<p>${r.note || ""}</p>
</div>
<div class="box small">
<h3>Kundenhinweise / Annahmebedingungen</h3>
<p>Der Kunde bestätigt, dass die oben genannten Angaben korrekt sind. Bei Reparaturen können Datenverluste nicht vollständig ausgeschlossen werden. Der Kunde ist für eine vorherige Datensicherung verantwortlich. Sichtbare und nicht sichtbare Vorschäden können die Reparatur beeinflussen. Ersatzteilpreise und Reparaturdauer können je nach Gerät und Verfügbarkeit variieren. Eine Reparatur erfolgt erst nach Prüfung und Freigabe, sofern ein zusätzlicher Kostenvoranschlag notwendig ist.</p>
</div>
<div class="sign">
<div class="line">Ort, Datum</div>
<div class="line">Unterschrift Kunde</div>
</div>
</body>
</html>`);
});

app.post("/api/admin/login", (req, res) => {
  const { username, password } = req.body || {};
  if (username === ADMIN_USER && password === ADMIN_PASSWORD) {
    return res.json({ ok: true, token: ADMIN_TOKEN });
  }
  return res.status(401).json({ ok: false, error: "login_failed" });
});


app.post("/api/admin/test-mail", requireAdmin, async (req, res) => {
  const to = req.body?.to || adminMail();

  const result = await sendMailSafe({
    to,
    subject: "Sun-TEL Test Mail",
    html: `
      <div style="font-family:Arial,sans-serif;line-height:1.6">
        <h2>Sun-TEL Test Mail</h2>
        <p>Wenn Sie diese E-Mail erhalten, funktioniert der SMTP Versand.</p>
        <p>Domain: https://handyreparatur.shop</p>
      </div>`
  });

  res.json({ ok: Boolean(result.ok), result });
});

app.get("/api/admin/summary", requireAdmin, (_req, res) => {
  res.json({
    ok: true,
    products: readJson("products.json", []).filter((p) => p.status !== "deleted"),
    orders: readJson("orders.json", []),
    repairs: readJson("repairs.json", [])
  });
});



function inferProductFromTitle(titleRaw) {
  const title = String(titleRaw || "").trim();
  const lower = title.toLowerCase();

  function includesAny(words) {
    return words.some(w => lower.includes(w));
  }

  let brand = "Suntel";
  let model = title;
  let category = "Zubehör";
  let subcategory = "Allgemein";
  let badge = "Neu";
  let imageType = "accessory";
  let price = 9.90;
  let stock = 1;
  let warranty = "12 Monate Gewährleistung";
  let specs = ["Sofort verfügbar", "Top Qualität", "Beratung im Shop"];
  let description = `${title} bei Suntel in Hagen. Persönliche Beratung, faire Preise und Abholung im Shop möglich.`;

  const brandRules = [
    ["Apple", ["iphone", "ipad", "airpods", "apple", "lightning", "magsafe"]],
    ["Samsung", ["samsung", "galaxy", "buds"]],
    ["Xiaomi", ["xiaomi", "redmi", "poco", "mi "]],
    ["Google", ["pixel", "google"]],
    ["Motorola", ["motorola", "moto"]],
    ["Oppo", ["oppo", "reno", "find x"]],
    ["Huawei", ["huawei", "p30", "p40", "mate"]],
    ["Honor", ["honor"]],
    ["Nokia", ["nokia"]],
    ["Sony", ["sony", "xperia"]],
    ["OnePlus", ["oneplus", "nord"]],
    ["Ayyıldız", ["ayyildiz", "ayyıldız", "ay yildiz", "ay yıldız"]],
    ["Lyca Mobile", ["lyca"]],
    ["Ortel Mobile", ["ortel"]],
    ["Anker", ["anker"]],
    ["Baseus", ["baseus"]],
    ["JBL", ["jbl"]],
    ["Belkin", ["belkin"]]
  ];

  for (const [b, keys] of brandRules) {
    if (includesAny(keys)) {
      brand = b;
      break;
    }
  }

  if (includesAny(["iphone", "galaxy", "redmi", "poco", "pixel", "motorola", "moto ", "oppo", "reno", "honor", "nokia", "xperia", "oneplus", "huawei"])) {
    category = lower.includes("gebraucht") || lower.includes("geprüft") || lower.includes("refurbished")
      ? "Gebrauchte Smartphones"
      : "Neue Smartphones";
    subcategory = "Smartphone";
    imageType = "phone";
    badge = category === "Gebrauchte Smartphones" ? "Geprüft" : "Neu";
    price = category === "Gebrauchte Smartphones" ? 249 : 349;
    stock = 1;
    specs = ["128 GB", "5G", "Geprüfte Qualität"];
    warranty = category === "Gebrauchte Smartphones" ? "12 Monate Gewährleistung" : "24 Monate Herstellergarantie";
    description = `${title} bei Suntel in Hagen. Smartphone mit persönlicher Beratung, Abholung im Shop und passendem Zubehör.`;
  }

  if (includesAny(["case", "hülle", "huelle", "cover", "schutzhülle", "schutzhulle", "tasche"])) {
    category = "Zubehör";
    subcategory = includesAny(["book", "wallet", "tasche"]) ? "Handyhüllen" : "Handyhüllen";
    imageType = "case";
    badge = includesAny(["book", "wallet", "tasche"]) ? "Book Case" : "Hülle";
    price = includesAny(["book", "wallet", "tasche"]) ? 14.90 : 12.90;
    specs = includesAny(["book", "wallet", "tasche"])
      ? ["Magnetverschluss", "Kartenfach", "Klapphülle"]
      : ["Passgenau", "Stoßfest", "Mehrere Farben"];
    description = `${title} bei Suntel in Hagen. Passende Handyhülle mit Schutzfunktion und hochwertiger Verarbeitung.`;
  }

  if (includesAny(["panzerglas", "schutzglas", "schutzfolie", "display folie", "displayfolie", "tempered glass"])) {
    category = "Zubehör";
    subcategory = "Panzerglas & Folien";
    imageType = "glass";
    badge = includesAny(["kamera"]) ? "Kamera Schutz" : "Schutz";
    price = includesAny(["kamera"]) ? 5.90 : 7.90;
    specs = ["9H Härte", "Kratzfest", "Montage möglich"];
    description = `${title} bei Suntel in Hagen. Schutzglas oder Folie für zuverlässigen Displayschutz, auf Wunsch mit Montage im Shop.`;
  }

  if (includesAny(["ladegerät", "ladegeraet", "charger", "power adapter", "netzteil", "20w", "25w", "30w", "45w", "65w"])) {
    category = "Zubehör";
    subcategory = "Ladegeräte";
    imageType = "charger";
    badge = "Schnellladen";
    price = lower.includes("65w") ? 39.90 : lower.includes("45w") ? 29.90 : lower.includes("30w") ? 24.90 : 19.90;
    specs = ["USB-C", "Schnellladen", "Sofort verfügbar"];
    description = `${title} bei Suntel in Hagen. Ladegerät für schnelles und sicheres Laden im Alltag.`;
  }

  if (includesAny(["kabel", "usb-c", "lightning", "usb c", "datenkabel"])) {
    category = "Zubehör";
    subcategory = "Kabel";
    imageType = "cable";
    badge = "Kabel";
    price = lower.includes("2m") ? 12.90 : 9.90;
    specs = ["Schnelles Laden", "Datenübertragung", "Robuste Qualität"];
    description = `${title} bei Suntel in Hagen. Passendes Ladekabel und Datenkabel für Smartphone und Zubehör.`;
  }

  if (includesAny(["powerbank", "power bank", "10000", "10.000", "20000", "20.000"])) {
    category = "Zubehör";
    subcategory = "Powerbanks";
    imageType = "powerbank";
    badge = "Powerbank";
    price = includesAny(["20000", "20.000"]) ? 34.90 : 19.90;
    specs = ["Mobile Energie", "USB-C", "Sofort verfügbar"];
    description = `${title} bei Suntel in Hagen. Mobile Powerbank für unterwegs, Reisen und Alltag.`;
  }

  if (includesAny(["airpods", "earbuds", "kopfhörer", "kopfhoerer", "headset", "bluetooth", "buds", "jbl"])) {
    category = "Zubehör";
    subcategory = "Kopfhörer & Audio";
    imageType = "audio";
    badge = "Audio";
    price = includesAny(["airpods", "pro"]) ? 129.00 : includesAny(["jbl", "bluetooth"]) ? 39.90 : 19.90;
    specs = ["Bluetooth", "Guter Klang", "Sofort verfügbar"];
    description = `${title} bei Suntel in Hagen. Audio-Zubehör für Musik, Telefonie und Alltag.`;
  }

  if (includesAny(["halterung", "handyhalter", "auto", "kfz", "car mount"])) {
    category = "Zubehör";
    subcategory = "Auto Zubehör";
    imageType = "holder";
    badge = "Auto";
    price = 14.90;
    specs = ["Auto Zubehör", "Sicherer Halt", "Einfache Montage"];
    description = `${title} bei Suntel in Hagen. Handyhalterung und Auto-Zubehör für sichere Nutzung unterwegs.`;
  }

  if (includesAny(["sim", "prepaid", "ayyildiz", "ayyıldız", "lyca", "ortel", "aufladung", "tarif"])) {
    category = "SIM-Karten & Tarife";
    subcategory = "Prepaid SIM";
    imageType = "sim";
    badge = "SIM";
    price = includesAny(["aufladung", "tarifberatung", "beratung"]) ? 0 : 9.99;
    specs = ["Aktivierung im Shop", "Aufladung möglich", "Tarifberatung"];
    description = `${title} bei Suntel in Hagen. SIM-Karte, Aktivierung, Aufladung und persönliche Tarifberatung direkt im Shop.`;
  }

  if (includesAny(["passfoto", "passbild", "biometrisch", "kopie", "fotokopie", "scan", "druck"])) {
    category = "Service";
    subcategory = includesAny(["kopie", "scan", "druck"]) ? "Kopierservice" : "Passfotos";
    imageType = "service";
    badge = "Service";
    price = includesAny(["passfoto", "passbild"]) ? 12.00 : 0.50;
    specs = ["Direkt zum Mitnehmen", "Schnell vor Ort", "Service in Hagen"];
    description = `${title} bei Suntel in Hagen. Schneller Service direkt vor Ort.`;
  }

  if (includesAny(["reparatur", "display reparatur", "akkuwechsel", "ladebuchse", "wasserschaden", "datenrettung", "diagnose"])) {
    category = "Service";
    subcategory = "Handyservice";
    imageType = "service";
    badge = "Reparatur";
    price = 0;
    specs = ["Vor Ort in Hagen", "Schnell & zuverlässig", "Persönliche Beratung"];
    description = `${title} bei Suntel in Hagen. Reparaturservice mit Diagnose, Beratung und transparenter Abwicklung.`;
  }

  return {
    title,
    brand,
    model,
    category,
    subcategory,
    price,
    oldPrice: null,
    stock,
    badge,
    imageType,
    specs,
    description,
    warranty,
    imageUrl: `https://loremflickr.com/520/420/${encodeURIComponent(imageType === "phone" ? "smartphone,product" : imageType + ",phone,accessory")}?lock=${Date.now().toString().slice(-6)}`,
    note: "Automatisch aus dem Produktnamen vorgeschlagen. Bitte Preis und Bild vor Veröffentlichung kurz prüfen."
  };
}

app.post("/api/admin/product-autofill", requireAdmin, (req, res) => {
  const { title } = req.body || {};
  if (!title || !String(title).trim()) {
    return res.status(400).json({ ok: false, error: "missing_title" });
  }

  const product = ensureLocalAIImage(inferProductFromTitle(title), true);

  return res.json({
    ok: true,
    product
  });
});



app.post("/api/admin/generate-symbol-image", requireAdmin, (req, res) => {
  try {
    const body = req.body || {};
    if (!body.title || !String(body.title).trim()) {
      return res.status(400).json({ ok: false, error: "missing_title" });
    }

    const product = ensureLocalAIImage({ ...body, id: body.id || `draft-${Date.now()}` }, true);

    return res.json({
      ok: true,
      url: product.imageUrl,
      imageUrl: product.imageUrl,
      gallery: product.gallery,
      imageSource: "KI-Symbolbild",
      message: "Kostenloses lokales KI-Symbolbild erstellt."
    });
  } catch (err) {
    return res.status(500).json({ ok: false, error: "symbol_image_failed", message: String(err?.message || err) });
  }
});


app.post("/api/admin/upload-image", requireAdmin, (req, res) => {
  try {
    const { filename, mime, data } = req.body || {};

    if (!filename || !data) {
      return res.status(400).json({ ok: false, error: "missing_file_data" });
    }

    const allowed = ["image/png", "image/jpeg", "image/jpg", "image/webp"];
    const safeMime = String(mime || "").toLowerCase();

    if (!allowed.includes(safeMime)) {
      return res.status(400).json({ ok: false, error: "unsupported_file_type" });
    }

    const ext =
      safeMime === "image/png" ? ".png" :
      safeMime === "image/webp" ? ".webp" :
      ".jpg";

    const cleanBase = String(filename)
      .replace(/\.[a-zA-Z0-9]+$/, "")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 60) || "produktbild";

    const uploadDir = path.join(rootDir, "public", "uploads", "products");
    fs.mkdirSync(uploadDir, { recursive: true });

    const outName = `${Date.now()}-${cleanBase}${ext}`;
    const outFile = path.join(uploadDir, outName);

    const base64 = String(data).includes(",") ? String(data).split(",").pop() : String(data);
    fs.writeFileSync(outFile, Buffer.from(base64, "base64"));

    return res.json({
      ok: true,
      url: `/uploads/products/${outName}`,
      filename: outName
    });
  } catch (err) {
    return res.status(500).json({ ok: false, error: "upload_failed", message: String(err?.message || err) });
  }
});


app.post("/api/admin/products", requireAdmin, (req, res) => {
  const products = readJson("products.json", []);
  const body = req.body || {};
  const product = {
    id: products.length ? Math.max(...products.map((p) => Number(p.id) || 0)) + 1 : 1,
    slug: slugify(body.title || "produkt") + "-" + Date.now(),
    status: "active",
    title: body.title || "Neues Produkt",
    brand: body.brand || "Suntel",
    model: body.model || "",
    category: body.category || "Zubehör",
    subcategory: body.subcategory || "Allgemein",
    price: Number(body.price || 0),
    oldPrice: body.oldPrice ? Number(body.oldPrice) : null,
    stock: Number(body.stock || 1),
    badge: body.badge || "Neu",
    imageType: body.imageType || "accessory",
    imageUrl: body.imageUrl || "",
    gallery: Array.isArray(body.gallery) ? body.gallery : [],
    imageSource: body.imageSource || "",
    imageAlt: body.imageAlt || body.title || "",
    colorA: body.colorA || "#0f2a44",
    colorB: body.colorB || "#ff7a00",
    specs: Array.isArray(body.specs) ? body.specs : String(body.specs || "Sofort verfügbar,Top Qualität").split(",").map((x) => x.trim()).filter(Boolean),
    description: body.description || "",
    warranty: body.warranty || "12 Monate Gewährleistung",
    seo: body.seo || "",
    createdAt: new Date().toISOString()
  };
  ensureLocalAIImage(product, !product.imageUrl || String(product.imageUrl).includes("loremflickr.com"));
  products.unshift(product);
  writeJson("products.json", products);
  res.json({ ok: true, product });
});

app.patch("/api/admin/products/:id", requireAdmin, (req, res) => {
  const products = readJson("products.json", []);
  const idx = products.findIndex((p) => String(p.id) === String(req.params.id));
  if (idx < 0) return res.status(404).json({ ok: false });
  products[idx] = { ...products[idx], ...req.body, updatedAt: new Date().toISOString() };
  ensureLocalAIImage(products[idx], Boolean(req.body?.generateAIImage));
  writeJson("products.json", products);
  res.json({ ok: true, product: products[idx] });
});

app.delete("/api/admin/products/:id", requireAdmin, (req, res) => {
  const products = readJson("products.json", []);
  const idx = products.findIndex((p) => String(p.id) === String(req.params.id));
  if (idx < 0) return res.status(404).json({ ok: false });
  products[idx].status = "deleted";
  products[idx].updatedAt = new Date().toISOString();
  writeJson("products.json", products);
  res.json({ ok: true });
});

app.patch("/api/admin/orders/:id", requireAdmin, (req, res) => {
  const orders = readJson("orders.json", []);
  const idx = orders.findIndex((o) => String(o.id) === String(req.params.id));
  if (idx < 0) return res.status(404).json({ ok: false });
  orders[idx] = { ...orders[idx], ...req.body, updatedAt: new Date().toISOString() };
  writeJson("orders.json", orders);
  res.json({ ok: true, order: orders[idx] });
});

app.patch("/api/admin/repairs/:id", requireAdmin, (req, res) => {
  const repairs = readJson("repairs.json", []);
  const idx = repairs.findIndex((r) => String(r.id) === String(req.params.id));
  if (idx < 0) return res.status(404).json({ ok: false });
  repairs[idx] = { ...repairs[idx], ...req.body, updatedAt: new Date().toISOString() };
  writeJson("repairs.json", repairs);
  res.json({ ok: true, repair: repairs[idx] });
});

app.use(express.static(distDir));

app.use((_req, res) => {
  const indexFile = path.join(distDir, "index.html");
  if (fs.existsSync(indexFile)) return res.sendFile(indexFile);
  return res.status(200).send("SuntelShop build fehlt. Bitte npm run build ausführen.");
});

app.listen(PORT, "127.0.0.1", () => {
  console.log(`SuntelShop Full V1 läuft auf http://127.0.0.1:${PORT}`);
});
