import defaultTheme from 'tailwindcss/defaultTheme';

/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./resources/**/*.jsx",
        "./resources/**/*tsx",
    ],
    theme: {
        extend: {
            // Add any custom theme extensions here
        },
    },
    plugins: [],
};
