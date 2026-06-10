export function getComTradingSafety() {
  return {
    supplier: 'COM-TRADING',
    enabled: process.env.COM_TRADING_ENABLED === 'true',
    apiKeyConfigured: Boolean(process.env.COM_TRADING_API_KEY),
    readOnly: process.env.COM_TRADING_READ_ONLY !== 'false',
    orderWrite: process.env.COM_TRADING_ORDER_WRITE === 'true',
    autoPublish: process.env.SUPPLIER_AUTO_PUBLISH === 'true',
    cidenBridgeWrite: process.env.CIDENBRIDGE_WRITE === 'true',
    liveShopPublishAllowed: false,
    supplierOrderWriteAllowed: false,
    cidenBridgeWriteAllowed: false,
  };
}

export function assertReadOnlySafe() {
  const safety = getComTradingSafety();

  if (!safety.readOnly) {
    throw new Error('COM-TRADING bridge must stay read-only in SNT-COM-0.');
  }

  if (safety.orderWrite || safety.autoPublish || safety.cidenBridgeWrite) {
    throw new Error('Unsafe supplier bridge flags detected.');
  }

  return safety;
}
