import { ManagedGame } from '@/types/game';
import { ShoppingCart } from 'lucide-react';
import AddToCartModal from './AddToCartModal';
import { useState } from 'react';

interface Props {
    game: ManagedGame;
    onAddToCart: (gameId: number, quantity: number) => void;
}

export default function StoreGameTableRow({ game, onAddToCart }: Props) {
    const getStockStatus = (quantity: number) => {
        if (quantity <= 0) return { text: 'Out of Stock', color: 'text-red-600' };
        if (quantity <= 5) return { text: 'Low Stock', color: 'text-yellow-600' };
        return { text: 'In Stock', color: 'text-green-600' };
    };

    const stockStatus = getStockStatus(game.quantity);
    const totalStockValue = (game.price * game.quantity).toFixed(2);

    const [isCartModalOpen, setIsCartModalOpen] = useState(false);

    const handleAddToCart = (quantity: number) => {
        onAddToCart(game.id, quantity);
    };

    return (
        <tr>
            <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                    <img 
                        src={game.background_image} 
                        alt={game.name}
                        className="h-10 w-10 rounded-full mr-3"
                    />
                    <div className="text-sm font-medium text-gray-900">
                        {game.name}
                    </div>
                </div>
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900">${game.price}</div>
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
                <div className={`text-sm font-medium ${stockStatus.color}`}>
                    {stockStatus.text}
                    <span className="text-gray-500 text-xs block">
                        ({game.quantity} available)
                    </span>
                </div>
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900">${totalStockValue}</div>
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900">
                    {game.rating ? game.rating.toFixed(1) : 'N/A'}
                </div>
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900">
                    {game.genres ? game.genres.map(g => g.name).join(', ') : 'N/A'}
                </div>
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center space-x-2">
                    <button
                        onClick={() => game.quantity > 0 && setIsCartModalOpen(true)}
                        className={`inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white 
                            ${game.quantity > 0 
                                ? 'bg-indigo-600 hover:bg-indigo-700 focus:ring-indigo-500' 
                                : 'bg-gray-400 cursor-not-allowed'
                            } focus:outline-none focus:ring-2 focus:ring-offset-2`}
                        disabled={game.quantity <= 0}
                        title={game.quantity <= 0 ? 'Out of stock' : 'Add to cart'}
                    >
                        <ShoppingCart className="w-4 h-4 mr-2" />
                        {game.quantity > 0 ? 'Add to Cart' : 'Out of Stock'}
                    </button>
                    
                    <AddToCartModal
                        isOpen={isCartModalOpen}
                        onClose={() => setIsCartModalOpen(false)}
                        onConfirm={handleAddToCart}
                        maxQuantity={game.quantity}
                        gameName={game.name}
                    />
                </div>
            </td>
        </tr>
    );
}
