'use client';

import { useEffect, useRef } from 'react';

export default function SaikuruCat({ lastUpdated }) {
  const ref = useRef(null);

  useEffect(() => {
    if (!lastUpdated) return;

    const updatedAt = new Date(lastUpdated).getTime();
    const now = Date.now();

    // "Fresh" = updated in last 2 minutes
    if (now - updatedAt < 2 * 60 * 1000) {
      ref.current?.classList.add('system-check');

      const t = setTimeout(() => {
        ref.current?.classList.remove('system-check');
      }, 1400);

      return () => clearTimeout(t);
    }
  }, [lastUpdated]);

  return <div ref={ref} className="saikuru-cat" />;
}