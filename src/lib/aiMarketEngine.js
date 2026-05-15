export function createAIMarketEngine() {
  let listeners = new Set();

  const baseInsights = [
    "Liquidity clustering forming near key resistance zone",
    "Momentum shift detected in mid timeframe structure",
    "Order flow imbalance increasing on buy side",
    "Retail participation rising in breakout region",
    "Whale accumulation pattern detected",
  ];

  function generateInsight(price, change) {
    const trend =
      change > 0
        ? "bullish pressure building"
        : "distribution phase increasing";

    const random =
      baseInsights[Math.floor(Math.random() * baseInsights.length)];

    return `${random} • ${trend} • price context: $${price}`;
  }

  return {
    subscribe(cb) {
      listeners.add(cb);
      return () => listeners.delete(cb);
    },

    push(price, change) {
      const insight = generateInsight(price, change);

      listeners.forEach((cb) =>
        cb({
          text: insight,
          timestamp: Date.now(),
          severity: Math.abs(change),
        }),
      );
    },
  };
}
