import React from 'react';
import { Link } from '@inertiajs/inertia-react';

export default function WelcomeNavbar() {
    return (
        <nav className="bg-white/80 backdrop-blur-lg shadow-md">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16 items-center">
                    <div className="flex-shrink-0">
                        <span className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">
                            Logo
                        </span>
                    </div>
                    <div className="flex items-center space-x-4">
                        <Link
                            href="/login"
                            className="text-gray-700 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200"
                        >
                            Sign In
                        </Link>
                        <Link
                            href="/register"
                            className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:opacity-90 transition-all duration-200 shadow-md hover:shadow-lg"
                        >
                            Create Account
                        </Link>
                    </div>
                </div>
            </div>
        </nav>
    );
}
