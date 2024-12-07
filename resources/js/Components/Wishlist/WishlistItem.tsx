import React from 'react';
import { Game } from '@/types';
import { Link } from '@inertiajs/react';
import { router } from '@inertiajs/react';
import AddToWishlistButton from './AddToWishlistButton';

interface WishlistItemProps {
    game: Game;
}

const WishlistItem: React.FC<WishlistItemProps> = ({ game }) => {
    const handleAddToCart = () => {
        router.post(route('cart.add', game.id), {
            quantity: 1,
        });
    };

    return (
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <div className="flex items-center space-x-4">
                <img 
                    src={game.background_image} 
                    alt={game.name} 
                    className="w-24 h-24 object-cover rounded"
                />
                <div>
                    <Link 
                        href={route('games.show', game.id)} 
                        className="text-lg font-semibold text-gray-900 hover:text-indigo-600"
                    >
                        {game.name}
                    </Link>
                    <p className="text-gray-600">${game.price}</p>
                    <div className="text-sm text-gray-500">
                        {game.genres.map(genre => genre.name).join(', ')}
                    </div>
                </div>
            </div>
            <div className="flex items-center space-x-4">
                <button
                    onClick={handleAddToCart}
                    className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition"
                    disabled={game.quantity <= 0}
                >
                    Add to Cart
                </button>
                <AddToWishlistButton 
                    gameId={game.id} 
                    isInWishlist={true}
                    showText={false}
                />
            </div>
        </div>
    );
};

export default WishlistItem;
