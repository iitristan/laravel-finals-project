'use client'

import React, { useState } from 'react';
import { Link } from '@inertiajs/react';
import { Menu, X, LogIn, UserPlus } from 'lucide-react';
import route from 'ziggy-js';

declare global {
    function route(name: string): string;
}

interface NavbarLinksProps {
    mobile?: boolean;
}

const NavbarLinks: React.FC<NavbarLinksProps> = ({ mobile = false }) => {
    const baseClasses = "text-gray-700 hover:text-indigo-600 font-medium transition-colors duration-200";
    const desktopClasses = "px-3 py-2 rounded-md text-sm";
    const mobileClasses = "block px-3 py-2 rounded-md text-base";

    return (
        <>
            <Link
                href={route('login')}
                className={`${baseClasses} ${mobile ? mobileClasses : desktopClasses} group flex items-center`}
            >
                <LogIn className="w-5 h-5 mr-2 group-hover:animate-pulse" />
                Sign In
            </Link>
            <Link
                href={route('register')}
                className={`${
                    mobile ? 'block w-full' : ''
                } bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:opacity-90 transition-all duration-200 shadow-md hover:shadow-lg hover:scale-105 flex items-center justify-center`}
            >
                <UserPlus className="w-5 h-5 mr-2" />
                Create Account
            </Link>
        </>
    );
}

const WelcomeNavbar: React.FC = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return (
        <nav className="bg-white/80 backdrop-blur-lg shadow-md sticky top-0 z-50 transition-all duration-300 ease-in-out">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16 items-center">
                    <div className="flex-shrink-0">
                        <span className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-purple-600 hover:to-indigo-600 transition-all duration-300">
                            Logo
                        </span>
                    </div>
                    <div className="hidden md:flex items-center space-x-4">
                        <NavbarLinks />
                    </div>
                    <div className="md:hidden">
                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="text-gray-700 hover:text-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 p-2 rounded-md"
                        >
                            <span className="sr-only">Open main menu</span>
                            {isMenuOpen ? (
                                <X className="h-6 w-6" aria-hidden="true" />
                            ) : (
                                <Menu className="h-6 w-6" aria-hidden="true" />
                            )}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile menu, show/hide based on menu state */}
            <div className={`md:hidden ${isMenuOpen ? 'block' : 'hidden'}`}>
                <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                    <NavbarLinks mobile />
                </div>
            </div>
        </nav>
    );
}

export default WelcomeNavbar;

