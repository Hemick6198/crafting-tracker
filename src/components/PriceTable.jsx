import { useState, useMemo } from "react";

function formatGold(copper) {
  if (copper == null) return "—";

  const gold = Math.floor(copper / 10000);
  const silver = Math.floor((copper % 10000) / 100);
  const c = copper % 100;

  return [
    gold ? `${gold.toLocaleString()}g` : null,
    silver ? `${silver}s` : null,
    c ? `${c}c` : null,
  ]
    .filter(Boolean)
    .join(" ");
}

const PAGE_SIZE = 25;

export default function PriceTable({ rows }) {
  const [page, setPage] = useState(0);

  const pstTime = useMemo(
    () =>
      new Intl.DateTimeFormat("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        timeZone: "America/Los_Angeles",
      }),
    [],
  );

  const pstDate = useMemo(
    () =>
      new Intl.DateTimeFormat("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
        timeZone: "America/Los_Angeles",
      }),
    [],
  );

  const data = useMemo(() => {
    return (rows || [])
      .filter((r) => r && r.price > 0)
      .sort((a, b) => new Date(b.snapshot) - new Date(a.snapshot));
  }, [rows]);

  const pageCount = Math.ceil(data.length / PAGE_SIZE);

  const pageData = useMemo(() => {
    const start = page * PAGE_SIZE;
    return data.slice(start, start + PAGE_SIZE);
  }, [data, page]);

  const { minQty, maxQty } = useMemo(() => {
    if (!data.length) {
      return { minQty: 0, maxQty: 0 };
    }

    const quantities = data.map((r) => r.quantity ?? 0);

    return {
      minQty: Math.min(...quantities),
      maxQty: Math.max(...quantities),
    };
  }, [data]);

  const getHeatmapStyle = (quantity) => {
    if (maxQty === minQty) return {};

    const t = (quantity - minQty) / (maxQty - minQty);

    let r, g, b;

    if (t < 0.5) {
      const s = t / 0.5;

      r = Math.round(13 + s * (59 - 13));
      g = Math.round(31 + s * (42 - 31));
      b = Math.round(60 + s * (110 - 60));
    } else {
      const s = (t - 0.5) / 0.5;

      r = Math.round(59 + s * (122 - 59));
      g = Math.round(42 + s * (58 - 42));
      b = Math.round(110 + s * (0 - 110));
    }

    return {
      background: `rgb(${r},${g},${b})`,
      borderColor: `rgba(${r + 40},${g + 30},${b + 20},0.6)`,
    };
  };

  const nextPage = () => {
    setPage((p) => Math.min(p + 1, pageCount - 1));
  };

  const prevPage = () => {
    setPage((p) => Math.max(p - 1, 0));
  };

  if (!data.length) {
    return <div style={{ opacity: 0.7 }}>No data available.</div>;
  }

  return (
    <div>
      {/* Heatmap legend */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
          marginBottom: 8,
          fontSize: 11,
          color: "#8b8896",
        }}
      >
        <span>Qty Low</span>

        <div
          style={{
            flex: 1,
            maxWidth: 160,
            height: 8,
            borderRadius: 4,
            background:
              "linear-gradient(to right, rgb(13,31,60), rgb(59,42,110), rgb(122,58,0))",
            border: "1px solid #333",
          }}
        />

        <span>Qty High</span>
      </div>

      <div className="price-grid">
        {pageData.map((r, i) => {
          const date = new Date(r.snapshot);

          return (
            <div
              key={r.snapshot + i}
              className="price-card tooltip-wrapper"
              style={getHeatmapStyle(r.quantity ?? 0)}
            >
              <div className="date">{pstDate.format(date)}</div>

              <div className="price">{formatGold(r.price)}</div>

              <div
                style={{
                  fontSize: "10px",
                  color: "#b8b4c0",
                  marginTop: "2px",
                }}
              >
                Qty: {(r.quantity ?? 0).toLocaleString()}
              </div>

              <div className="tooltip">{pstTime.format(date)}</div>
            </div>
          );
        })}
      </div>

      <div className="pagination">
        <button onClick={prevPage} disabled={page === 0}>
          Prev
        </button>

        <div className="page-info">
          Page {page + 1} / {pageCount || 1}
        </div>

        <button onClick={nextPage} disabled={page >= pageCount - 1}>
          Next
        </button>
      </div>
    </div>
  );
}
