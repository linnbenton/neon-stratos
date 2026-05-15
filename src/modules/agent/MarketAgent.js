export class MarketAgent {
  constructor() {
    this.memory = {
      trend: "neutral",
      lastPrice: null,
      bias: 0,
    };

    this.listeners = new Set();
  }

  perceive({ price }) {
    const prev = this.memory.lastPrice;

    if (prev !== null) {
      const change = price - prev;

      this.memory.bias = this.memory.bias * 0.8 + change * 0.2;

      this.memory.trend = this.memory.bias > 0 ? "bullish" : "bearish";
    }

    this.memory.lastPrice = price;
  }

  reason() {
    const { trend, bias } = this.memory;

    if (Math.abs(bias) < 0.2) {
      return {
        signal: "NEUTRAL",
        confidence: 0.4,
        message: "Market equilibrium detected",
      };
    }

    if (trend === "bullish") {
      return {
        signal: "LONG",
        confidence: Math.min(0.9, 0.5 + Math.abs(bias)),
        message: "Accumulation pressure building",
      };
    }

    return {
      signal: "SHORT",
      confidence: Math.min(0.9, 0.5 + Math.abs(bias)),
      message: "Distribution phase increasing",
    };
  }

  step(context) {
    this.perceive(context);

    const decision = this.reason();

    const output = {
      ...decision,
      memory: { ...this.memory },
      timestamp: Date.now(),
    };

    this.listeners.forEach((cb) => cb(output));
  }

  subscribe(cb) {
    this.listeners.add(cb);
    return () => this.listeners.delete(cb);
  }
}
