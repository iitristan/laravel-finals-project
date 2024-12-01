import React from 'react';
import { Link } from '@inertiajs/inertia-react';
import { Head } from '@inertiajs/inertia-react';

export default function Welcome() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500">
            <Head title="Welcome" />
            <div className="min-h-screen flex items-center justify-center p-4">
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
                        <div className="flex items-center justify-center space-x-4">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white shadow-lg">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                </svg>
                            </div>
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white shadow-lg">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                                </svg>
                            </div>
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-pink-500 to-red-500 flex items-center justify-center text-white shadow-lg">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 008 11a4 4 0 118 0c0 1.017-.07 2.019-.203 3m-2.118 6.844A21.88 21.88 0 0015.171 17m3.839 1.132c.645-2.266.99-4.659.99-7.132A8 8 0 008 4.07M3 15.364c.64-1.319 1-2.8 1-4.364 0-1.457.39-2.823 1.07-4" />
                                </svg>
                            </div>
                        </div>
                        <div className="text-center text-sm text-gray-500">
                            Built with Laravel, React, and Inertia.js
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}