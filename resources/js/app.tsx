import './bootstrap';
import '../css/app.css';

import { createRoot } from 'react-dom/client';
import { createInertiaApp } from '@inertiajs/react';

const appName = import.meta.env.VITE_APP_NAME || 'Laravel';

createInertiaApp({
    title: (title) => `${title} - ${appName}`,
    resolve: async (name) => {
        const pages = import.meta.glob('./Pages/**/*.tsx', { eager: true });
        
        // Debug logging
        console.log('Looking for:', name);
        console.log('Available pages:', Object.keys(pages));
        
        const component = pages[`./Pages/${name}.tsx`];
        
        if (!component) {
            throw new Error(`Component ${name} not found`);
        }
        
        if (!component.default) {
            throw new Error(`Component ${name} has no default export`);
        }
        
        return component.default;
    },
    setup({ el, App, props }) {
        const root = createRoot(el);
        root.render(<App {...props} />);
    },
    progress: {
        color: '#4B5563',
    },
});
