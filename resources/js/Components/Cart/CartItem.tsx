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
                    <h3 className="text-lg font-medium text-white">{game.name}</h3>
                    <p className="text-sm text-gray-100">Price: ${game.price}</p>
                </div>
            </div>

            {/* Quantity Input and Availability */}
            <div className="w-32 flex flex-col items-center">
                <label htmlFor={`quantity-${game.id}`} className="sr-only">Quantity</label>
                <div className="relative">
                    <input
                        type="number"
                        id={`quantity-${game.id}`}
                        name={`quantity-${game.id}`}
                        min="1"
                        max={game.quantity}
                        value={quantity}
                        onChange={handleQuantityChange}
                        className="w-24 px-4 py-2.5 bg-gray-800 border-2 border-gray-600 rounded-lg 
                                 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 
                                 text-white text-center text-lg font-medium
                                 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none 
                                 [&::-webkit-inner-spin-button]:appearance-none
                                 hover:border-gray-500 transition-colors"
                    />
                </div>
                <p className="mt-2 text-sm text-gray-400 font-medium">
                    {game.quantity} {game.quantity === 1 ? 'copy' : 'copies'} available
                </p>
            </div>

            {/* Subtotal */}
            <div className="w-32 text-right">
                <p className="text-lg font-medium text-gray-100">
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
