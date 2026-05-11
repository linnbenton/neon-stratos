import { recordTrade } from "./trades.js";
import { portfolio } from "./portfolio.js";

async function jupiterSwap(route: any) {
  // placeholder real integration nanti
  return {
    source: "jupiter",
    status: "success",
    route,
  };
}

async function rpcSwap(route: any) {
  // fallback simulation
  return {
    source: "rpc",
    status: "success",
    route,
  };
}

export async function executeSwap(route: any) {
  try {
    const result = await jupiterSwap(route);

    recordTrade({
      type: "swap",
      route,
      source: "jupiter",
    });

    return result;
  } catch (e) {
    console.warn("fallback RPC swap");

    const result = await rpcSwap(route);

    recordTrade({
      type: "swap",
      route,
      source: "rpc",
    });

    return result;
  }
}
