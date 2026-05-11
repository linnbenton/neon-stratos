export type Trade = {
  type: "swap" | "limit" | "market";
  route?: any;
  source?: "jupiter" | "rpc";
  amount?: number;
  price?: number;
};

export const tradeHistory: Trade[] = [];

export function recordTrade(trade: Trade) {
  tradeHistory.push({
    ...trade,
    ts: Date.now(),
    status: "filled",
  } as Trade & { ts: number; status: "filled" });
}
