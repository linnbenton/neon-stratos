export const TOKENS = [
  {
    symbol: "SOL",
    name: "Solana",
    mint: "So11111111111111111111111111111111111111112",
    decimals: 9,
    logo: "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/solana/info/logo.png",
  },
  {
    symbol: "USDC",
    name: "USD Coin",
    mint: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
    decimals: 6,
    logo: "https://cryptologos.cc/logos/usd-coin-usdc-logo.png",
  },
  {
    symbol: "BONK",
    name: "Bonk",
    mint: "DezXAZ8z7PnrnMcjz2DQ5A3z9W8v36GGRf8yAXAYeg9",
    decimals: 5,
    logo: "https://assets.coingecko.com/coins/images/28600/large/bonk.jpg",
  },
  {
    symbol: "JUP",
    name: "Jupiter",
    mint: "JUPyiZJp7pkM2R4Z79L8suJZYNH8v9SByJzqT6y9ZPd",
    decimals: 6,
    logo: "https://static.jup.ag/jup/icon.png",
  },
];

// Helper untuk fetch harga dari Jupiter (Menggunakan API V1 yang bebas CORS di localhost)
export const fetchPrices = async () => {
  const ids = TOKENS.map((t) => t.mint).join(",");

  // Menggunakan API V1 karena endpoint ini tidak memblokir localhost:5173 dengan aturan CORS ketat
  const targetUrl = `https://price.jup.ag/v1/price?id=${ids}`;

  try {
    const res = await fetch(targetUrl);
    if (!res.ok) throw new Error("Gagal mengambil data dari Jupiter V1");

    const json = await res.json();
    console.log("🔥 DATA HARGA JUPITER V1 MASUK:", json.data);

    // Kita lakukan mapping agar format outputnya menyerupai struktur v2 yang dibaca Portfolio.jsx
    const formattedData = {};
    Object.entries(json.data || {}).forEach(([mint, value]) => {
      formattedData[mint] = {
        price: value?.price ?? 0,
      };
    });

    return formattedData;
  } catch (err) {
    console.error("Jupiter V1 Fetch failed, using fallback.", err);

    // Jaring pengaman (fallback) jika internetmu sedang memblokir Jupiter sepenuhnya
    return {
      So11111111111111111111111111111111111111112: { price: 143.44 },
      EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v: { price: 1.0 },
      DezXAZ8z7PnrnMcjz2DQ5A3z9W8v36GGRf8yAXAYeg9: { price: 0.000023 },
      JUPyiZJp7pkM2R4Z79L8suJZYNH8v9SByJzqT6y9ZPd: { price: 1.02 },
    };
  }
};
