import { ManagedGame } from '@/types/game';
import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, ShoppingCart, Star } from 'lucide-react';
import AddToCartModal from './AddToCartModal';
import { Link, router } from '@inertiajs/react';

interface Props {
    games?: ManagedGame[];
    onAddToCart: (gameId: number, quantity: number) => void;
}

export default function GameStore({ games = [], onAddToCart }: Props) {
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedGame, setSelectedGame] = useState<ManagedGame | null>(null);
    const [isCartModalOpen, setIsCartModalOpen] = useState(false);
    const [wishlistStates, setWishlistStates] = useState<{ [key: number]: boolean }>({});
    
    useEffect(() => {
        // Initialize wishlist states from games
        const initialStates = games.reduce((acc, game) => {
            acc[game.id] = game.in_wishlist || false;
            return acc;
        }, {} as { [key: number]: boolean });
        setWishlistStates(initialStates);
    }, [games]);

    const gamesPerPage = 12;
    const indexOfLastGame = currentPage * gamesPerPage;
    const indexOfFirstGame = indexOfLastGame - gamesPerPage;
    const currentGames = games.slice(indexOfFirstGame, indexOfLastGame);
    const totalPages = Math.ceil(games.length / gamesPerPage);

    useEffect(() => {
        setCurrentPage(1);
    }, [games.length]);

    const getStockStatus = (quantity: number) => {
        if (quantity <= 0) return { text: 'Out of Stock', color: 'text-red-600' };
        if (quantity <= 5) return { text: 'Low Stock', color: 'text-yellow-600' };
        return { text: 'In Stock', color: 'text-green-600' };
    };

    const handleAddToCart = (quantity: number) => {
        if (selectedGame) {
            onAddToCart(selectedGame.id, quantity);
            setIsCartModalOpen(false);
            setSelectedGame(null);
        }
    };

    const handleToggleWishlist = (gameId: number) => {
        const isInWishlist = wishlistStates[gameId];
        const endpoint = isInWishlist ? `/wishlist/${gameId}/remove` : `/wishlist/${gameId}/add`;
        
        router.post(endpoint, {}, {
            preserveScroll: true,
            preserveState: true,
            onSuccess: () => {
                setWishlistStates(prev => ({
                    ...prev,
                    [gameId]: !isInWishlist
                }));
            }
        });
    };

    return (
        <div className="space-y-6">
            {/* Game Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {currentGames.map((game) => {
                    const stockStatus = getStockStatus(game.quantity);
                    const isInWishlist = wishlistStates[game.id] || false;
                    
                    return (
                        <div 
                            key={game.id}
                            className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
                        >
                            <Link href={`/games/${game.id}`}>
                                <div className="relative">
                                    <img 
                                        src={game.background_image} 
                                        alt={game.name}
                                        className="w-full h-48 object-cover"
                                    />
                                    <button
                                        onClick={(e) => {
                                            e.preventDefault();
                                            handleToggleWishlist(game.id);
                                        }}
                                        className={`absolute top-2 right-2 p-2 rounded-full bg-white bg-opacity-75 hover:bg-opacity-100 transition-all ${
                                            isInWishlist ? 'text-yellow-500' : 'text-gray-400'
                                        }`}
                                    >
                                        <Star className={`w-5 h-5 ${isInWishlist ? 'fill-current' : ''}`} />
                                    </button>
                                </div>
                                <div className="p-4">
                                    <div className="flex justify-between items-start">
                                        <h3 className="text-lg font-semibold text-gray-900 hover:text-indigo-600 transition-colors">
                                            {game.name}
                                        </h3>
                                        <div className="flex items-center">
                                            <Star className="w-4 h-4 text-yellow-400 fill-current" />
                                            <span className="ml-1 text-sm text-gray-600">
                                                {game.rating}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="mt-2 flex justify-between items-center">
                                        <span className="text-lg font-bold text-gray-900">
                                            ${game.price}
                                        </span>
                                        <span className={`text-sm ${stockStatus.color}`}>
                                            {stockStatus.text}
                                        </span>
                                    </div>
                                </div>
                            </Link>
                            <div className="px-4 pb-4">
                                <button
                                    onClick={() => {
                                        setSelectedGame(game);
                                        setIsCartModalOpen(true);
                                    }}
                                    className="w-full flex items-center justify-center space-x-2 bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 transition-colors disabled:bg-gray-400"
                                    disabled={game.quantity <= 0}
                                >
                                    <ShoppingCart className="w-5 h-5" />
                                    <span>Add to Cart</span>
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="flex justify-center items-center space-x-4 mt-8">
                    <button
                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                        disabled={currentPage === 1}
                        className="p-2 rounded-full hover:bg-gray-100 disabled:opacity-50 disabled:hover:bg-transparent"
                    >
                        <ChevronLeft className="w-6 h-6" />
                    </button>
                    <span className="text-gray-700">
                        Page {currentPage} of {totalPages}
                    </span>
                    <button
                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                        disabled={currentPage === totalPages}
                        className="p-2 rounded-full hover:bg-gray-100 disabled:opacity-50 disabled:hover:bg-transparent"
                    >
                        <ChevronRight className="w-6 h-6" />
                    </button>
                </div>
            )}

            {/* Add to Cart Modal */}
            <AddToCartModal
                isOpen={isCartModalOpen}
                onClose={() => {
                    setIsCartModalOpen(false);
                    setSelectedGame(null);
                }}
                onAddToCart={handleAddToCart}
                game={selectedGame}
            />
        </div>
    );
}
