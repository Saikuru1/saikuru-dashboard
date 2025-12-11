const USER = 'Saikuru1';          // your GitHub username
const REPO = 'saikuru-dashboard'; // public repo (UI)
const BRANCH = 'main';

const BASE = `https://raw.githubusercontent.com/${USER}/${REPO}/${BRANCH}/data`;

export const OPEN_POSITIONS_URL = `${BASE}/open_positions.json`;
export const TRADES_URL = `${BASE}/trades.log`;

export async function fetchOpenPositions() {
  const res = await fetch(OPEN_POSITIONS_URL, { cache: 'no-store' });
  return res.json();
}

export async function fetchTrades() {
  const text = await fetch(TRADES_URL, { cache: 'no-store' }).then(r=>r.text());
  return text.split("\n").filter(Boolean).map((l,i)=>({id:i,raw:l}));
}