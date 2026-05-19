import { useState, useEffect } from "react";

function normalizeRows(history) {
  return history.map((row) => ({
    ...row,
    quantity: row.quantity ?? 0,
  }));
}

export function useUndermineData({ itemId, region = "us" }) {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!itemId) return;
    let cancelled = false;

    async function load() {
      setLoading(true);
      setError(null);

      try {
        const url = `https://api.undermine.exchange/v1/region/${region}/commodities/${itemId}/hourly.json`;

        const res = await fetch(url, {
          headers: {
            Authorization: `ApiKey ${import.meta.env.VITE_UNDERMINE_API_KEY}`,
          },
        });

        if (!res.ok) {
          throw new Error(`API error: ${res.status}`);
        }

        const data = await res.json();
        console.log("Undermine response:", data);

        // handle multiple possible response shapes
        const history =
          data?.result?.history ??
          data?.history ??
          data?.data ??
          (Array.isArray(data) ? data : []);

        if (!cancelled) {
          setRows(normalizeRows(data.result?.hourly ?? []));
        }
      } catch (err) {
        console.error(err);

        if (!cancelled) {
          setError(err.message);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    load();

    const interval = setInterval(load, 60 * 60 * 1000);
    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, [itemId, region]);

  return { rows, loading, error };
}
