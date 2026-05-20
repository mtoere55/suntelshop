import fs from "fs";
import path from "path";

const root = process.cwd();
const dataDir = path.join(root, "data");
fs.mkdirSync(dataDir, { recursive: true });

const force = process.argv.includes("--force");
const productsFile = path.join(dataDir, "products.json");

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

const products = [];
let id = 1;

function add(item) {
  const title = item.title;
  products.push({
    id: id++,
    slug: slugify(title + "-" + id),
    status: "active",
    stock: item.stock ?? Math.floor(Math.random() * 8) + 1,
    oldPrice: item.oldPrice ?? null,
    warranty: item.warranty ?? "12 Monate Gewährleistung",
    createdAt: new Date().toISOString(),
    ...item
  });
}

function phone(title, brand, model, price, category = "Neue Smartphones", opts = {}) {
  add({
    title,
    brand,
    model,
    category,
    subcategory: opts.subcategory || "Smartphone",
    price,
    badge: opts.badge || (category.includes("Gebrauchte") ? "Geprüft" : "Neu"),
    imageType: "phone",
    colorA: opts.colorA || "#bfefff",
    colorB: opts.colorB || "#4f7cff",
    specs: opts.specs || ["128 GB", "5G", "Geprüfte Qualität"],
    description: opts.description || `${title} bei Suntel in Hagen. Persönliche Beratung, faire Preise und direkte Abholung im Shop möglich.`,
    seo: `${brand} ${model} kaufen Hagen Suntel Handyshop`
  });
}

function accessory(title, brand, price, subcategory, opts = {}) {
  add({
    title,
    brand,
    model: opts.model || "Universal",
    category: "Zubehör",
    subcategory,
    price,
    badge: opts.badge || subcategory,
    imageType: opts.imageType || "accessory",
    colorA: opts.colorA || "#0f2a44",
    colorB: opts.colorB || "#ff7a00",
    specs: opts.specs || ["Sofort verfügbar", "Top Qualität", "Beratung im Shop"],
    description: opts.description || `${title} sofort bei Suntel in Hagen erhältlich. Passendes Zubehör für Ihr Smartphone direkt vor Ort.`,
    seo: `${title} kaufen Hagen Suntel Zubehör`
  });
}

function sim(title, brand, price, opts = {}) {
  add({
    title,
    brand,
    model: opts.model || brand,
    category: "SIM-Karten & Tarife",
    subcategory: opts.subcategory || "Prepaid SIM",
    price,
    badge: opts.badge || "SIM",
    imageType: "sim",
    colorA: opts.colorA || "#e12727",
    colorB: opts.colorB || "#172554",
    specs: opts.specs || ["Aktivierung im Shop", "Aufladung möglich", "Tarifberatung"],
    description: opts.description || `${title} bei Suntel in Hagen. Aktivierung, Aufladung und persönliche Tarifberatung direkt vor Ort.`,
    seo: `${brand} SIM Karte Hagen Suntel`
  });
}

function service(title, price, subcategory, opts = {}) {
  add({
    title,
    brand: opts.brand || "Suntel Service",
    model: opts.model || "Service",
    category: "Service",
    subcategory,
    price,
    badge: opts.badge || "Service",
    imageType: "service",
    colorA: opts.colorA || "#ff7a00",
    colorB: opts.colorB || "#0f2a44",
    specs: opts.specs || ["Vor Ort in Hagen", "Schnell & zuverlässig", "Persönliche Beratung"],
    description: opts.description || `${title} bei Suntel in Hagen. Seit 24 Jahren Ihr Ansprechpartner für Technik, Reparatur und Service.`,
    seo: `${title} Hagen Suntel`
  });
}

