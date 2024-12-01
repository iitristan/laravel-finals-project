import React from 'react';
import { Link } from '@inertiajs/inertia-react';
import { Head } from '@inertiajs/inertia-react';

export default function Welcome() {
    return (
        <div className="h-full">
            <Head title="Welcome" />
            <div className="h-full bg-gradient flex items-center justify-center p-4">
                <div className="bg-white/90 backdrop-blur-sm p-8 rounded-2xl shadow-2xl max-w-md w-full">
                    <div className="text-center">
                        <h1 className="text-4xl font-bold text-gray-800 mb-2">Welcome to Laravel</h1>
                        <div className="h-1 w-20 bg-gradient mx-auto mb-4"></div>
                        <p className="text-gray-600 mb-8">Your journey begins here. Sign in to explore more!</p>
                    </div>
                    <div className="space-y-4">
                        <Link
                            href="/login"
                            className="block w-full bg-gradient text-white py-3 px-6 rounded-xl text-center font-semibold hover:opacity-90 transform hover:-translate-y-0.5 transition-all duration-200"
                        >
                            Sign In
                        </Link>
                        <Link
                            href="/register"
                            className="block w-full bg-white text-indigo-500 border-2 border-indigo-500 py-3 px-6 rounded-xl text-center font-semibold hover:bg-indigo-50 transform hover:-translate-y-0.5 transition-all duration-200"
                        >
                            Create Account
                        </Link>
                    </div>
                    <div className="mt-8 text-center text-sm text-gray-500">
                        Built with Laravel, React, and Inertia.js
                    </div>
                </div>
            </div>
        </div>
    );
}