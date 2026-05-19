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
      <h1 className="page-title">Potion of Recklessness</h1>

      <div className="main-item-grid">
        <div className="main-chart">
          <PriceChart rows={craftedItem.rows} />
        </div>

        <div className="main-table">
          <PriceTable rows={craftedItem.rows} pageSize={50} columns={10} />
        </div>
      </div>

      <h2 style={{ marginTop: 40 }}>Materials</h2>

      <div className="materials-grid">
        {MATERIALS.map((mat) => (
          <MaterialPanel key={mat.id} itemId={mat.id} name={mat.name} />
        ))}
      </div>
    </div>
  );
}

function MaterialPanel({ itemId, name }) {
  const { rows, loading, error } = useUndermineData({
    itemId,
    region: "us",
  });

  return (
    <div className="material-panel">
      <h1 className="material-title">{name}</h1>

      {loading && <div style={{ opacity: 0.6 }}>Loading...</div>}
      {error && <div style={{ color: "#f87171" }}>Error: {error}</div>}

      <PriceChart rows={rows} />
      <PriceTable rows={rows} />
    </div>
  );
}
