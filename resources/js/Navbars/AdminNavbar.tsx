import React from 'react';
import { Link } from '@inertiajs/react';
import route from 'ziggy-js';

const AdminNavbar: React.FC = () => {
    return (
        <nav className="bg-gray-800 text-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <div className="flex items-center">
                        <div className="flex-shrink-0">
                            <span className="text-xl font-bold">Admin Panel</span>
                        </div>
                        <div className="hidden md:block">
                            <div className="ml-10 flex items-baseline space-x-4">
                                <Link
                                    href={route('admin.dashboard')}
                                    className="px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-700"
                                >
                                    Dashboard
                                </Link>
                                <Link
                                    href={route('admin.games')}
                                    className="px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-700"
                                >
                                    Manage Games
                                </Link>
                                <Link
                                    href={route('admin.orders.index')}
                                    className="px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-700"
                                >
                                    Manage Orders
                                </Link>
                                <Link
                                    href={route('admin.users')}
                                    className="px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-700"
                                >
                                    Manage Users
                                </Link>
                            </div>
                        </div>
                    </div>
                    <div className="hidden md:block">
                        <div className="ml-4 flex items-center md:ml-6">
                            <Link
                                href={route('admin.logout')}
                                method="post"
                                as="button"
                                className="px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-700"
                            >
                                Logout
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    );
}

export default AdminNavbar;

