// App.jsx

import { useUndermineData } from "../hooks/useUndermineData";

import PriceTable from "../components/PriceTable";

import { MATERIALS } from "../data/materials";

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

      <h2>Potion of Recklessness</h2>

      <PriceTable rows={craftedItem.rows} />

      <h1 style={{ marginTop: 40, marginBottom: 60 }}>Materials:</h1>

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
    <div style={{ marginTop: 32 }}>
      <h3>{name}</h3>

      {loading && <div style={{ opacity: 0.6 }}>Loading...</div>}

      {error && <div style={{ color: "#f87171" }}>Error: {error}</div>}

      <PriceTable rows={rows} />
    </div>
  );
}
