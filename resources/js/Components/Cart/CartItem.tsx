import React, { useState } from 'react';
import { Trash2 } from 'lucide-react';
import { ManagedGame } from '@/types/game';
import { router } from '@inertiajs/react';

interface Props {
    game: ManagedGame;
    quantity: number;
    onRemove: (gameId: number) => void;
    onUpdateQuantity: (gameId: number, quantity: number) => void;
}

export default function CartItem({ game, quantity, onRemove, onUpdateQuantity }: Props) {
    const [isRemoving, setIsRemoving] = useState(false);

    const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newQuantity = parseInt(e.target.value);
        if (!isNaN(newQuantity) && newQuantity > 0 && newQuantity <= game.quantity) {
            onUpdateQuantity(game.id, newQuantity);
        }
    };

    const handleRemove = () => {
        if (confirm('Are you sure you want to remove this item from your cart?')) {
            setIsRemoving(true);
            onRemove(game.id); // Immediately update UI
            
            router.post(`/cart/remove/${game.id}`, {}, {
                preserveState: true,
                onError: () => {
                    setIsRemoving(false);
                    alert('Failed to remove item. Please try again.');
                }
            });
        }
    };

    if (isRemoving) {
        return null; // Don't render if being removed
    }

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
                <p className="text-lg font-medium text-gray-900">
                    ${(game.price * quantity).toFixed(2)}
                </p>
            </div>

            {/* Remove Button */}
            <button
                onClick={handleRemove}
                className="text-gray-400 hover:text-red-500 transition-colors p-2 rounded-full hover:bg-red-50"
                title="Remove from cart"
            >
                <Trash2 className="w-5 h-5" />
            </button>
        </div>
    );
}
