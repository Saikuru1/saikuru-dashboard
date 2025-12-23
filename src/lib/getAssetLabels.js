// lib/getAssetLabels.js
import { CHAIN_TO_GECKO } from './chainMap';

export async function getAssetLabels(chainFromLog, poolAddress) {
  if (!chainFromLog || !poolAddress) {
    return { name: poolAddress, symbol: '—', chain: chainFromLog };
  }

  const networkSlug = CHAIN_TO_GECKO[chainFromLog.toUpperCase()];

  if (!networkSlug) {
    console.warn(`Unsupported chain: ${chainFromLog}`);
    return { name: poolAddress, symbol: 'Unknown', chain: chainFromLog };
  }

  const cacheKey = `lem_meta_${networkSlug}_${poolAddress}`;
  const cached = localStorage.getItem(cacheKey);
  if (cached) return JSON.parse(cached);

  try {
    const url =
      `https://api.geckoterminal.com/api/v2/networks/${networkSlug}/pools/${poolAddress}?include=base_token`;

    const res = await fetch(url);
    if (!res.ok) throw new Error('GeckoTerminal fetch failed');

    const json = await res.json();

    const baseToken = json?.included?.find(
      i => i.type === 'token'
    )?.attributes;

    if (!baseToken) throw new Error('No base token found');

    // Clean symbol: remove pair junk (e.g. "PEPE / WBNB")
    const cleanSymbol = baseToken.symbol?.split('/')[0]?.trim();
    const cleanName = baseToken.name?.split('/')[0]?.trim();

    const metadata = {
      name: cleanName || poolAddress,
      symbol: cleanSymbol || '—',
      chain: chainFromLog,
    };

    localStorage.setItem(cacheKey, JSON.stringify(metadata));
    return metadata;
  } catch (err) {
    console.error('Metadata fetch failed:', err);
    return {
      name: poolAddress,
      symbol: 'Error',
      chain: chainFromLog,
    };
  }
}
