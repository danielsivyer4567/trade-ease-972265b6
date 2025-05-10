/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "#3b82f6",
          foreground: "hsl(var(--primary-foreground))",
          light: "#60a5fa",
          dark: "#2563eb",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        gold: {
          '50': '#FBF8E7',
          '100': '#F7F0CE',
          '200': '#EFE19C',
          '300': '#E7D26B',
          '400': '#DFC439',
          '500': '#CAB025',
          '600': '#A18C1D',
          '700': '#786815',
          '800': '#50440E',
          '900': '#272207'
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        pulseLine: {
          '0%, 100%': { 
            opacity: '0.7',
            boxShadow: '0 0 0 0 rgba(59, 130, 246, 0.4)'
          },
          '50%': { 
            opacity: '1',
            boxShadow: '0 0 12px 6px rgba(59, 130, 246, 0.7)'
          },
        },
        connectorPulse: {
          '0%, 100%': { opacity: '0.3' },
          '50%': { opacity: '1' },
        },
        ropeShake: {
          '0%, 100%': { transform: 'translateX(0px)' },
          '25%': { transform: 'translateX(-2.5px)' },
          '50%': { transform: 'translateX(0px)' },
          '75%': { transform: 'translateX(2.5px)' },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        'pulse-line': 'pulseLine 1.5s ease-in-out infinite',
        'connector-pulse': 'connectorPulse 2s ease-in-out infinite',
        'rope-shake': 'ropeShake 0.6s ease-in-out infinite',
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} 
