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
    const baseClasses = "text-white hover:text-gray-200 font-medium transition-colors duration-300";
    const desktopClasses = "px-4 py-2 rounded-md text-base";
    const mobileClasses = "block px-4 py-2 rounded-md text-lg";

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
                } bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-2 rounded-full text-sm font-medium hover:opacity-90 transition-all duration-200 shadow-md hover:shadow-lg hover:scale-105 flex items-center justify-center`}
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
        <nav className="bg-transparent fixed top-0 left-0 w-full z-50 backdrop-blur-md shadow-md">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Logo */}
                    <div className="flex-shrink-0">
                        <span className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-purple-600 hover:to-indigo-600 transition-all duration-300">
                            Migz's Gaming Hub
                        </span>
                    </div>

                    {/* Navbar Links */}
                    <div className="hidden md:flex items-center space-x-6">
                        <Link href="#" className="text-white text-base hover:text-gray-200 transition-all">Store</Link>
                        <Link href="#" className="text-white text-base hover:text-gray-200 transition-all">Subscribe</Link>
                        <NavbarLinks />
                    </div>

                    {/* Hamburger Menu for Mobile */}
                    <div className="md:hidden">
                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="text-white hover:text-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 p-2 rounded-md"
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

            {/* Mobile Menu */}
            <div className={`md:hidden ${isMenuOpen ? 'block' : 'hidden'} bg-white/90 backdrop-blur-md p-4`}>
                <div className="space-y-4">
                    <Link href="#" className="block text-lg text-gray-700 hover:text-indigo-600">Store</Link>
                    <Link href="#" className="block text-lg text-gray-700 hover:text-indigo-600">Subscribe</Link>
                    <NavbarLinks mobile />
                </div>
            </div>
        </nav>
    );
}

export default WelcomeNavbar;
