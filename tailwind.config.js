/** @type {import('tailwindcss').Config} */
module.exports = {
    darkMode: ["class"],
    content: [
        './pages/**/*.{ts,tsx}',
        './components/**/*.{ts,tsx}',
        './app/**/*.{ts,tsx}',
        './src/**/*.{ts,tsx}',
    ],
    theme: {
        extend: {
            colors: {
                border: "var(--border)",
                input: "var(--border)",
                ring: "var(--border-focus)",
                background: "var(--bg-main)",
                foreground: "var(--text-main)",
                primary: {
                    DEFAULT: "var(--primary)",
                    foreground: "#ffffff",
                },
                secondary: {
                    DEFAULT: "var(--secondary)",
                    foreground: "#ffffff",
                },
                destructive: {
                    DEFAULT: "var(--error)",
                    foreground: "#ffffff",
                },
                muted: {
                    DEFAULT: "var(--bg-main)",
                    foreground: "var(--text-muted)",
                },
                accent: {
                    DEFAULT: "var(--bg-card)", // Use card bg for accents/hovers in menus
                    foreground: "var(--text-main)",
                },
                popover: {
                    DEFAULT: "var(--bg-card)",
                    foreground: "var(--text-main)",
                },
                card: {
                    DEFAULT: "var(--bg-card)",
                    foreground: "var(--text-main)",
                },
            },
            borderRadius: {
                lg: "var(--radius-lg)",
                md: "var(--radius-md)",
                sm: "var(--radius-sm)",
            },
        },
    },
    plugins: [require("tailwindcss-animate")],
}
