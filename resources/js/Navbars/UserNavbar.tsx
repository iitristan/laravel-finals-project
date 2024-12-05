import { Link } from '@inertiajs/react';

const UserNavbar = () => {
    return (
        <nav className="bg-white shadow-lg">
            <div className="max-w-7xl mx-auto px-4">
                <div className="flex justify-between h-16">
                    <div className="flex space-x-7">
                        <div className="flex items-center">
                            <Link href="/" className="text-2xl font-bold text-gray-800">
                                GameHub
                            </Link>
                        </div>
                        <div className="hidden md:flex items-center space-x-4">
                            <Link 
                                href={route('dashboard')} 
                                className="py-4 px-2 text-gray-700 hover:text-blue-500 transition duration-300"
                            >
                                User Dashboard
                            </Link>
                            <Link 
                                href={route('store')} 
                                className="py-4 px-2 text-gray-700 hover:text-blue-500 transition duration-300"
                            >
                                Game Store
                            </Link>
                            <Link 
                                href={route('orders')} 
                                className="py-4 px-2 text-gray-700 hover:text-blue-500 transition duration-300"
                            >
                                My Orders
                            </Link>
                            <Link 
                                href={route('wishlist')} 
                                className="py-4 px-2 text-gray-700 hover:text-blue-500 transition duration-300"
                            >
                                Wishlist
                            </Link>
                            <Link 
                                href={route('cart.index')} 
                                className="py-4 px-2 text-gray-700 hover:text-blue-500 transition duration-300"
                            >
                                Cart
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default UserNavbar;
