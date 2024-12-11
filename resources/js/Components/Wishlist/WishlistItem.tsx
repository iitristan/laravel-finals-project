import React from 'react';
import { Game } from '@/types';
import { Link, router } from '@inertiajs/react';
import AddToWishlistButton from './AddToWishlistButton';
import { useToast } from '@/Contexts/ToastContext';

interface WishlistItemProps {
    game: Game;
}

const WishlistItem: React.FC<WishlistItemProps> = ({ game }) => {
    const { showToast } = useToast();

    const handleAddToCart = () => {
        router.post(`/cart/add/${game.id}`, {
            quantity: 1,
        }, {
            preserveState: true,
            onSuccess: () => {
                showToast(`${game.name} added to cart`, 'success');
            },
            onError: () => {
                showToast('Failed to add to cart', 'error');
            }
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
                        href={`/games/${game.id}`}
                        className="text-lg font-semibold text-white hover:text-indigo-600"
                    >
                        {game.name}
                    </Link>
                    <p className="text-gray-100">${game.price}</p>
                    <div className="text-sm text-gray-100">
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
