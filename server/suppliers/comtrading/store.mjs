import fs from 'fs';
import path from 'path';

const DATA_DIR = path.resolve('data');
const PRODUCTS_FILE = path.join(DATA_DIR, 'supplier-comtrading-products.json');
const CATEGORIES_FILE = path.join(DATA_DIR, 'supplier-comtrading-categories.json');
const SYNC_LOG_FILE = path.join(DATA_DIR, 'supplier-comtrading-sync-log.json');
const LINKS_FILE = path.join(DATA_DIR, 'supplier-product-links.json');

function ensureDataDir() {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

function readJson(file, fallback) {
  try {
    ensureDataDir();
    if (!fs.existsSync(file)) return fallback;
    return JSON.parse(fs.readFileSync(file, 'utf8'));
  } catch {
    return fallback;
  }
}

function writeJson(file, data) {
  ensureDataDir();
  fs.writeFileSync(file, JSON.stringify(data, null, 2), 'utf8');
}

export function getSupplierCandidates() {
  return readJson(PRODUCTS_FILE, []);
}

export function saveSupplierCandidates(products) {
  writeJson(PRODUCTS_FILE, products);
  return products;
}

export function getSupplierCategories() {
  return readJson(CATEGORIES_FILE, []);
}

export function saveSupplierCategories(categories) {
  writeJson(CATEGORIES_FILE, categories);
  return categories;
}

export function appendSupplierSyncLog(entry) {
  const log = readJson(SYNC_LOG_FILE, []);
  log.unshift({
    ...entry,
    at: new Date().toISOString(),
  });
  writeJson(SYNC_LOG_FILE, log.slice(0, 200));
  return log[0];
}

export function getSupplierProductLinks() {
  return readJson(LINKS_FILE, []);
}