[
  ["Apple iPhone 16 Pro Max", "Apple", "iPhone 16 Pro Max", 1199, "#e9f8ff", "#7aa7ff"],
  ["Apple iPhone 16 Pro", "Apple", "iPhone 16 Pro", 1099, "#f3f4f6", "#6b7280"],
  ["Apple iPhone 16", "Apple", "iPhone 16", 899, "#e0f2fe", "#2563eb"],
  ["Apple iPhone 15 Pro", "Apple", "iPhone 15 Pro", 899, "#f5f5f4", "#78716c"],
  ["Apple iPhone 15", "Apple", "iPhone 15", 699, "#cffafe", "#38bdf8"],
  ["Apple iPhone 14", "Apple", "iPhone 14", 599, "#fee2e2", "#ef4444"],
  ["Apple iPhone 13", "Apple", "iPhone 13", 489, "#dbeafe", "#3b82f6"],
  ["Apple iPhone SE 2022", "Apple", "iPhone SE", 299, "#f8fafc", "#334155"],
  ["Samsung Galaxy S25 Ultra", "Samsung", "Galaxy S25 Ultra", 1199, "#e0f2fe", "#020617"],
  ["Samsung Galaxy S25", "Samsung", "Galaxy S25", 899, "#dcfce7", "#16a34a"],
  ["Samsung Galaxy S24 FE", "Samsung", "Galaxy S24 FE", 649, "#ede9fe", "#7c3aed"],
  ["Samsung Galaxy A56 5G", "Samsung", "Galaxy A56 5G", 349, "#bbf7d0", "#4f46e5"],
  ["Samsung Galaxy A36 5G", "Samsung", "Galaxy A36 5G", 299, "#d9f99d", "#22c55e"],
  ["Samsung Galaxy A26 5G", "Samsung", "Galaxy A26 5G", 249, "#e0f2fe", "#0284c7"],
  ["Samsung Galaxy A17 5G", "Samsung", "Galaxy A17 5G", 239, "#dbeafe", "#6366f1"],
  ["Samsung Galaxy A16", "Samsung", "Galaxy A16", 179, "#ecfeff", "#06b6d4"],
  ["Xiaomi 15", "Xiaomi", "15", 799, "#fef3c7", "#f97316"],
  ["Xiaomi Redmi Note 14 Pro", "Xiaomi", "Redmi Note 14 Pro", 349, "#ffedd5", "#ea580c"],
  ["Xiaomi Redmi Note 13", "Xiaomi", "Redmi Note 13", 229, "#fef9c3", "#ca8a04"],
  ["Xiaomi Redmi 14C", "Xiaomi", "Redmi 14C", 149, "#ecfccb", "#65a30d"],
  ["POCO X7 Pro", "Xiaomi", "POCO X7 Pro", 399, "#fef08a", "#1f2937"],
  ["Google Pixel 9", "Google", "Pixel 9", 749, "#e0e7ff", "#4f46e5"],
  ["Google Pixel 8a", "Google", "Pixel 8a", 399, "#dcfce7", "#15803d"],
  ["Motorola Moto G85", "Motorola", "Moto G85", 259, "#e9d5ff", "#9333ea"],
  ["Motorola Moto G55", "Motorola", "Moto G55", 199, "#dbeafe", "#1d4ed8"],
  ["Oppo Reno12", "Oppo", "Reno12", 349, "#d1fae5", "#059669"],
  ["Oppo A80", "Oppo", "A80", 249, "#f0fdf4", "#16a34a"],
  ["Oppo A60", "Oppo", "A60", 189, "#ecfeff", "#0891b2"],
  ["Honor 200 Lite", "Honor", "200 Lite", 279, "#f5f3ff", "#7c3aed"],
  ["Nokia G42", "Nokia", "G42", 189, "#dbeafe", "#0f172a"]
].forEach(([t,b,m,p,a,c]) => phone(t,b,m,p,"Neue Smartphones",{colorA:a,colorB:c}));

[
  ["Apple iPhone 14 geprüft", "Apple", "iPhone 14", 499],
  ["Apple iPhone 13 geprüft", "Apple", "iPhone 13", 389],
  ["Apple iPhone 12 geprüft", "Apple", "iPhone 12", 329],
  ["Apple iPhone 11 geprüft", "Apple", "iPhone 11", 249],
  ["Apple iPhone XR geprüft", "Apple", "iPhone XR", 189],
  ["Apple iPhone SE geprüft", "Apple", "iPhone SE", 179],
  ["Samsung Galaxy S23 geprüft", "Samsung", "Galaxy S23", 499],
  ["Samsung Galaxy S22 geprüft", "Samsung", "Galaxy S22", 289],
  ["Samsung Galaxy S21 5G geprüft", "Samsung", "Galaxy S21 5G", 279],
  ["Samsung Galaxy A54 geprüft", "Samsung", "Galaxy A54", 249],
  ["Samsung Galaxy A53 5G geprüft", "Samsung", "Galaxy A53 5G", 189],
  ["Samsung Galaxy A52 geprüft", "Samsung", "Galaxy A52", 169],
  ["Xiaomi Redmi Note 12 gebraucht", "Xiaomi", "Redmi Note 12", 159],
  ["Xiaomi Mi 11 Lite gebraucht", "Xiaomi", "Mi 11 Lite", 149],
  ["Huawei P30 Lite gebraucht", "Huawei", "P30 Lite", 139],
  ["Huawei P40 Lite gebraucht", "Huawei", "P40 Lite", 159],
  ["Google Pixel 7 geprüft", "Google", "Pixel 7", 299],
  ["Google Pixel 6a geprüft", "Google", "Pixel 6a", 219],
  ["Oppo Find X3 Lite gebraucht", "Oppo", "Find X3 Lite", 189],
  ["Motorola Edge 30 gebraucht", "Motorola", "Edge 30", 199],
  ["OnePlus Nord 2 gebraucht", "OnePlus", "Nord 2", 199],
  ["Sony Xperia 10 gebraucht", "Sony", "Xperia 10", 169]
].forEach(([t,b,m,p]) => phone(t,b,m,p,"Gebrauchte Smartphones",{badge:"Geprüft",colorA:"#dbeafe",colorB:"#1e3a8a",specs:["Geprüft", "Gereinigt", "12 Monate Gewährleistung"]}));

