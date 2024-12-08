import React from 'react';
import UserNavbar from '@/Navbars/UserNavbar';
import { Head } from '@inertiajs/react';
import WishlistContainer from '@/Components/Wishlist/WishlistContainer';
import { ManagedGame as Game } from '@/types/game';

interface WishlistProps {
    wishlistItems: Game[];
}

const Wishlist: React.FC<WishlistProps> = ({ wishlistItems }) => {
    return (
        <>
            <Head title="Wishlist" />
            <UserNavbar />
            <div className="bg-gray-900 text-white min-h-screen pt-16">
                {/* Hero Section */}
                <div className="bg-gradient-to-r from-indigo-600 to-purple-600 py-12 text-center">
                    <h1 className="text-4xl font-extrabold">My Wishlist</h1>
                    <p className="text-lg text-gray-200 mt-4">
                        Save your favorite games and revisit them anytime.
                    </p>
                </div>

                {/* Wishlist Content */}
                <div className="max-w-7xl mx-auto py-12 px-6 sm:px-8">
                    <div className="bg-gray-800 rounded-lg shadow-lg overflow-hidden">
                        <div className="p-6 text-white">
                            <h2 className="text-2xl font-bold mb-6">Games in Your Wishlist</h2>
                            <WishlistContainer items={wishlistItems} />
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Wishlist;
