type Balances = Record<string, number>;
type Prices = Record<string, number>;

export const portfolio = {
  balances: {} as Balances,

  update(asset: string, amount: number) {
    this.balances[asset] = (this.balances[asset] || 0) + amount;
  },

  value(prices: Prices) {
    return Object.entries(this.balances).reduce((sum, [asset, amount]) => {
      return sum + amount * (prices[asset] || 0);
    }, 0);
  },
};
