import React from 'react';
import { Head } from '@inertiajs/inertia-react';
import WelcomeNavbar from '@/Components/WelcomeNavbar';

export default function Welcome() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500">
            <Head title="Welcome" />
            <WelcomeNavbar />
            <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-4">
                <div className="bg-white/80 backdrop-blur-lg p-8 rounded-3xl shadow-2xl max-w-md w-full transform hover:scale-[1.02] transition-all duration-300">
                    <div className="text-center">
                        <h1 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 mb-2">
                            Welcome
                        </h1>
                        <div className="h-1 w-24 bg-gradient-to-r from-indigo-500 to-purple-500 mx-auto mb-6 rounded-full"></div>
                        <p className="text-gray-600 mb-8 text-lg">
                            Your journey begins here. Sign in to explore more!
                        </p>
                    </div>

                    <div className="mt-12 space-y-4">
                        <div className="text-center text-sm text-gray-500">
                            Built with Laravel, React, and Inertia.js
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}