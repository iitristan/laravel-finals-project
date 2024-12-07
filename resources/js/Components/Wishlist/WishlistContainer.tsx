import React from 'react';
import WishlistItem from './WishlistItem';
import { Game } from '@/types';
import { Link } from '@inertiajs/react';

interface WishlistContainerProps {
    items: Game[];
}

const WishlistContainer: React.FC<WishlistContainerProps> = ({ items }) => {
    if (items.length === 0) {
        return (
            <div className="text-center py-8">
                <p className="text-gray-600 text-lg">Your wishlist is empty</p>
                <Link 
                    href={route('store')} 
                    className="mt-4 inline-block px-6 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition"
                >
                    Browse Games
                </Link>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {items.map((game) => (
                <WishlistItem
                    key={game.id}
                    game={game}
                />
            ))}
        </div>
    );
};

export default WishlistContainer;
