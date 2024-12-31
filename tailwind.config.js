const animate = require("tailwindcss-animate");
const tailwindMdBase = require("@geoffcodesthings/tailwind-md-base");

/** @type {import('tailwindcss').Config} */
module.exports = {
    darkMode: ["class"],
    safelist: ["dark"],
    content: ["./pages/**/*.{ts,tsx,vue}", "./components/**/*.{ts,tsx,vue}", "./app/**/*.{ts,tsx,vue}", "./src/**/*.{ts,tsx,vue}"],
    prefix: "",
    theme: {
        markdownBase: {
            wrapperClass: "markdown",
            code: {
                background: "#5a5a5a",
                borderRadius: "4px",
                padding: "3px 6px ",
            },
            h1: {
                fontSize: "24px",
            },
            h2: {
                fontSize: "18px",
            },
            p: {
                "&:last-child": {
                    marginBottom: "0px",
                },
            },

            li: {
                "p:first-child": {
                    display: "inline",
                },
            },
            img: {
                "max-width": "200px",
            },
        },
        fontSize: {
            base: "14px",
        },
        container: {
            center: true,
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
                    DEFAULT: "hsl(var(--primary))",
                    foreground: "hsl(var(--primary-foreground))",
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
                app: {
                    background: "#090909",
                    black70: "rgba(23, 24, 24, 0.70)",
                    dark2: "#282828",
                    dark3: "#3C3C3C",
                    basic10: "#ffffff",
                    basic11: "#252525",
                    card1: "#292929",
                    card2: "#222222",
                    line1: "#2b2b2b",
                    line2: "rgba(255,255,255,0.2)",
                    line3: "#3d3d3d",
                    text2: "rgba(255, 255, 255, 0.80)",
                    visualGrape: "#8D5AF2",
                    red: "#FF2323",
                    red2: "#FF5757",
                    text1: "#f6f6f6",
                    text3: "#888888",
                },
                system: {
                    red: "#E84142",
                    green: "#2BAA5F",
                    teal: "#80A405",
                    blue: "#005AE1",
                    purple: "#5F48F2",
                    orange: "#EE5910",
                    orange2: "#E9850D",
                },
            },
            borderRadius: {
                xl: "calc(var(--radius) + 4px)",
                lg: "var(--radius)",
                md: "calc(var(--radius) - 2px)",
                sm: "calc(var(--radius) - 4px)",
            },
            keyframes: {
                "accordion-down": {
                    from: { height: 0 },
                    to: { height: "var(--radix-accordion-content-height)" },
                },
                "accordion-up": {
                    from: { height: "var(--radix-accordion-content-height)" },
                    to: { height: 0 },
                },
                "collapsible-down": {
                    from: { height: 0 },
                    to: { height: "var(--radix-collapsible-content-height)" },
                },
                "collapsible-up": {
                    from: { height: "var(--radix-collapsible-content-height)" },
                    to: { height: 0 },
                },
            },
            animation: {
                "accordion-down": "accordion-down 0.2s ease-out",
                "accordion-up": "accordion-up 0.2s ease-out",
                "collapsible-down": "collapsible-down 0.2s ease-in-out",
                "collapsible-up": "collapsible-up 0.2s ease-in-out",
            },
        },
    },
    plugins: [animate, tailwindMdBase()],
};
