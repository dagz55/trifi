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
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      colors: {
        border: "rgb(var(--border) / <alpha-value>)",
        input: "rgb(var(--input) / <alpha-value>)",
        ring: "rgb(var(--ring) / <alpha-value>)",
        background: "rgb(var(--background) / <alpha-value>)",
        foreground: "rgb(var(--foreground) / <alpha-value>)",
        primary: {
          DEFAULT: "rgb(var(--primary) / <alpha-value>)",
          foreground: "rgb(var(--primary-foreground) / <alpha-value>)",
        },
        secondary: {
          DEFAULT: "rgb(var(--secondary) / <alpha-value>)",
          foreground: "rgb(var(--secondary-foreground) / <alpha-value>)",
        },
        destructive: {
          DEFAULT: "rgb(var(--destructive) / <alpha-value>)",
          foreground: "rgb(var(--destructive-foreground) / <alpha-value>)",
        },
        muted: {
          DEFAULT: "rgb(var(--muted) / <alpha-value>)",
          foreground: "rgb(var(--muted-foreground) / <alpha-value>)",
        },
        accent: {
          DEFAULT: "rgb(var(--accent) / <alpha-value>)",
          foreground: "rgb(var(--accent-foreground) / <alpha-value>)",
        },
        popover: {
          DEFAULT: "rgb(var(--popover) / <alpha-value>)",
          foreground: "rgb(var(--popover-foreground) / <alpha-value>)",
        },
        card: {
          DEFAULT: "rgb(var(--card) / <alpha-value>)",
          foreground: "rgb(var(--card-foreground) / <alpha-value>)",
        },
        // Modern Financial Platform Colors
        fintech: {
          // Primary brand colors
          primary: "rgb(0, 102, 255)",      // Modern blue
          "primary-hover": "rgb(0, 92, 230)",
          secondary: "rgb(16, 185, 129)",    // Success green
          "secondary-hover": "rgb(5, 150, 105)",
          
          // Accent colors
          accent: "rgb(139, 92, 246)",       // Purple accent
          "accent-hover": "rgb(124, 58, 237)",
          warning: "rgb(245, 158, 11)",      // Amber warning
          "warning-hover": "rgb(217, 119, 6)",
          danger: "rgb(239, 68, 68)",        // Red danger
          "danger-hover": "rgb(220, 38, 38)",
          
          // Neutral palette
          neutral: {
            50: "rgb(248, 250, 252)",
            100: "rgb(241, 245, 249)",
            200: "rgb(226, 232, 240)",
            300: "rgb(203, 213, 225)",
            400: "rgb(148, 163, 184)",
            500: "rgb(100, 116, 139)",
            600: "rgb(71, 85, 105)",
            700: "rgb(51, 65, 85)",
            800: "rgb(30, 41, 59)",
            900: "rgb(15, 23, 42)",
            950: "rgb(2, 6, 23)",
          },
          
          // Semantic colors
          success: "rgb(34, 197, 94)",
          info: "rgb(59, 130, 246)",
          
          // Glass effects
          glass: "rgba(255, 255, 255, 0.1)",
          "glass-dark": "rgba(0, 0, 0, 0.1)",
        },
        
        // Apple-specific colors (kept for compatibility)
        apple: {
          blue: "rgb(0, 122, 255)",
          green: "rgb(52, 199, 89)",
          "green-hover": "rgb(48, 179, 80)",
          orange: "rgb(255, 149, 0)",
          red: "rgb(255, 59, 48)",
          purple: "rgb(88, 86, 214)",
          pink: "rgb(255, 45, 85)",
          gray: "rgb(142, 142, 147)",
          gray2: "rgb(174, 174, 178)",
          gray3: "rgb(199, 199, 204)",
          gray4: "rgb(209, 209, 214)",
          gray5: "rgb(229, 229, 234)",
          gray6: "rgb(242, 242, 247)",
        },
        
        // Enhanced green scale
        green: {
          50: "rgb(240, 253, 244)",
          100: "rgb(220, 252, 231)",
          200: "rgb(187, 247, 208)",
          300: "rgb(134, 239, 172)",
          400: "rgb(74, 222, 128)",
          500: "rgb(34, 197, 94)",     // Modern green
          600: "rgb(22, 163, 74)",     // Modern green hover
          700: "rgb(21, 128, 61)",
          800: "rgb(22, 101, 52)",
          900: "rgb(20, 83, 45)",
          950: "rgb(5, 46, 22)",
        },
        
        // Enhanced blue scale
        blue: {
          50: "rgb(239, 246, 255)",
          100: "rgb(219, 234, 254)",
          200: "rgb(191, 219, 254)",
          300: "rgb(147, 197, 253)",
          400: "rgb(96, 165, 250)",
          500: "rgb(59, 130, 246)",
          600: "rgb(37, 99, 235)",
          700: "rgb(29, 78, 216)",
          800: "rgb(30, 64, 175)",
          900: "rgb(30, 58, 138)",
          950: "rgb(23, 37, 84)",
        },
        
        // Enhanced purple scale
        purple: {
          50: "rgb(250, 245, 255)",
          100: "rgb(243, 232, 255)",
          200: "rgb(233, 213, 255)",
          300: "rgb(196, 181, 253)",
          400: "rgb(167, 139, 250)",
          500: "rgb(139, 92, 246)",
          600: "rgb(124, 58, 237)",
          700: "rgb(109, 40, 217)",
          800: "rgb(91, 33, 182)",
          900: "rgb(76, 29, 149)",
          950: "rgb(46, 16, 101)",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
        xl: "16px",
        "2xl": "20px",
        "3xl": "24px",
      },
      keyframes: {
        // Accordion animations
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        
        // Entry animations
        "fade-in": {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "fade-in-up": {
          "0%": { opacity: "0", transform: "translateY(40px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "fade-in-down": {
          "0%": { opacity: "0", transform: "translateY(-40px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "slide-in-right": {
          "0%": { transform: "translateX(100%)", opacity: "0" },
          "100%": { transform: "translateX(0)", opacity: "1" },
        },
        "slide-in-left": {
          "0%": { transform: "translateX(-100%)", opacity: "0" },
          "100%": { transform: "translateX(0)", opacity: "1" },
        },
        
        // Scale animations
        "scale-in": {
          "0%": { transform: "scale(0.95)", opacity: "0" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },
        "scale-out": {
          "0%": { transform: "scale(1)", opacity: "1" },
          "100%": { transform: "scale(0.95)", opacity: "0" },
        },
        
        // Hover effects
        "bounce-subtle": {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-2px)" },
        },
        "pulse-subtle": {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.8" },
        },
        "pulse-glow": {
          "0%, 100%": { boxShadow: "0 0 5px rgba(59, 130, 246, 0.5)" },
          "50%": { boxShadow: "0 0 20px rgba(59, 130, 246, 0.8)" },
        },
        
        // Loading animations
        "shimmer": {
          "0%": { transform: "translateX(-100%)" },
          "100%": { transform: "translateX(100%)" },
        },
        "spin-slow": {
          "0%": { transform: "rotate(0deg)" },
          "100%": { transform: "rotate(360deg)" },
        },
        
        // Financial specific
        "count-up": {
          "0%": { transform: "translateY(20px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        "money-flow": {
          "0%": { transform: "translateX(-10px)", opacity: "0.5" },
          "50%": { transform: "translateX(5px)", opacity: "1" },
          "100%": { transform: "translateX(0)", opacity: "0.8" },
        },
      },
      animation: {
        // Accordion animations
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        
        // Entry animations
        "fade-in": "fade-in 0.5s ease-out",
        "fade-in-up": "fade-in-up 0.6s ease-out",
        "fade-in-down": "fade-in-down 0.6s ease-out",
        "slide-in-right": "slide-in-right 0.3s ease-out",
        "slide-in-left": "slide-in-left 0.3s ease-out",
        
        // Scale animations
        "scale-in": "scale-in 0.2s ease-out",
        "scale-out": "scale-out 0.2s ease-in",
        
        // Hover effects
        "bounce-subtle": "bounce-subtle 2s infinite",
        "pulse-subtle": "pulse-subtle 2s infinite",
        "pulse-glow": "pulse-glow 2s infinite",
        
        // Loading animations
        "shimmer": "shimmer 1.5s infinite",
        "spin-slow": "spin-slow 3s linear infinite",
        
        // Financial specific
        "count-up": "count-up 0.8s ease-out",
        "money-flow": "money-flow 2s ease-in-out infinite",
      },
      boxShadow: {
        // Apple shadows (kept for compatibility)
        "apple": "0 4px 16px rgba(0, 0, 0, 0.1)",
        "apple-lg": "0 8px 32px rgba(0, 0, 0, 0.12)",
        "apple-xl": "0 12px 48px rgba(0, 0, 0, 0.15)",
        
        // Modern fintech shadows
        "fintech": "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
        "fintech-lg": "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
        "fintech-xl": "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
        "fintech-2xl": "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
        
        // Glass morphism
        "glass": "0 8px 32px rgba(0, 0, 0, 0.1)",
        "glass-lg": "0 16px 68px rgba(0, 0, 0, 0.1)",
        "inner-light": "inset 0 1px 3px rgba(0, 0, 0, 0.1)",
        "inner-glow": "inset 0 2px 4px rgba(255, 255, 255, 0.1)",
        
        // Colored glows
        "blue-glow": "0 0 20px rgba(59, 130, 246, 0.3)",
        "green-glow": "0 0 20px rgba(34, 197, 94, 0.3)",
        "purple-glow": "0 0 20px rgba(139, 92, 246, 0.3)",
        
        // Neumorphism
        "neomorphism": "8px 8px 16px rgba(0, 0, 0, 0.1), -8px -8px 16px rgba(255, 255, 255, 0.1)",
        "neomorphism-inset": "inset 8px 8px 16px rgba(0, 0, 0, 0.1), inset -8px -8px 16px rgba(255, 255, 255, 0.1)",
      },
      backdropBlur: {
        xs: "2px",
      },
      spacing: {
        "18": "4.5rem",
        "88": "22rem",
        "128": "32rem",
      },
      screens: {
        "xs": "475px",
      },
      letterSpacing: {
        "tighter": "-0.05em",
        "apple": "-0.015em",
      },
      transitionTimingFunction: {
        "apple": "cubic-bezier(0.25, 0.46, 0.45, 0.94)",
      },
      zIndex: {
        "60": "60",
        "70": "70",
        "80": "80",
        "90": "90",
        "100": "100",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}
