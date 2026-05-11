import { portfolio } from "../../../server/engine/portfolio";

export default function Portfolio() {
  const data = portfolio.balances;

  return (
    <div>
      <h2 className="text-white mb-4">Portfolio</h2>

      {Object.keys(data).length === 0 ? (
        <div className="text-slate-500">No assets</div>
      ) : (
        Object.entries(data).map(([asset, value]) => (
          <div key={asset} className="text-sm">
            {asset}: {value}
          </div>
        ))
      )}
    </div>
  );
}
