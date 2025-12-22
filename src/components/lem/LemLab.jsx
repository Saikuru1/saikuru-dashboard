'use client';

import { useEffect, useMemo, useState } from 'react';
import styles from './LemLab.module.css';
import { fetchLemObservations } from '@lib/fetchLem';
import { toNum } from '@lib/csv';
import SimpleLineChart from './SimpleLineChart';

const TF = ['1D', '7D', '30D', 'ALL'];

export default function LemLab() {
  const [rows, setRows] = useState([]);
  const [err, setErr] = useState('');
  const [loading, setLoading] = useState(true);

  const [chain, setChain] = useState('BNB');
  const [pair, setPair] = useState('');
  const [tf, setTf] = useState('7D');

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      setErr('');
      try {
        const data = await fetchLemObservations();
        if (cancelled) return;
        setRows(Array.isArray(data) ? data : []);
      } catch (e) {
        if (!cancelled) setErr(e?.message || 'Failed to load LEM CSV');
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => { cancelled = true; };
  }, []);

  const chains = useMemo(() => {
    const s = new Set(rows.map(r => (r.chain || '').trim()).filter(Boolean));
    return Array.from(s);
  }, [rows]);

  const assets = useMemo(() => {
    const filtered = rows.filter(r => (r.chain || '').trim() === chain);
    const m = new Map(); // pair_address -> meta
    for (const r of filtered) {
      const addr = (r.pair_address || '').trim();
      if (!addr) continue;
      if (!m.has(addr)) {
        m.set(addr, {
          pair_address: addr,
          token_symbol: (r.token_symbol || '').trim(),
          token_name: (r.token_name || '').trim(),
        });
      }
    }
    return Array.from(m.values());
  }, [rows, chain]);

  // auto-pick first asset
  useEffect(() => {
    if (!pair && assets.length) setPair(assets[0].pair_address);
  }, [assets, pair]);

  const series = useMemo(() => {
    const filtered = rows
      .filter(r => (r.chain || '').trim() === chain)
      .filter(r => (r.pair_address || '').trim() === pair)
      .map(r => {
        const ts = Date.parse(r.timestamp_utc);
        return {
          ts,
          price: toNum(r.token_price_usd),
          lem: toNum(r.lem),
          mc: toNum(r.market_cap_usd),
          lpn: toNum(r.lp_native_usd),
        };
      })
      .filter(d => Number.isFinite(d.ts))
      .sort((a, b) => a.ts - b.ts);

    if (tf === 'ALL') return filtered;

    const days = tf === '1D' ? 1 : tf === '7D' ? 7 : 30;
    const cutoff = Date.now() - days * 86400000;
    return filtered.filter(d => d.ts >= cutoff);
  }, [rows, chain, pair, tf]);

  const chartPriceLem = useMemo(() => {
    return series.map(d => ({ x: d.ts, a: d.price, b: d.lem }));
  }, [series]);

  const chartMcLpn = useMemo(() => {
    return series.map(d => ({ x: d.ts, a: d.mc, b: d.lpn }));
  }, [series]);

  const pickedMeta = useMemo(() => {
    const found = assets.find(a => a.pair_address === pair);
    return found || { pair_address: pair, token_symbol: '', token_name: '' };
  }, [assets, pair]);

  return (
    <div className={styles.wrap}>
      <div className={styles.top}>
        <div>
          <h1 className={styles.h1}>LEM Research Lab 🧪</h1>
          <p className={styles.p}>
            Read-only visualization of liquidity structure. CSV is canonical; UI is convenience.
          </p>
        </div>
      </div>

      <div className={styles.controls}>
        <label className={styles.label}>
          Chain
          <select className={styles.select} value={chain} onChange={(e) => setChain(e.target.value)}>
            {(chains.length ? chains : ['BNB']).map(c => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </label>

        <label className={styles.label}>
          Asset (Pair)
          <select className={styles.select} value={pair} onChange={(e) => setPair(e.target.value)}>
            {assets.map(a => {
              const title = a.token_symbol || a.token_name
                ? `${a.token_symbol || '—'} ${a.token_name ? `• ${a.token_name}` : ''}`
                : a.pair_address.slice(0, 10) + '…';
              return (
                <option key={a.pair_address} value={a.pair_address}>
                  {title}
                </option>
              );
            })}
          </select>
        </label>

        <div className={styles.tf}>
          {TF.map(k => (
            <button
              key={k}
              className={`${styles.tfBtn} ${tf === k ? styles.tfActive : ''}`}
              onClick={() => setTf(k)}
              type="button"
            >
              {k}
            </button>
          ))}
        </div>
      </div>

      <div className={styles.meta}>
        <div><span className={styles.metaKey}>Token</span> {pickedMeta.token_symbol || '—'} {pickedMeta.token_name ? `• ${pickedMeta.token_name}` : ''}</div>
        <div><span className={styles.metaKey}>Pair</span> {pickedMeta.pair_address || '—'}</div>
        <div><span className={styles.metaKey}>Rows</span> {series.length}</div>
      </div>

      {loading && <div className={styles.notice}>Loading canonical CSV…</div>}
      {err && <div className={styles.notice}>{err}</div>}

      {!loading && !err && (
        <div className={styles.grid}>
          <SimpleLineChart
            title="Price vs LEM"
            subtitle="Dual lines (scaled independently)"
            data={chartPriceLem}
            aLabel="Price"
            bLabel="LEM"
          />

          <SimpleLineChart
            title="Market Cap vs LPₙ"
            subtitle="Dual lines (scaled independently)"
            data={chartMcLpn}
            aLabel="Market Cap"
            bLabel="LPₙ"
          />
        </div>
      )}
    </div>
  );
}