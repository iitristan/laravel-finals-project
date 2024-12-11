'use client';

import React, { useState } from 'react';
import { Link } from '@inertiajs/react';
import { Menu, X, LogIn, UserPlus, LogOut } from 'lucide-react';

interface NavbarLinksProps {
    mobile?: boolean;
    isLoggedIn: boolean;
    onLogout: () => void;
}

const NavbarLinks: React.FC<NavbarLinksProps> = ({ mobile = false, isLoggedIn, onLogout }) => {
    const baseClasses = "text-white hover:text-gray-200 font-medium transition-colors duration-300";
    const desktopClasses = "px-4 py-2 rounded-md text-base";
    const mobileClasses = "block px-4 py-2 rounded-md text-lg";

    if (isLoggedIn) {
        return (
            <>
                <Link
                    href="/dashboard"
                    className={`${baseClasses} ${mobile ? mobileClasses : desktopClasses}`}
                >
                    Dashboard
                </Link>
                <button
                    onClick={onLogout}
                    className={`${baseClasses} ${mobile ? mobileClasses : desktopClasses} group flex items-center`}
                >
                    <LogOut className="w-5 h-5 mr-2 group-hover:animate-pulse" />
                    Logout
                </button>
            </>
        );
    }

    return (
        <>
            <Link
                href="/login"
                className={`${baseClasses} ${mobile ? mobileClasses : desktopClasses} group flex items-center`}
            >
                <LogIn className="w-5 h-5 mr-2 group-hover:animate-pulse" />
                Sign In
            </Link>
            <Link
                href="/register"
                className={`${
                    mobile ? 'block w-full' : ''
                } bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-2 rounded-full text-sm font-medium hover:opacity-90 transition-all duration-200 shadow-md hover:shadow-lg hover:scale-105 flex items-center justify-center`}
            >
                <UserPlus className="w-5 h-5 mr-2" />
                Create Account
            </Link>
        </>
    );
};

interface NavbarProps {
    isAuthenticated: boolean;
    user?: {
        name: string;
        email: string;
    };
}

const WelcomeNavbar: React.FC<NavbarProps> = ({ isAuthenticated, user }) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const handleLogout = async () => {
        try {
            const response = await fetch('/logout', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
                },
            });

            if (response.ok) {
                window.location.href = '/'; // Redirect to the homepage after logout
            } else {
                console.error('Logout failed:', response.statusText);
            }
        } catch (error) {
            console.error('An error occurred during logout:', error);
        }
    };

    return (
        <nav className="bg-transparent fixed top-0 left-0 w-full z-50 backdrop-blur-md shadow-md">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Logo */}
                    <div className="flex-shrink-0">
                        <Link href="/" className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-purple-600 hover:to-indigo-600 transition-all duration-300">
                            GameHub
                        </Link>
                    </div>

                    {/* Links */}
                    <div className="hidden md:flex items-center space-x-6">
                    
                        <NavbarLinks mobile={false} isLoggedIn={isAuthenticated} onLogout={handleLogout} />
                    </div>

                    {/* Mobile Menu */}
                    <div className="md:hidden">
                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="text-white hover:text-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 p-2 rounded-md"
                        >
                            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Dropdown */}
            {isMenuOpen && (
                <div className="md:hidden bg-gray-900 text-white p-4 space-y-4">
                    <NavbarLinks mobile={true} isLoggedIn={isAuthenticated} onLogout={handleLogout} />
                </div>
            )}
        </nav>
    );
};

export default WelcomeNavbar;
