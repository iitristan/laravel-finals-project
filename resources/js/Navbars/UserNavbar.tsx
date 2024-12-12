"use client";

import React, { useState } from 'react';
import { Link, useForm } from '@inertiajs/react';
import { Menu, X } from 'lucide-react';


const UserNavbar: React.FC = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const { post } = useForm();

    const handleLogout = () => {
        post('/logout');
    };

    return (
        <nav className="bg-gradient-to-r from-indigo-600 to-purple-600 fixed top-0 left-0 w-full z-50 shadow-md backdrop-blur-md">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Logo */}
                    <div className="flex items-center">
                        <Link
                            href="/"
                            className="text-3xl font-bold text-transparent bg-clip-text bg-white hover:opacity-80 transition-opacity duration-300"
                        >
                            GameHub
                        </Link>
                    </div>

                    {/* Navbar Links */}
                    <div className="hidden md:flex items-center space-x-6">
                        <Link
                            href="/"
                            className="text-white text-base hover:text-gray-200 transition-all"
                        >
                            Home
                        </Link>

                        <Link
                            href="/store"
                            className="text-white text-base hover:text-gray-200 transition-all"
                        >
                            Game Store
                        </Link>
                        <Link
                            href="/orders"
                            className="text-white text-base hover:text-gray-200 transition-all"
                        >
                            My Orders
                        </Link>
                        <Link
                            href="/wishlist"
                            className="text-white text-base hover:text-gray-200 transition-all"
                        >
                            Wishlist
                        </Link>
                        <Link
                            href="/cart"
                            className="text-white text-base hover:text-gray-200 transition-all"
                        >
                            Cart
                        </Link>
                        <button
                            onClick={handleLogout}
                            type="button"
                            className="text-white text-base px-3 py-2 rounded-md hover:bg-indigo-700 transition-all"
                        >
                            Logout
                        </button>
                    </div>

                    {/* Hamburger Menu for Mobile */}
                    <div className="md:hidden">
                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="text-white hover:text-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 p-2 rounded-md"
                        >
                            {isMenuOpen ? (
                                <X className="h-6 w-6" aria-hidden="true" />
                            ) : (
                                <Menu className="h-6 w-6" aria-hidden="true" />
                            )}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Dropdown */}
            {isMenuOpen && (
                <div className="md:hidden bg-white/90 backdrop-blur-md p-4 space-y-4">
                    <Link
                        href="/store"
                        className="block text-lg text-gray-700 hover:text-indigo-600"
                    >
                        Game Store
                    </Link>
                    <Link
                        href="/orders"
                        className="block text-lg text-gray-700 hover:text-indigo-600"
                    >
                        My Orders
                    </Link>
                    <Link
                        href="/wishlist"
                        className="block text-lg text-gray-700 hover:text-indigo-600"
                    >
                        Wishlist
                    </Link>
                    <Link
                        href="/cart"
                        className="block text-lg text-gray-700 hover:text-indigo-600"
                    >
                        Cart
                    </Link>
                    <button
                            onClick={handleLogout}
                            type="button"
                            className="text-white text-base px-3 py-2 rounded-md hover:bg-indigo-700 transition-all"
                        >
                        Logout
                        </button>
                </div>
            )}
        </nav>
    );
};

export default UserNavbar;
