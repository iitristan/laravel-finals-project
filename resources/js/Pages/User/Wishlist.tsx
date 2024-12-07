import React from 'react';
import UserNavbar from '@/Navbars/UserNavbar';
import { Head } from '@inertiajs/react';
import WishlistContainer from '@/Components/Wishlist/WishlistContainer';
import { Game } from '@/types';

interface WishlistProps {
    wishlistItems: Game[];
}

const Wishlist: React.FC<WishlistProps> = ({ wishlistItems }) => {
    return (
        <>
            <Head title="Wishlist" />
            <UserNavbar />
            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            <h1 className="text-2xl font-bold mb-4">My Wishlist</h1>
                            <WishlistContainer items={wishlistItems} />
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Wishlist;
