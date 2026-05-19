import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Filler,
  TimeScale,
} from "chart.js";

import { Line } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Filler,
  TimeScale,
);

function formatGoldShort(copper) {
  if (!copper) return "0g";
  return `${Math.floor(copper / 10000)}g`;
}

export default function PriceChart({ rows }) {
  const data = [...(rows || [])]
    .filter((r) => r?.price > 0)
    .sort((a, b) => new Date(a.snapshot) - new Date(b.snapshot));

  const labels = data.map((r) =>
    new Date(r.snapshot).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    }),
  );

  const prices = data.map((r) => r.price);

  const chartData = {
    labels,
    datasets: [
      {
        label: "Price",
        data: prices,

        borderColor: "#f97316",
        borderWidth: 2,

        backgroundColor: "rgba(249, 115, 22, 0.18)",
        fill: true,

        tension: 0.25,
        pointRadius: 0,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,

    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: (ctx) => formatGoldShort(ctx.raw),
        },
      },
    },

    scales: {
      x: {
        ticks: {
          maxTicksLimit: 8,
          color: "#9ca3af",
        },
        grid: {
          color: "rgba(255,255,255,0.05)",
        },
      },
      y: {
        ticks: {
          color: "#9ca3af",
          callback: (val) => formatGoldShort(val),
        },
        grid: {
          color: "rgba(255,255,255,0.05)",
        },
      },
    },
  };

  return (
    <div className="chart-card">
      <h3 className="chart-title">Price Trend</h3>

      <div style={{ height: 200, paddingTop: 24 }}>
        <Line data={chartData} options={options} />
      </div>
    </div>
  );
}
