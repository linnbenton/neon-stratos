type Level = {
  price: number;
  size: number;
};

type OrderBook = {
  bids: Level[];
  asks: Level[];
};

export function generateOrderbook(midPrice: number): OrderBook {
  const bids: Level[] = [];
  const asks: Level[] = [];

  for (let i = 1; i <= 20; i++) {
    bids.push({
      price: midPrice * (1 - i * 0.001),
      size: Math.random() * 5 + 1,
    });

    asks.push({
      price: midPrice * (1 + i * 0.001),
      size: Math.random() * 5 + 1,
    });
  }

  return { bids, asks };
}
