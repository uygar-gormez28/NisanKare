import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#FFF9F6", // Warm Ivory
        foreground: "#2B2430", // Dark Plum
        muted: "#756A70",      // Muted Plum/Gray Text
        card: "#FFFFFF",       // White Card
        border: "#EEDDD8",     // Light Rose Border
        dusty: {
          DEFAULT: "#B76E79", // Dusty Rose (Primary Accent)
          dark: "#9E5862",    // Hover Dusty Rose
          light: "#D6A6A1",   // Soft Rose (Secondary Accent)
          border: "#EEDDD8",  // Light Rose Border
          muted: "#756A70",   // Muted Text
          plum: "#2B2430",    // Dark Plum Text
          ivory: "#FFF9F6",   // Warm Ivory Background
        },
        romantic: {
          50: '#FFF9F6',
          100: '#F9EFEF',
          200: '#EEDDD8',
          300: '#D6A6A1',
          400: '#C78992',
          500: '#B76E79', // Dusty Rose
          600: '#9E5862',
          700: '#85444E',
          800: '#2B2430',
          900: '#1E1822',
        },
      },
      fontFamily: {
        serif: ['var(--font-serif)', 'Playfair Display', 'Cormorant Garamond', 'Georgia', 'serif'],
        sans: ['var(--font-sans)', 'Inter', 'Plus Jakarta Sans', 'sans-serif'],
      },
      boxShadow: {
        'glass': '0 10px 30px -5px rgba(183, 110, 121, 0.08), 0 4px 12px 0 rgba(43, 36, 48, 0.03)',
        'soft-glow': '0 0 25px rgba(183, 110, 121, 0.15)',
      },
    },
  },
  plugins: [],
};

export default config;
