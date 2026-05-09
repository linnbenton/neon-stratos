const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://api.eitherway.ai'

export const PROXY_API = (url) =>
  `${API_BASE_URL}/api/proxy-api?url=${encodeURIComponent(url)}`

// Kamino public API – no key required
export const KAMINO_API = 'https://api.kamino.finance'

// Birdeye routed through our backend server (keeps key server-side)
export const BIRDEYE_BACKEND = '/api/birdeye'
