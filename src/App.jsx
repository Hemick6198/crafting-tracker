import { useUndermineData } from "./hooks/useUndermineData";

import PriceTable from "./components/PriceTable";
import PriceChart from "./components/PriceChart";

import { MATERIALS } from "./data/materials";

const ITEM_ID = 241288;

export default function App() {
  const craftedItem = useUndermineData({
    itemId: ITEM_ID,
    region: "us",
  });

  return (
    <div className="container">
      {craftedItem.loading && <div style={{ opacity: 0.6 }}>Loading...</div>}

      {craftedItem.error && (
        <div style={{ color: "#f87171" }}>Error: {craftedItem.error}</div>
      )}

      <h1>Potion of Recklessness</h1>

      <div className="table-chart-layout">
        <div className="table-section">
          <PriceTable rows={craftedItem.rows} />
        </div>

        <div className="chart-section">
          <PriceChart rows={craftedItem.rows} title="Potion Price Trend" />
        </div>
      </div>

      <h1
        style={{
          marginTop: 60,
          marginBottom: 40,
        }}
      >
        Materials
      </h1>

      {MATERIALS.map((mat) => (
        <MaterialTable key={mat.id} itemId={mat.id} name={mat.name} />
      ))}
    </div>
  );
}

function MaterialTable({ itemId, name }) {
  const { rows, loading, error } = useUndermineData({
    itemId,
    region: "us",
  });

  return (
    <div style={{ marginTop: 50 }}>
      <h2
        style={{
          marginBottom: 20,
        }}
      >
        {name}
      </h2>

      {loading && <div style={{ opacity: 0.6 }}>Loading...</div>}

      {error && <div style={{ color: "#f87171" }}>Error: {error}</div>}

      <div className="table-chart-layout">
        <div className="table-section">
          <PriceTable rows={rows} />
        </div>

        <div className="chart-section">
          <PriceChart rows={rows} title={`${name} Price Trend`} />
        </div>
      </div>
    </div>
  );
}
