export class IntelligenceCore {
  constructor() {
    this.listeners = new Set();

    this.state = {
      trend: "NEUTRAL",
      confidence: 0.5,
      volatility: 0,
      momentum: 0,
      regime: "RANGE",
      signal: "WAIT",
      message: "Initializing intelligence core...",
      lastPrice: null,
    };
  }

  subscribe(cb) {
    this.listeners.add(cb);

    return () => {
      this.listeners.delete(cb);
    };
  }

  emit() {
    this.listeners.forEach((cb) => cb(this.state));
  }

  update(price) {
    const prev = this.state.lastPrice;

    if (prev === null) {
      this.state.lastPrice = price;
      this.emit();
      return;
    }

    // =========================
    // PRICE CHANGE
    // =========================
    const delta = price - prev;

    // =========================
    // MOMENTUM
    // =========================
    this.state.momentum = this.state.momentum * 0.8 + delta * 0.2;

    // =========================
    // VOLATILITY
    // =========================
    this.state.volatility = this.state.volatility * 0.9 + Math.abs(delta) * 0.1;

    // =========================
    // TREND
    // =========================
    if (this.state.momentum > 0.15) {
      this.state.trend = "BULLISH";
    } else if (this.state.momentum < -0.15) {
      this.state.trend = "BEARISH";
    } else {
      this.state.trend = "NEUTRAL";
    }

    // =========================
    // REGIME
    // =========================
    if (this.state.volatility > 1.2) {
      this.state.regime = "HIGH VOLATILITY";
    } else if (this.state.volatility > 0.6) {
      this.state.regime = "TRENDING";
    } else {
      this.state.regime = "RANGE";
    }

    // =========================
    // SIGNAL
    // =========================
    if (this.state.trend === "BULLISH" && this.state.regime !== "RANGE") {
      this.state.signal = "LONG";
      this.state.message = "Momentum expansion detected";
    } else if (
      this.state.trend === "BEARISH" &&
      this.state.regime !== "RANGE"
    ) {
      this.state.signal = "SHORT";
      this.state.message = "Distribution pressure increasing";
    } else {
      this.state.signal = "WAIT";
      this.state.message = "Low conviction environment";
    }

    // =========================
    // CONFIDENCE
    // =========================
    this.state.confidence = Math.min(
      0.95,
      0.45 + Math.abs(this.state.momentum) * 1.8 + this.state.volatility * 0.15,
    );

    this.state.lastPrice = price;

    this.emit();
  }
}
