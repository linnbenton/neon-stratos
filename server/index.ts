import express from 'express'

const app  = express()
const PORT = process.env.PORT || 3001

const BIRDEYE_KEY = process.env.BIRDEYE_API_KEY || ''
const BASE_URL    = 'https://public-api.birdeye.so'

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Headers', 'Content-Type')
  next()
})

app.get('/api/health', (_req, res) => {
  res.json({ ok: true, ts: Date.now() })
})

// Birdeye token overview
app.get('/api/birdeye/token', async (req, res) => {
  const { mint } = req.query as { mint?: string }
  if (!mint) return res.status(400).json({ error: 'Missing mint' })
  try {
    const url = `${BASE_URL}/defi/token_overview?address=${mint}`
    const r = await fetch(url, {
      headers: {
        'X-API-KEY': BIRDEYE_KEY,
        'x-chain': 'solana',
      },
      signal: AbortSignal.timeout(8000),
    })
    if (!r.ok) throw new Error(`Birdeye ${r.status}`)
    const json = await r.json()
    res.json(json)
  } catch (err: any) {
    res.status(502).json({ error: err.message })
  }
})

// Birdeye OHLCV history
app.get('/api/birdeye/history', async (req, res) => {
  const { mint, type = '1H' } = req.query as { mint?: string; type?: string }
  if (!mint) return res.status(400).json({ error: 'Missing mint' })
  try {
    const now   = Math.floor(Date.now() / 1000)
    const from  = now - 86400 // last 24h
    const url   = `${BASE_URL}/defi/ohlcv?address=${mint}&type=${type}&time_from=${from}&time_to=${now}`
    const r = await fetch(url, {
      headers: {
        'X-API-KEY': BIRDEYE_KEY,
        'x-chain': 'solana',
      },
      signal: AbortSignal.timeout(8000),
    })
    if (!r.ok) throw new Error(`Birdeye ${r.status}`)
    const json = await r.json()
    res.json(json)
  } catch (err: any) {
    res.status(502).json({ error: err.message })
  }
})

app.listen(PORT, () => {
  console.log(`[KASM Backend] Running on port ${PORT}`)
  if (!BIRDEYE_KEY) {
    console.warn('[KASM Backend] BIRDEYE_API_KEY not set — price data will use mocks')
  }
})
