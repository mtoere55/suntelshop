import { comTradingRequest } from './client.mjs';
import { mapComTradingProducts } from './mapper.mjs';
import {
  appendSupplierSyncLog,
  getSupplierCandidates,
  saveSupplierCandidates,
  saveSupplierCategories,
} from './store.mjs';

export async function importComTradingSample(limit = 10) {
  const response = await comTradingRequest('/products', { limit });

  if (!response.ok) {
    appendSupplierSyncLog({
      type: 'sample_import_failed',
      response,
    });

    return response;
  }

  const rawProducts = Array.isArray(response.data)
    ? response.data
    : response.data?.data || response.data?.products || [];

  const candidates = mapComTradingProducts(rawProducts);
  const existing = getSupplierCandidates();

  const byId = new Map(existing.map((item) => [item.id, item]));
  for (const candidate of candidates) {
    byId.set(candidate.id, {
      ...byId.get(candidate.id),
      ...candidate,
      status: byId.get(candidate.id)?.status || 'supplier_candidate',
      published: byId.get(candidate.id)?.published || false,
      approved: byId.get(candidate.id)?.approved || false,
      updatedAt: new Date().toISOString(),
    });
  }

  const saved = saveSupplierCandidates([...byId.values()]);

  appendSupplierSyncLog({
    type: 'sample_import_ok',
    imported: candidates.length,
    totalCandidates: saved.length,
  });

  return {
    ok: true,
    imported: candidates.length,
    totalCandidates: saved.length,
    candidates,
  };
}

export async function importComTradingCategories() {
  const response = await comTradingRequest('/products/categories');

  if (!response.ok) {
    appendSupplierSyncLog({
      type: 'category_import_failed',
      response,
    });

    return response;
  }

  const categories = Array.isArray(response.data)
    ? response.data
    : response.data?.data || response.data?.categories || [];

  saveSupplierCategories(categories);

  appendSupplierSyncLog({
    type: 'category_import_ok',
    totalCategories: categories.length,
  });

  return {
    ok: true,
    totalCategories: categories.length,
    categories,
  };
}
