import React, { useState } from 'react';
import { Trash2 } from 'lucide-react';
import { ManagedGame } from '@/types/game';
import { router } from '@inertiajs/react';
import { useToast } from '@/Contexts/ToastContext';

interface Props {
    game: ManagedGame;
    quantity: number;
    onRemove: (gameId: number) => void;
    onUpdateQuantity: (gameId: number, quantity: number) => void;
}

export default function CartItem({ game, quantity, onRemove, onUpdateQuantity }: Props) {
    const [isRemoving, setIsRemoving] = useState(false);
    const { showToast } = useToast();

    const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newQuantity = parseInt(e.target.value);
        if (!isNaN(newQuantity) && newQuantity > 0 && newQuantity <= game.quantity) {
            onUpdateQuantity(game.id, newQuantity);
            showToast(`Updated ${game.name} quantity to ${newQuantity}`, 'success');
        } else if (newQuantity > game.quantity) {
            showToast(`Only ${game.quantity} copies available`, 'error');
        } else if (newQuantity < 1) {
            showToast('Quantity must be at least 1', 'error');
        }
    };

    const handleRemove = () => {
        if (confirm('Are you sure you want to remove this item from your cart?')) {
            setIsRemoving(true);
            onRemove(game.id); // Immediately update UI
            
            router.post(`/cart/remove/${game.id}`, {}, {
                preserveState: true,
                onSuccess: () => {
                    showToast(`${game.name} removed from cart`, 'success');
                },
                onError: () => {
                    setIsRemoving(false);
                    showToast('Failed to remove item. Please try again.', 'error');
                }
            });
        }
    };

    if (isRemoving) {
        return null; // Don't render if being removed
    }

    return (
        <div className="flex items-center gap-8 py-4 border-b border-gray-700/50 last:border-0 
                      group hover:bg-gray-800/30 transition-colors rounded-lg px-6 min-h-[120px]">
            {/* Game Image and Info */}
            <div className="flex items-center flex-1 gap-6">
                <img 
                    src={game.background_image} 
                    alt={game.name}
                    className="w-20 h-20 object-cover rounded-lg shadow-lg hover:scale-105 transition-transform"
                />
                <div>
                    <h3 className="text-lg font-semibold text-white group-hover:text-indigo-400 transition-colors">{game.name}</h3>
                    <p className="text-sm text-gray-400 mt-0.5">Price: ${game.price}</p>
                </div>
            </div>

            {/* Quantity Input and Availability */}
            <div className="w-36 flex flex-col items-center">
                <div className="relative">
                    <input
                        type="number"
                        id={`quantity-${game.id}`}
                        name={`quantity-${game.id}`}
                        min="1"
                        max={game.quantity}
                        value={quantity}
                        onChange={handleQuantityChange}
                        className="w-24 px-3 py-2 bg-gray-800/80 border-2 border-gray-600 rounded-lg 
                                 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 
                                 text-white text-center text-base font-medium
                                 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none 
                                 [&::-webkit-inner-spin-button]:appearance-none
                                 hover:border-indigo-400 transition-all shadow-sm"
                    />
                </div>
                <p className="mt-1.5 text-xs text-gray-400 font-medium">
                    {game.quantity} {game.quantity === 1 ? 'copy' : 'copies'} available
                </p>
            </div>

            {/* Subtotal */}
            <div className="w-28 text-right">
                <p className="text-lg font-semibold text-white group-hover:text-indigo-400 transition-colors">
                    ${(game.price * quantity).toFixed(2)}
                </p>
            </div>

            {/* Remove Button */}
            <button
                onClick={handleRemove}
                className="text-gray-400 hover:text-red-400 transition-colors p-2 rounded-full
                         hover:bg-red-950/30 hover:scale-110 transform active:scale-95"
                title="Remove from cart"
            >
                <Trash2 className="w-4.5 h-4.5" />
            </button>
        </div>
    );
}