const caseModels = [
  "iPhone 16 Pro Max", "iPhone 16 Pro", "iPhone 16", "iPhone 15 Pro", "iPhone 15", "iPhone 14", "iPhone 13", "iPhone 12",
  "Samsung Galaxy S25 Ultra", "Samsung Galaxy S25", "Samsung Galaxy S24", "Samsung Galaxy A56", "Samsung Galaxy A36", "Samsung Galaxy A17",
  "Xiaomi Redmi Note 14", "Xiaomi Redmi Note 13", "Google Pixel 9", "Motorola G85", "Oppo Reno12"
];

caseModels.forEach((m, i) => {
  accessory(`Premium Schutzhülle ${m}`, "Suntel Zubehör", 12.90 + (i % 4), "Handyhüllen", {
    model: m,
    imageType: "case",
    badge: "Hülle",
    specs: ["Stoßfest", "Passgenau", "Mehrere Farben"]
  });
  if (i < 12) {
    accessory(`Book Case Tasche ${m}`, "Suntel Zubehör", 14.90 + (i % 3), "Handyhüllen", {
      model: m,
      imageType: "case",
      badge: "Book Case",
      specs: ["Magnetverschluss", "Kartenfach", "Klapphülle"]
    });
  }
});

[
  "iPhone 16 Pro Max", "iPhone 16 Pro", "iPhone 16", "iPhone 15 Pro", "iPhone 15", "iPhone 14", "iPhone 13", "iPhone 12",
  "Samsung Galaxy S25 Ultra", "Samsung Galaxy S25", "Samsung Galaxy S24", "Samsung Galaxy A56", "Samsung Galaxy A36", "Samsung Galaxy A17",
  "Xiaomi Redmi Note 14", "Google Pixel 9", "Motorola G85", "Oppo Reno12"
].forEach((m, i) => {
  accessory(`Panzerglas Schutzfolie ${m}`, "Suntel Zubehör", 7.90 + (i % 3), "Panzerglas & Folien", {
    model: m,
    imageType: "glass",
    badge: "Schutz",
    specs: ["9H Härte", "Kratzfest", "Montage möglich"]
  });
  if (i < 10) {
    accessory(`Kamera Schutzglas ${m}`, "Suntel Zubehör", 5.90 + (i % 2), "Panzerglas & Folien", {
      model: m,
      imageType: "glass",
      badge: "Kamera Schutz",
      specs: ["Kamera Schutz", "Klar", "Einfach montiert"]
    });
  }
});

