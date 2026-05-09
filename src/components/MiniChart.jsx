import React from 'react'
import {
  ResponsiveContainer, AreaChart, Area,
  XAxis, YAxis, Tooltip
} from 'recharts'

const CustomTooltip = ({ active, payload, label, symbol }) => {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-cyber-card/95 border border-cyber-cyan/40 rounded px-2 py-1.5 text-xs font-mono shadow-neon-cyan">
      <div className="text-cyber-dim text-[10px]">{new Date(label).toLocaleTimeString()}</div>
      <div className="text-cyber-cyan font-bold">
        {symbol}: ${payload[0].value >= 1 ? payload[0].value.toFixed(4) : payload[0].value.toFixed(8)}
      </div>
    </div>
  )
}

export default function MiniChart({ data = [], color = '#00f3ff', symbol = '' }) {
  const isUp = data.length >= 2 && data[data.length - 1]?.value >= data[0]?.value
  const chartColor = isUp ? '#00ff88' : '#ff3366'

  return (
    <ResponsiveContainer width="100%" height={60}>
      <AreaChart data={data} margin={{ top: 2, right: 0, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id={`grad-${symbol}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor={chartColor} stopOpacity={0.3} />
            <stop offset="100%" stopColor={chartColor} stopOpacity={0}   />
          </linearGradient>
        </defs>
        <XAxis dataKey="time" hide />
        <YAxis hide domain={['auto', 'auto']} />
        <Tooltip content={<CustomTooltip symbol={symbol} />} />
        <Area
          type="monotone"
          dataKey="value"
          stroke={chartColor}
          strokeWidth={1.5}
          fill={`url(#grad-${symbol})`}
          dot={false}
          activeDot={{ r: 3, fill: chartColor, stroke: 'transparent' }}
          isAnimationActive={false}
        />
      </AreaChart>
    </ResponsiveContainer>
  )
}
