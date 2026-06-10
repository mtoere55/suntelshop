export function mapComTradingProductToCandidate(product = {}) {
  const supplierProductId = product.id || product.product_id || product.symbol || product.code || null;

  return {
    id: supplierProductId ? `comtrading-${supplierProductId}` : `comtrading-${Date.now()}`,
    supplier: 'COM-TRADING',
    supplierProductId,
    status: 'supplier_candidate',
    published: false,
    approved: false,

    title: product.name || product.title || '',
    brand: product.producer || product.manufacturer || product.brand || '',
    ean: product.ean || product.EAN || '',
    supplierCode: product.symbol || product.code || product.producer_code || '',

    sourceCategory: product.category || product.category_name || '',
    category: '',
    subcategory: '',

    supplierPrice: product.price ?? product.net_price ?? product.gross_price ?? null,
    publicPrice: null,
    currency: product.currency || 'EUR',
    vat: product.vat || product.tax || null,

    stock: product.stock ?? product.quantity ?? null,
    deliveryDays: product.shipment_days || product.delivery_days || null,

    imageUrl: Array.isArray(product.gallery) ? product.gallery[0] : product.image || product.image_url || '',
    gallery: Array.isArray(product.gallery) ? product.gallery : [],

    description: product.desc_long || product.description || product.desc_short || '',
    shortDescription: product.desc_short || '',

    raw: product,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}

export function mapComTradingProducts(products = []) {
  return products.map(mapComTradingProductToCandidate);
}
