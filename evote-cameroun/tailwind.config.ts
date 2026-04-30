import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'cm-green': '#007A3D',
        'cm-red': '#CE1126',
        'cm-yellow': '#FCD116',
        'elec-dark': '#0A1628',
        'elec-navy': '#0D1F3C',
        'elec-card': '#111D35',
        'elec-border': '#1E3056',
        'elec-accent': '#1565C0',
        'elec-gold': '#FFC107',
      },
      fontFamily: {
        'display': ['Georgia', 'serif'],
        'body': ['system-ui', 'sans-serif'],
      },
      backgroundImage: {
        'elec-gradient': 'linear-gradient(135deg, #0A1628 0%, #0D1F3C 50%, #0A1628 100%)',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'fade-in': 'fadeIn 0.5s ease-out',
        'slide-up': 'slideUp 0.4s ease-out',
      },
      keyframes: {
        fadeIn: { '0%': { opacity: '0' }, '100%': { opacity: '1' } },
        slideUp: { '0%': { transform: 'translateY(20px)', opacity: '0' }, '100%': { transform: 'translateY(0)', opacity: '1' } },
      },
    },
  },
  plugins: [],
}
export default config
