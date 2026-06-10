import { assertReadOnlySafe } from './safety.mjs';

const DEFAULT_BASE_URL = 'https://com-trading.pl/api/v1';

export function getComTradingConfig() {
  return {
    baseUrl: process.env.COM_TRADING_BASE_URL || DEFAULT_BASE_URL,
    apiKey: process.env.COM_TRADING_API_KEY || '',
  };
}

export async function comTradingRequest(path, params = {}) {
  const safety = assertReadOnlySafe();
  const { baseUrl, apiKey } = getComTradingConfig();

  if (!safety.enabled) {
    return {
      ok: false,
      disabled: true,
      message: 'COM-TRADING bridge is disabled. Set COM_TRADING_ENABLED=true on the server only after safety review.',
    };
  }

  if (!apiKey) {
    return {
      ok: false,
      missingApiKey: true,
      message: 'COM_TRADING_API_KEY is not configured on the server.',
    };
  }

  const url = new URL(`${baseUrl.replace(/\/$/, '')}/${String(path).replace(/^\//, '')}`);

  for (const [key, value] of Object.entries(params || {})) {
    if (value !== undefined && value !== null && value !== '') {
      url.searchParams.set(key, String(value));
    }
  }

  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'X-API-KEY': apiKey,
      Accept: 'application/json',
    },
  });

  const text = await response.text();

  let data;
  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    data = { raw: text };
  }

  return {
    ok: response.ok,
    status: response.status,
    data,
  };
}
