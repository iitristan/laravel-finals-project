import React, { useState } from 'react';
import { Head } from '@inertiajs/react';
import UserNavbar from '@/Navbars/UserNavbar';
import { Game } from '@/types';
import AddToWishlistButton from '@/Components/Wishlist/AddToWishlistButton';
import { router } from '@inertiajs/react';

interface Props {
    game: Game;
}

const GameDetails = ({ game }: Props) => {
    const [quantity, setQuantity] = useState(1);

    const handleAddToCart = () => {
        router.post(route('cart.add', game.id), {
            quantity: quantity
        });
    };

    return (
        <>
            <Head title={game.name} />
            <UserNavbar />
            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                {/* Game Image */}
                                <div className="relative">
                                    <img 
                                        src={game.background_image} 
                                        alt={game.name}
                                        className="w-full rounded-lg shadow-lg"
                                    />
                                    <div className="absolute top-4 right-4">
                                        <AddToWishlistButton 
                                            gameId={game.id}
                                            isInWishlist={game.in_wishlist}
                                            className="bg-white bg-opacity-75 rounded-full p-2 hover:bg-opacity-100"
                                        />
                                    </div>
                                </div>

                                {/* Game Details */}
                                <div className="space-y-6">
                                    <h1 className="text-3xl font-bold text-gray-900">{game.name}</h1>
                                    
                                    <div className="flex items-center space-x-4">
                                        <span className="text-2xl font-bold text-gray-900">
                                            ${game.price}
                                        </span>
                                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                                            game.quantity > 5 
                                                ? 'bg-green-100 text-green-800'
                                                : game.quantity > 0
                                                    ? 'bg-yellow-100 text-yellow-800'
                                                    : 'bg-red-100 text-red-800'
                                        }`}>
                                            {game.quantity > 5 
                                                ? 'In Stock'
                                                : game.quantity > 0
                                                    ? 'Low Stock'
                                                    : 'Out of Stock'
                                            }
                                        </span>
                                    </div>

                                    <div className="space-y-2">
                                        <h3 className="text-lg font-medium text-gray-900">Genres</h3>
                                        <div className="flex flex-wrap gap-2">
                                            {game.genres.map(genre => (
                                                <span 
                                                    key={genre.id}
                                                    className="px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800"
                                                >
                                                    {genre.name}
                                                </span>
                                            ))}
                                        </div>
                                    </div>

                                    {game.quantity > 0 && (
                                        <div className="space-y-4">
                                            <div className="flex items-center space-x-4">
                                                <label htmlFor="quantity" className="text-sm font-medium text-gray-700">
                                                    Quantity:
                                                </label>
                                                <select
                                                    id="quantity"
                                                    value={quantity}
                                                    onChange={(e) => setQuantity(Number(e.target.value))}
                                                    className="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                                >
                                                    {[...Array(Math.min(game.quantity, 10))].map((_, i) => (
                                                        <option key={i + 1} value={i + 1}>
                                                            {i + 1}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>

                                            <button
                                                onClick={handleAddToCart}
                                                className="w-full px-6 py-3 bg-indigo-600 text-white font-medium rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                            >
                                                Add to Cart
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default GameDetails;
