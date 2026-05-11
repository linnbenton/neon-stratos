type Order = {
  side: "buy" | "sell";
  amount: number;
};

type Level = {
  price: number;
  size: number;
};

type OrderBook = {
  bids: Level[];
  asks: Level[];
};

export function matchOrder(order: Order, book: OrderBook) {
  const { side, amount } = order;

  let remaining = amount;
  const fills: { price: number; size: number }[] = [];

  const levels = side === "buy" ? book.asks : book.bids;

  for (const level of levels) {
    if (remaining <= 0) break;

    const fill = Math.min(remaining, level.size);

    fills.push({
      price: level.price,
      size: fill,
    });

    remaining -= fill;
  }

  return {
    filled: amount - remaining,
    fills,
  };
}
