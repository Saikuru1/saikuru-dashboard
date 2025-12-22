import { parseCsv } from './csv';

const LEM_CSV_URL =
  'https://raw.githubusercontent.com/Saikuru1/saikuru-meme-labs/main/data/lem_observations.csv';

export async function fetchLemObservations() {
  const res = await fetch(LEM_CSV_URL, { cache: 'no-store' });
  if (!res.ok) {
    // ✅ FIX: proper template literal
    throw new Error(`LEM CSV fetch failed: ${res.status}`);
  }
  const text = await res.text();
  return parseCsv(text);
}