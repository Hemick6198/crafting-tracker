import { useUndermineData } from "./hooks/useUndermineData";
import PriceTable from "./components/PriceTable";
import PriceTableMats from "./components/PriceTableMats";

const ITEM_ID = 241288;

export default function App() {
  const { rows, loading, error } = useUndermineData({
    itemId: ITEM_ID,
    region: "us",
  });

  return (
    <div className="container">
      <h1>Potion of Recklessness</h1>

      {loading && <div style={{ opacity: 0.6 }}>Loading...</div>}
      {error && <div style={{ color: "#f87171" }}>Error: {error}</div>}
      {/* <PriceTable rows={rows} /> */}
      <PriceTableMats rows={rows} />
    </div>
  );
}
