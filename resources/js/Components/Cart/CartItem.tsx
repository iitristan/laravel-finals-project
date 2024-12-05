import React from 'react';
import { Trash2 } from 'lucide-react';
import { ManagedGame } from '@/types/game';

interface Props {
    game: ManagedGame;
    quantity: number;
    onRemove: (gameId: number) => void;
    onUpdateQuantity: (gameId: number, quantity: number) => void;
}

export default function CartItem({ game, quantity, onRemove, onUpdateQuantity }: Props) {
    const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newQuantity = parseInt(e.target.value);
        if (!isNaN(newQuantity) && newQuantity > 0 && newQuantity <= game.quantity) {
            onUpdateQuantity(game.id, newQuantity);
        }
    };

    const subtotal = (game.price * quantity).toFixed(2);

    return (
        <div className="flex items-center gap-6 py-5 border-b border-gray-200 last:border-0">
            {/* Game Image and Info */}
            <div className="flex items-center flex-1">
                <img 
                    src={game.background_image} 
                    alt={game.name}
                    className="w-20 h-20 object-cover rounded-lg"
                />
                <div className="ml-4">
                    <h3 className="text-lg font-medium text-gray-900">{game.name}</h3>
                    <p className="text-sm text-gray-500">Price: ${game.price}</p>
                </div>
            </div>

            {/* Quantity Input */}
            <div className="w-32">
                <label htmlFor={`quantity-${game.id}`} className="sr-only">Quantity</label>
                <input
                    type="number"
                    id={`quantity-${game.id}`}
                    name={`quantity-${game.id}`}
                    min="1"
                    max={game.quantity}
                    value={quantity}
                    onChange={handleQuantityChange}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
                <p className="mt-1 text-sm text-gray-500">
                    {game.quantity} available
                </p>
            </div>

            {/* Subtotal */}
            <div className="w-32 text-right">
                <p className="text-lg font-medium text-gray-900">${subtotal}</p>
            </div>

            {/* Remove Button */}
            <button
                onClick={() => onRemove(game.id)}
                className="text-gray-400 hover:text-red-500 transition-colors"
                title="Remove from cart"
            >
                <Trash2 className="w-5 h-5" />
            </button>
        </div>
    );
}
