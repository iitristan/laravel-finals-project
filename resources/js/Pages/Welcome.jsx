import React from 'react';
import { Head } from '@inertiajs/inertia-react';
import WelcomeNavbar from '@/Components/WelcomeNavbar';

export default function Welcome() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500">
            <Head title="Welcome" />
            <WelcomeNavbar />
            <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-4">
            </div>
        </div>
    );
}