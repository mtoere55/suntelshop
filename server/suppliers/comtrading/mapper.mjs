export function mapComTradingProductToCandidate(product = {}) {
  const supplierProductId = product.id || product.product_id || product.symbol || product.code || null;

  return {
    id: supplierProductId ? `comtrading-${supplierProductId}` : `comtrading-${Date.now()}`,
    supplier: 'COM-TRADING',
    supplierProductId,
    status: 'supplier_candidate',
    published: false,
    approved