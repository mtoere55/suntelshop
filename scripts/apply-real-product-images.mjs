import fs from "fs";
import path from "path";

const file = path.join(process.cwd(), "data", "products.json");
const products = JSON.parse(fs.readFileSync(file, "utf8"));

function cleanQuery(q) {
  return q
    .toLowerCase()
    .replace(/ä/g, "ae")
    .replace(/ö/g, "oe")
    .replace(/ü/g, "ue")
    .replace(/ß/g, "ss")
    .replace(/[^a-z0-9,]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

function queryFor(p) {
  const title = `${p.title || ""} ${p.brand || ""} ${p.model || ""}`.toLowerCase();
  const cat = `${p.category || ""}`.toLowerCase();
  const sub = `${p.subcategory || ""}`.toLowerCase();

  if (cat.includes("smartphone")) {
    if (title.includes("iphone") || title.includes("apple")) return "iphone,smartphone,product";
    if (title.includes("samsung") || title.includes("galaxy")) return "samsung,galaxy,smartphone";
    if (title.includes("xiaomi") || title.includes("redmi") || title.includes("poco")) return "xiaomi,smartphone,android";
    if (title.includes("pixel") || title.includes("google")) return "google,pixel,smartphone";
    if (title.includes("motorola") || title.includes("moto")) return "motorola,smartphone";
    if (title.includes("oppo")) return "oppo,smartphone";
    if (title.includes("huawei")) return "huawei,smartphone";
    if (title.includes("honor")) return "honor,smartphone";
    if (title.includes("nokia")) return "nokia,smartphone";
    if (title.includes("sony") || title.includes("xperia")) return "sony,xperia,smartphone";
    if (title.includes("oneplus")) return "oneplus,smartphone";
    return "smartphone,mobile,phone";
  }

  if (sub.includes("handyhüllen") || title.includes("schutzhülle")) {
    if (title.includes("book") || title.includes("tasche")) return "wallet,phone,case";
    if (title.includes("magsafe")) return "magsafe,phone,case";
    return "phone,case,smartphone";
  }

  if (sub.includes("panzerglas") || title.includes("panzerglas") || title.includes("schutzfolie")) {
    return "screen,protector,smartphone";
  }

  if (title.includes("kamera schutz") || title.includes("schutzglas")) {
    return "camera,lens,protector,phone";
  }

  if (sub.includes("ladegeräte") || title.includes("ladegerät") || title.includes("charger") || title.includes("adapter")) {
    return "usb,charger,adapter";
  }

  if (sub.includes("kabel") || title.includes("kabel") || title.includes("lightning") || title.includes("usb-c")) {
    return "usb,cable,charger";
  }

  if (sub.includes("powerbank") || title.includes("powerbank")) {
    return "powerbank,portable,charger";
  }

  if (sub.includes("kopfhörer") || title.includes("earbuds") || title.includes("kopfhörer") || title.includes("bluetooth")) {
    return "earbuds,headphones,wireless";
  }

  if (sub.includes("auto") || title.includes("kfz") || title.includes("halterung")) {
    return "car,phone,holder";
  }

  if (cat.includes("sim") || title.includes("sim") || title.includes("lyca") || title.includes("ortel") || title.includes("ayy")) {
    return "sim,card,smartphone";
  }

  if (cat.includes("service") || title.includes("reparatur") || title.includes("diagnose") || title.includes("daten")) {
    return "phone,repair,technician";
  }

  if (title.includes("passfoto") || title.includes("foto") || title.includes("kopie") || title.includes("scan")) {
    return "passport,photo,printer";
  }

  return "mobile,phone,accessory";
}

for (const p of products) {
  const q = cleanQuery(queryFor(p));
  const lock = 10000 + Number(p.id || 0);

  p.imageUrl = `https://loremflickr.com/520/420/${q}?lock=${lock}`;
  p.imageAlt = `${p.title || "Suntel Produkt"} bei Suntel in Hagen`;

  if (!p.gallery || !Array.isArray(p.gallery)) {
    p.gallery = [];
  }

  p.gallery = [
    p.imageUrl,
    `https://loremflickr.com/900/700/${q}?lock=${lock + 5000}`,
    `https://loremflickr.com/900/700/${q}?lock=${lock + 9000}`
  ];
}

fs.writeFileSync(file, JSON.stringify(products, null, 2));
console.log("Updated products with real image URLs:", products.length);
