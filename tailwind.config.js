/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                'traditional-gold': '#B8860B',
                'traditional-red': '#8B0000',
                'traditional-black': '#1A1A1A',
                'traditional-paper': '#FDFCF0',
            },
            fontFamily: {
                myeongjo: ['"Nanum Myeongjo"', 'serif'],
            },
            fontSize: {
                'base': '18px',
            },
        },
    },
    plugins: [],
}