[
  ["20W USB-C Schnellladegerät", "Ladegeräte", 14.90, "charger"],
  ["25W Samsung Schnellladegerät", "Ladegeräte", 19.90, "charger"],
  ["30W USB-C PD Ladegerät", "Ladegeräte", 24.90, "charger"],
  ["45W USB-C Power Adapter", "Ladegeräte", 34.90, "charger"],
  ["USB-C auf USB-C Kabel 1m", "Kabel", 7.90, "cable"],
  ["USB-C auf USB-C Kabel 2m", "Kabel", 9.90, "cable"],
  ["Lightning Kabel 1m", "Kabel", 9.90, "cable"],
  ["Lightning Kabel 2m", "Kabel", 12.90, "cable"],
  ["USB-C auf Lightning Kabel", "Kabel", 14.90, "cable"],
  ["3in1 Multi-Ladekabel", "Kabel", 11.90, "cable"],
  ["KFZ Schnellladegerät USB-C", "Auto Zubehör", 16.90, "charger"],
  ["MagSafe kompatibles Ladepad", "Ladegeräte", 24.90, "charger"],
  ["Powerbank 10.000 mAh", "Powerbanks", 19.90, "powerbank"],
  ["Powerbank 20.000 mAh", "Powerbanks", 34.90, "powerbank"],
  ["Mini Powerbank USB-C", "Powerbanks", 17.90, "powerbank"],
  ["Bluetooth Earbuds Basic", "Kopfhörer & Audio", 19.90, "audio"],
  ["Wireless Earbuds Pro", "Kopfhörer & Audio", 39.90, "audio"],
  ["USB-C Kopfhörer", "Kopfhörer & Audio", 12.90, "audio"],
  ["Lightning Kopfhörer", "Kopfhörer & Audio", 14.90, "audio"],
  ["Bluetooth Lautsprecher Mini", "Kopfhörer & Audio", 24.90, "audio"],
  ["Handyhalterung Auto", "Auto Zubehör", 12.90, "holder"],
  ["Magnet Handyhalterung", "Auto Zubehör", 9.90, "holder"],
  ["USB-C Adapter auf Klinke", "Adapter", 8.90, "adapter"],
  ["USB-C OTG Adapter", "Adapter", 7.90, "adapter"],
  ["Nano SIM Adapter Set", "Adapter", 4.90, "adapter"]
].forEach(([t,sub,p,type]) => accessory(t, "Suntel Zubehör", p, sub, { imageType:type, badge:sub }));

[
  ["Ayyıldız Prepaid SIM", "Ayyıldız", 9.99, "#dc2626", "#991b1b"],
  ["Ayyıldız Türkei Paket Beratung", "Ayyıldız", 0, "#dc2626", "#991b1b"],
  ["Ayyıldız Aufladung", "Ayyıldız", 0, "#dc2626", "#991b1b"],
  ["Lyca Mobile Prepaid SIM", "Lyca Mobile", 9.99, "#172554", "#2563eb"],
  ["Lyca Mobile EU Paket Beratung", "Lyca Mobile", 0, "#172554", "#2563eb"],
  ["Lyca Mobile Aufladung", "Lyca Mobile", 0, "#172554", "#2563eb"],
  ["Ortel Mobile Prepaid SIM", "Ortel Mobile", 9.99, "#f8fafc", "#dc2626"],
  ["Ortel Mobile International Paket", "Ortel Mobile", 0, "#f8fafc", "#dc2626"],
  ["Ortel Mobile Aufladung", "Ortel Mobile", 0, "#f8fafc", "#dc2626"],
  ["Prepaid SIM Aktivierung im Shop", "Suntel", 0, "#ff7a00", "#0f172a"],
  ["Tarifberatung International", "Suntel", 0, "#ff7a00", "#0f172a"],
  ["Guthaben Aufladung Service", "Suntel", 0, "#ff7a00", "#0f172a"]
].forEach(([t,b,p,a,c]) => sim(t,b,p,{colorA:a,colorB:c}));

[
  ["Biometrische Passfotos", 12.00, "Passfotos", ["Direkt zum Mitnehmen", "Biometrisch", "Vor Ort"]],
  ["Bewerbungsfotos", 15.00, "Passfotos", ["Schnell", "Professionell", "Digital möglich"]],
  ["Fotokopie Schwarz/Weiß", 0.20, "Kopierservice", ["A4", "Schnell", "Günstig"]],
  ["Fotokopie Farbe", 0.50, "Kopierservice", ["A4", "Farbe", "Sofort"]],
  ["Dokument Scan Service", 1.00, "Kopierservice", ["PDF", "E-Mail möglich", "Vor Ort"]],
  ["Datenübertragung neues Handy", 25.00, "Handyservice", ["Kontakte", "Fotos", "Einrichtung"]],
  ["Handy Einrichtung", 19.00, "Handyservice", ["Google/Apple Konto", "Apps", "Beratung"]],
  ["Software Diagnose", 15.00, "Handyservice", ["Fehlerprüfung", "Updates", "Beratung"]]
].forEach(([t,p,sub,specs]) => service(t,p,sub,{specs}));

if (force || !fs.existsSync(productsFile)) {
  fs.writeFileSync(productsFile, JSON.stringify(products, null, 2));
}

for (const file of ["orders.json", "repairs.json"]) {
  const fp = path.join(dataDir, file);
  if (!fs.existsSync(fp)) fs.writeFileSync(fp, "[]");
}

console.log(`Seed fertig: ${products.length} Produkte`);
