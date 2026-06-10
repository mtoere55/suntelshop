function pickNumber(...values) {
  for (const value of values) {
    if (value === undefined || value === null || value === '') continue;
    const numberValue = Number(value);
    if (Number.isFinite(numberValue)) return numberValue;
  }
  return null;
}

function pickText(...values) {
  for (const value of values) {
    if (value === undefined || value === null) continue;
    const textValue = String(value).trim