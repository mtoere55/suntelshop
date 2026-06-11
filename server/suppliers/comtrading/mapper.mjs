function pickNumber(...values) {
  for (const value of values) {
    if (value === undefined || value === null || value === '') continue;
    const n = Number(value);
    if (Number.isFinite(n)) return n;
  }
  return null;
}

function pickText(...values) {
  for (const value of values) {
    if (value === undefined || value === null) continue;
    const s = String(value).trim();
    if (s) return s;
  }
  return '';
}

function roundPrice(value) {
  if (!Number.isFinite(value)) return null;
  return Math.ceil(value * 100) / 100;
}

function getSuggestedMarginMultiplier(product = {}) {
  const haystack = `${product.category || ''} ${product.name || ''}`.toLowerCase();

  if (
    haystack.includes('pokrowce') ||
    haystack.includes('case') ||
    haystack.includes('etui') ||
    haystack.includes('szklo') ||
    haystack.includes('szkło') ||
    haystack.includes('folie')
  ) {
    return 1.7;
  }

  if (
    haystack.includes('kabel') ||
    haystack.includes('cable') ||
    haystack.includes('adapter') ||
    haystack.includes('ladowarki') ||
    haystack.includes('ładowarki') ||
    haystack.includes('charger')
  ) {
    return 1.5;
  }

  if (
    haystack.includes('power bank') ||
    haystack.includes('powerbank') ||
    haystack.includes('sluchawki') ||
    haystack.includes('słuchawki') ||
    haystack.includes('glosniki') ||
    haystack.includes('głośniki')
  ) {
    return 1.35;
  }

  return 1.3;
}

export function mapComTradingProductToCandidate(product = {}) {
  const supplierProductId = product.id || product.product_id || product.symbol || product.code || null;

  const supplierNetPrice = pickNumber(product.price_net, product.net_price);
  const supplierGrossPrice = pickNumber(product.price_gross, product.gross_price, product.price);
  const supplierPrice = supplierGrossPrice ?? supplierNetPrice;

  const stock = pickNumber(product.store, product.stock, product.quantity);
  const supplierStatus = pickText(product.status, product.status_name, product.availability);

  const statusText = supplierStatus.toLowerCase();
  const available =
    !statusText.includes('niedost') &&
    (statusText.includes('dost') || stock === null || stock > 0);

  const suggestedMarginMultiplier = getSuggestedMarginMultiplier(product);
  const suggestedPublicPrice =
    supplierPrice === null ? null : roundPrice(supplierPrice * suggestedMarginMultiplier);

  return {
    id: supplierProductId ? 'comtrading-' + supplierProductId : 'comtrading-' + Date.now(),
    supplier: 'COM-TRADING',
    supplierProductId,
    status: 'supplier_candidate',
    published: false,
    approved: false,

    title: pickText(product.name, product.title),
    brand: pickText(product.producer, product.manufacturer, product.brand),
    ean: pickText(product.ean, product.EAN),
    supplierCode: pickText(product.symbol, product.code, product.producer_code),

    sourceCategory: pickText(product.category, product.category_name),
    sourceCategoryId: product.category_id || null,
    category: '',
    subcategory: '',

    supplierNetPrice,
    supplierGrossPrice,
    supplierPrice,
    publicPrice: null,
    suggestedPublicPrice,
    suggestedMarginMultiplier,
    currency: pickText(product.currency) || 'EUR',
    vat: pickText(product.vat, product.tax),
    vatValue: pickNumber(product.vat_value),

    stock,
    supplierStatus,
    available,
    deliveryDays: pickNumber(product.shipment_days, product.delivery_days),
    shipment: pickText(product.shipment),

    imageUrl: Array.isArray(product.gallery) ? product.gallery[0] : pickText(product.image, product.image_url),
    gallery: Array.isArray(product.gallery) ? product.gallery : [],

    description: pickText(product.desc_long, product.description, product.desc_short),
    shortDescription: pickText(product.desc_short),

    raw: product,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}

export function mapComTradingProducts(products = []) {
  return products.map(mapComTradingProductToCandidate);
}
