import { ManagedGame } from '@/types/game';
import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, ShoppingCart, Star } from 'lucide-react';
import AddToCartModal from './AddToCartModal';

interface Props {
    games?: ManagedGame[];
    onAddToCart: (gameId: number, quantity: number) => void;
}

export default function GameStore({ games = [], onAddToCart }: Props) {
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedGame, setSelectedGame] = useState<ManagedGame | null>(null);
    const [isCartModalOpen, setIsCartModalOpen] = useState(false);
    
    const gamesPerPage = 12; // Adjusted for grid layout
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

    return (
        <div className="space-y-6">
            {/* Game Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {currentGames.map((game) => {
                    const stockStatus = getStockStatus(game.quantity);
                    
                    return (
                        <div 
                            key={game.id}
                            className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
                        >
                            {/* Game Image */}
                            <div className="relative h-48 bg-gray-200">
                                <img 
                                    src={game.background_image} 
                                    alt={game.name}
                                    className="w-full h-full object-cover"
                                />
                                <div className="absolute top-2 left-2">
                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-800 text-white">
                                        {game.genres.join(', ')}
                                    </span>
                                </div>
                            </div>

                            {/* Game Details */}
                            <div className="p-4 space-y-3">
                                <div className="flex justify-between items-start">
                                    <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">
                                        {game.name}
                                    </h3>
                                    <div className="flex items-center">
                                        <Star className="w-4 h-4 text-yellow-400 fill-current" />
                                        <span className="ml-1 text-sm text-gray-600">
                                            {game.rating}
                                        </span>
                                    </div>
                                </div>

                                <div className="flex justify-between items-center">
                                    <div>
                                        <div className="text-xl font-bold text-gray-900">
                                            ${game.price}
                                        </div>
                                    </div>
                                    
                                    <button
                                        onClick={() => {
                                            setSelectedGame(game);
                                            setIsCartModalOpen(true);
                                        }}
                                        disabled={game.quantity <= 0}
                                        className={`inline-flex items-center px-4 py-2 rounded-md text-sm font-medium
                                            ${game.quantity > 0 
                                                ? 'bg-indigo-600 text-white hover:bg-indigo-700' 
                                                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                            } transition-colors duration-200`}
                                    >
                                        <ShoppingCart className="w-4 h-4 mr-2" />
                                        Add to Cart
                                    </button>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="flex justify-center items-center space-x-4 mt-6">
                    <button
                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                        disabled={currentPage === 1}
                        className="p-2 rounded-full hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <ChevronLeft className="w-5 h-5" />
                    </button>
                    
                    <span className="text-sm text-gray-600">
                        Page {currentPage} of {totalPages}
                    </span>
                    
                    <button
                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                        disabled={currentPage === totalPages}
                        className="p-2 rounded-full hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <ChevronRight className="w-5 h-5" />
                    </button>
                </div>
            )}

            {/* Add to Cart Modal */}
            {selectedGame && (
                <AddToCartModal
                    isOpen={isCartModalOpen}
                    onClose={() => {
                        setIsCartModalOpen(false);
                        setSelectedGame(null);
                    }}
                    onConfirm={handleAddToCart}
                    game={selectedGame}
                />
            )}
        </div>
    );
}
