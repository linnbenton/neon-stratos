export function createMarketEngine(initialPrice = 178) {
  let price = initialPrice;

  const listeners = new Set();

  function tick() {
    // volatility simulation
    const volatility = (Math.random() - 0.5) * 0.6;

    price = Math.max(1, price + volatility);

    const state = {
      price: Number(price.toFixed(2)),
      change: volatility,
      timestamp: Date.now(),
    };

    listeners.forEach((cb) => cb(state));
  }

  return {
    start(interval = 1200) {
      this._interval = setInterval(tick, interval);
    },

    stop() {
      clearInterval(this._interval);
    },

    subscribe(cb) {
      listeners.add(cb);
      return () => listeners.delete(cb);
    },
  };
}
