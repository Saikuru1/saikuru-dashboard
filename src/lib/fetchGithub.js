const USER = 'Saikuru1';
const REPO = 'saikuru-dashboard';
const BRANCH = 'main';

const BASE = `https://raw.githubusercontent.com/${USER}/${REPO}/${BRANCH}/data`;

export const OPEN_POSITIONS_URL = `${BASE}/open_positions.json`;
export const TRADES_URL = `${BASE}/trades.log`;

/**
 * Open positions
 * Converts object → array for UI consumption
 */
export async function fetchOpenPositions() {
  const res = await fetch(OPEN_POSITIONS_URL, { cache: 'no-store' });

  if (!res.ok) return [];

  const data = await res.json();

  // NEW: normalize object → array
  if (data && typeof data === 'object' && !Array.isArray(data)) {
    return Object.values(data);
  }

  return Array.isArray(data) ? data : [];
}

/**
 * Trades ledger
 * Handles both structured JSON lines or raw text safely
 */
export async function fetchTrades() {
  const res = await fetch(TRADES_URL, { cache: 'no-store' });

  if (!res.ok) return [];

  const text = await res.text();

  return text
    .split('\n')
    .filter(Boolean)
    .map((line, i) => {
      try {
        return JSON.parse(line);
      } catch {
        return { id: i, raw: line };
      }
    });
}