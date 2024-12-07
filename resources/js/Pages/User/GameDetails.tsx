import { useState } from 'react';
import { Head } from '@inertiajs/react';
import UserNavbar from '@/Navbars/UserNavbar';
import { ManagedGame as Game } from '@/types/game';
import AddToWishlistButton from '@/Components/Wishlist/AddToWishlistButton';
import { router } from '@inertiajs/react';
import { Star } from 'lucide-react';

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
                            {/* Header Section */}
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
                                    <div className="space-y-4">
                                        <h1 className="text-3xl font-bold text-gray-900">{game.name}</h1>
                                        
                                        {/* Rating and Release Date */}
                                        <div className="flex items-center space-x-6">
                                            <div className="flex items-center">
                                                <Star className="w-5 h-5 text-yellow-400 fill-current mr-1" />
                                                <span className="text-lg font-semibold">
                                                    {game.rating ? `${game.rating}/5` : 'Not Rated'}
                                                </span>
                                            </div>
                                        </div>

                                        {/* Price and Stock */}
                                        <div className="flex items-center space-x-4">
                                            <span className="text-2xl font-bold text-gray-900">
                                                ${typeof game.price === 'number' 
                                                    ? game.price.toFixed(2) 
                                                    : Number(game.price).toFixed(2)}
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

                                        {/* Game Stats */}
                                        <div className="grid grid-cols-2 gap-4 mt-6">
                                            <div className="flex items-center space-x-2">
                                                <Star className="w-5 h-5 text-gray-400" />
                                                <div>
                                                    <div className="text-sm text-gray-500">Rating</div>
                                                    <div className="font-medium">
                                                        {game.rating ? `${game.rating}/5` : 'Not Rated'}
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <div className="text-sm text-gray-500">Status</div>
                                                <div className="font-medium capitalize">
                                                    {game.status}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Purchase Section */}
                                        {game.quantity > 0 && (
                                            <div className="space-y-4 mt-6">
                                                <div className="space-y-2">
                                                    <div className="flex items-center justify-between">
                                                        <label htmlFor="quantity" className="text-sm font-medium text-gray-700">
                                                            Quantity:
                                                        </label>
                                                        <span className="text-sm text-gray-500">
                                                            Available: {game.quantity} units
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center space-x-2">
                                                        <button
                                                            onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                                            className="p-2 rounded-md border border-gray-300 hover:bg-gray-50"
                                                        >
                                                            -
                                                        </button>
                                                        <input
                                                            type="number"
                                                            id="quantity"
                                                            value={quantity}
                                                            onChange={(e) => {
                                                                const value = parseInt(e.target.value);
                                                                if (!isNaN(value)) {
                                                                    const newQuantity = Math.min(
                                                                        Math.max(1, value),
                                                                        game.quantity
                                                                    );
                                                                    setQuantity(newQuantity);
                                                                }
                                                            }}
                                                            min="1"
                                                            max={game.quantity}
                                                            className="w-20 text-center rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                                        />
                                                        <button
                                                            onClick={() => setQuantity(Math.min(game.quantity, quantity + 1))}
                                                            className="p-2 rounded-md border border-gray-300 hover:bg-gray-50"
                                                        >
                                                            +
                                                        </button>
                                                    </div>
                                                </div>
                                                <button
                                                    onClick={handleAddToCart}
                                                    className="w-full bg-indigo-600 text-white px-6 py-3 rounded-md hover:bg-indigo-700 transition-colors"
                                                >
                                                    Add to Cart
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Additional Details */}
                            <div className="mt-12 space-y-8">
                                {/* Genres */}
                                {game.genres && game.genres.length > 0 && (
                                    <div>
                                        <h3 className="text-xl font-bold text-gray-900 mb-3">Genres</h3>
                                        <div className="flex flex-wrap gap-2">
                                            {game.genres.map((genre: any) => (
                                                <span 
                                                    key={genre.id}
                                                    className="px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800"
                                                >
                                                    {genre.name}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default GameDetails;
