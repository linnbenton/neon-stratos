import { useState } from "react";
import { useAutoSwap } from "../../hooks/useAutoSwap";

export default function SwapPanel() {
  const [amount, setAmount] = useState("");

  const { route, loading, valid } = useAutoSwap("SOL", "USDC", amount);

  return (
    <div className="text-white p-4">
      <h2>Instant Swap</h2>

      <input
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        placeholder="0.0"
        className="p-2 text-black"
      />

      <div className="mt-4">
        {loading && "Loading quote..."}

        {!loading && route && <div>Output: {route.outAmount} USDC</div>}

        {!loading && !route && amount && <div>No route</div>}
      </div>
    </div>
  );
}
