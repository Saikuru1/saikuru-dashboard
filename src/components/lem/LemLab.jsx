'use client';

import { useEffect, useMemo, useState } from 'react';
import styles from './LemLab.module.css';
import { fetchLemObservations } from '@lib/fetchLem';
import { toNum } from '@lib/csv';
import SimpleLineChart from './SimpleLineChart';
import MarketCapLPChart from './MarketCapLPChart'; // ✅ NEW
import { getAssetLabels } from '@lib/getAssetLabels';

const TF = ['1D', '7D', '30D', 'ALL'];

export default function LemLab() {
  const [rows, setRows] = useState([]);
  const [err, setErr] = useState('');
  const [loading, setLoading] = useState(true);

  const [chain, setChain] = useState('bsc');
  const [pair, setPair] = useState('');
  const [tf, setTf] = useState('7D');

  const [assetMeta, setAssetMeta] = useState({});

  /* ──────────────────────────────────────────────
     Load canonical CSV
  ────────────────────────────────────────────── */
  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      setErr('');
      try {
        const data = await fetchLemObservations();
        if (!cancelled) setRows(Array.isArray(data) ? data : []);
      } catch (e) {
        if (!cancelled) setErr(e?.message || 'Failed to load LEM CSV');
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => { cancelled = true; };
  }, []);

  /* ──────────────────────────────────────────────
     Chains
  ────────────────────────────────────────────── */
  const chains = useMemo(() => {
    return Array.from(
      new Set(rows.map(r => (r.chain || '').trim()).filter(Boolean))
    );
  }, [rows]);

  /* ──────────────────────────────────────────────
     Assets per chain
  ────────────────────────────────────────────── */
  const assets = useMemo(() => {
    const m = new Map();

    rows
      .filter(r => (r.chain || '').trim() === chain)
      .forEach(r => {
        const addr = (r.pair_address || '').trim();
        if (addr && !m.has(addr)) {
          m.set(addr, { pair_address: addr });
        }
      });

    return Array.from(m.values());
  }, [rows, chain]);

  /* ──────────────────────────────────────────────
     Default selection
  ────────────────────────────────────────────── */
  useEffect(() => {
    if (!pair && assets.length) {
      setPair(assets[0].pair_address);
    }
  }, [assets, pair]);

  /* ──────────────────────────────────────────────
     Enrich asset labels (UI-only)
  ────────────────────────────────────────────── */
  useEffect(() => {
    let cancelled = false;

    async function enrich() {
      const entries = await Promise.all(
        assets.map(async a => {
          try {
            const meta = await getAssetLabels(chain, a.pair_address);
            return [a.pair_address, meta];
          } catch {
            return [
              a.pair_address,
              { name: a.pair_address, symbol: '—', chain }
            ];
          }
        })
      );

      if (!cancelled) {
        setAssetMeta(Object.fromEntries(entries));
      }
    }

    if (assets.length) enrich();
    return () => { cancelled = true; };
  }, [assets, chain]);

  /* ──────────────────────────────────────────────
     Time series
  ────────────────────────────────────────────── */
  const series = useMemo(() => {
    const base = rows
      .filter(r => (r.chain || '').trim() === chain)
      .filter(r => (r.pair_address || '').trim() === pair)
      .map(r => ({
        ts: Date.parse(r.timestamp_utc),
        price: toNum(r.token_price_usd),
        lem: toNum(r.lem),
        mc: toNum(r.market_cap_usd),
        lpn: toNum(r.lp_native_usd),
      }))
      .filter(d => Number.isFinite(d.ts))
      .sort((a, b) => a.ts - b.ts);

    if (tf === 'ALL') return base;

    const days = tf === '1D' ? 1 : tf === '7D' ? 7 : 30;
    const cutoff = Date.now() - days * 86400000;
    return base.filter(d => d.ts >= cutoff);
  }, [rows, chain, pair, tf]);

  /* ──────────────────────────────────────────────
     Chart data
  ────────────────────────────────────────────── */
  const chartPriceLem = useMemo(
    () => series.map(d => ({ x: d.ts, a: d.price, b: d.lem })),
    [series]
  );

  // 🔑 MC / LPₙ chart now includes LEM for bands
  const chartMcLpn = useMemo(
    () =>
      series.map(d => ({
        x: d.ts,
        a: d.mc,     // Market Cap
        b: d.lpn,    // LPₙ
        lem: d.lem,  // 🔑 REQUIRED
      })),
    [series]
  );

  const pickedMeta = assetMeta[pair] || {};

  /* ──────────────────────────────────────────────
     Render
  ────────────────────────────────────────────── */
  return (
    <div className={styles.wrap}>
      <div className={styles.controls}>
        <label className={styles.label}>
          Chain
          <select
            className={styles.select}
            value={chain}
            onChange={e => setChain(e.target.value)}
          >
            {(chains.length ? chains : ['bsc']).map(c => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </label>

        <label className={styles.label}>
          Asset (Pair)
          <select
            className={styles.select}
            value={pair}
            onChange={e => setPair(e.target.value)}
          >
            {assets.map(a => {
              const meta = assetMeta[a.pair_address];
              const label = meta
                ? `${meta.symbol} • ${meta.name} (${meta.chain})`
                : a.pair_address.slice(0, 10) + '…';

              return (
                <option key={a.pair_address} value={a.pair_address}>
                  {label}
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
        <div>
          <span className={styles.metaKey}>Token</span>
          {pickedMeta.symbol || '—'}
          {pickedMeta.name ? `• ${pickedMeta.name}` : ''}
        </div>
        <div>
          <span className={styles.metaKey}>Pair</span>
          {pair || '—'}
        </div>
        <div>
          <span className={styles.metaKey}>Rows</span>
          {series.length}
        </div>
      </div>

      {loading && <div className={styles.notice}>Loading canonical CSV…</div>}
      {err && <div className={styles.notice}>{err}</div>}

      {!loading && !err && (
        <div className={styles.grid}>
          {/* 🔬 Behavior vs Stress — unchanged */}
          <SimpleLineChart
            title="Price vs LEM"
            subtitle="Dual lines (scaled independently)"
            data={chartPriceLem}
            aLabel="Price"
            bLabel="LEM"
          />

          {/* 🧪 Structural Load — dedicated chart */}
          <MarketCapLPChart
            title="Market Cap vs LPₙ"
            subtitle="Illusion vs load-bearing capacity"
            data={chartMcLpn}
          />
        </div>
      )}
    </div>
  );
}