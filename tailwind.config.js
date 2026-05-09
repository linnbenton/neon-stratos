/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        cyber: {
          bg:       '#050714',
          surface:  '#0a0f1e',
          card:     '#0d1428',
          border:   '#1a2540',
          cyan:     '#00f3ff',
          magenta:  '#ff00ff',
          purple:   '#7b2fff',
          yellow:   '#f5c518',
          green:    '#00ff88',
          red:      '#ff3366',
          muted:    '#4a5568',
          text:     '#c8d6f0',
          dim:      '#6b7fa3',
        },
      },
      fontFamily: {
        mono: ['"Share Tech Mono"', '"Courier New"', 'monospace'],
        display: ['"Orbitron"', 'monospace'],
      },
      boxShadow: {
        'neon-cyan':    '0 0 20px rgba(0, 243, 255, 0.4), 0 0 60px rgba(0, 243, 255, 0.1)',
        'neon-magenta': '0 0 20px rgba(255, 0, 255, 0.4), 0 0 60px rgba(255, 0, 255, 0.1)',
        'neon-green':   '0 0 20px rgba(0, 255, 136, 0.4), 0 0 60px rgba(0, 255, 136, 0.1)',
        'neon-red':     '0 0 20px rgba(255, 51, 102, 0.4), 0 0 60px rgba(255, 51, 102, 0.1)',
        'glass':        '0 8px 32px rgba(0, 0, 0, 0.6), inset 0 1px 0 rgba(255,255,255,0.05)',
      },
      backdropBlur: {
        xs: '2px',
      },
      animation: {
        'pulse-cyan':    'pulse-cyan 2s ease-in-out infinite',
        'pulse-magenta': 'pulse-magenta 2s ease-in-out infinite',
        'scan':          'scan 4s linear infinite',
        'flicker':       'flicker 6s linear infinite',
        'slide-up':      'slide-up 0.4s ease-out',
        'fade-in':       'fade-in 0.5s ease-out',
        'spin-slow':     'spin 6s linear infinite',
      },
      keyframes: {
        'pulse-cyan': {
          '0%, 100%': { boxShadow: '0 0 10px rgba(0,243,255,0.3)' },
          '50%':       { boxShadow: '0 0 30px rgba(0,243,255,0.7), 0 0 60px rgba(0,243,255,0.3)' },
        },
        'pulse-magenta': {
          '0%, 100%': { boxShadow: '0 0 10px rgba(255,0,255,0.3)' },
          '50%':       { boxShadow: '0 0 30px rgba(255,0,255,0.7), 0 0 60px rgba(255,0,255,0.3)' },
        },
        'scan': {
          '0%':   { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(100vh)' },
        },
        'flicker': {
          '0%, 95%, 100%': { opacity: '1' },
          '96%':            { opacity: '0.8' },
          '97%':            { opacity: '1' },
          '98%':            { opacity: '0.6' },
          '99%':            { opacity: '1' },
        },
        'slide-up': {
          '0%':   { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        'fade-in': {
          '0%':   { opacity: '0' },
          '100%': { opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}
