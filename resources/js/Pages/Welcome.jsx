import React from 'react';
import { Head } from '@inertiajs/react';
import WelcomeNavbar from '../Components/WelcomeNavbar';

export default function Welcome() {
    return (
        <>
            <Head title="Welcome" />
            <div className="min-h-screen flex items-center justify-center p-4">
                <div className="bg-white/80 p-8 rounded-3xl shadow-2xl max-w-md w-full transform hover:scale-[1.02] transition-all duration-300">
                    <div className="text-center">
                        <h1 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 mb-2">
                            Welcome
                        </h1>
                        <div className="h-1 w-24 bg-gradient-to-r from-indigo-500 to-purple-500 mx-auto mb-6 rounded-full"></div>
                        <p className="text-gray-600 mb-8 text-lg">
                            Your journey begins here. Sign in to explore more!
                        </p>
                    </div>

                    <div className="space-y-4">
                        <Link
                            href="/login"
                            className="block w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 px-6 rounded-xl text-center font-semibold hover:opacity-90 transform hover:-translate-y-0.5 transition-all duration-200 shadow-lg hover:shadow-xl"
                        >
                            Sign In
                        </Link>
                        <Link
                            href="/register"
                            className="block w-full bg-white text-indigo-600 border-2 border-indigo-600 py-3 px-6 rounded-xl text-center font-semibold hover:bg-indigo-50 transform hover:-translate-y-0.5 transition-all duration-200 shadow-md hover:shadow-lg"
                        >
                            Create Account
                        </Link>
                    </div>

                    <div className="mt-12 space-y-4">
                        <div className="text-center text-sm text-gray-500">
                            Built with Laravel, React, and Inertia.js
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
