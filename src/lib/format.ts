export function formatMoney(value: number): string {
  return `${Math.max(0, Math.floor(value)).toLocaleString("en-US")} euro`;
}

export function formatEuro(value: number): string {
  return `€${Math.max(0, value).toFixed(2)}`;
}

export function formatWholeEuro(value: number): string {
  return `€${Math.max(0, Math.floor(value)).toLocaleString("en-US")}`;
}

export function formatMultiplier(value: number): string {
  return `x${value.toFixed(2)}`;
}

export function formatProgressNumber(value: number): string {
  return Number.isInteger(value) ? String(value) : value.toFixed(2);
}

export function formatAbilityTime(ms: number): string {
  const totalSeconds = Math.max(0, Math.ceil(ms / 1000));
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return minutes > 0 ? `${minutes}:${String(seconds).padStart(2, "0")}` : `${seconds}s`;
}
