import { useState, useEffect } from 'react';
import { X, MinusCircle, PlusCircle } from 'lucide-react';
import { ManagedGame } from '@/types/game';

interface Props {
    isOpen: boolean;
    onClose: () => void;
    onAddToCart: (quantity: number) => void;
    game?: ManagedGame | null;
}

export default function AddToCartModal({ isOpen, onClose, onAddToCart, game }: Props) {
    const [quantity, setQuantity] = useState(1);

    useEffect(() => {
        if (isOpen) {
            setQuantity(1); // Reset quantity when modal opens
        }
    }, [isOpen]);

    const handleIncrement = () => {
        if (game && quantity < game.quantity) {
            setQuantity(prev => prev + 1);
        }
    };

    const handleDecrement = () => {
        if (quantity > 1) {
            setQuantity(prev => prev - 1);
        }
    };

    const handleConfirm = () => {
        onAddToCart(quantity);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
                <div className="p-6 space-y-6">
                    {/* Header */}
                    <div className="flex justify-between items-center">
                        <h3 className="text-lg font-medium text-gray-900">
                            Add {game?.name} to Cart
                        </h3>
                        <button
                            onClick={onClose}
                            className="text-gray-400 hover:text-gray-500"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Content */}
                    <div className="flex flex-col items-center space-y-4">
                        <p className="text-sm text-gray-500">
                            Available Stock: <span className="font-medium">{game?.quantity}</span>
                        </p>
                        
                        <div className="flex items-center space-x-4">
                            <button
                                onClick={handleDecrement}
                                disabled={quantity <= 1}
                                className="text-gray-500 hover:text-gray-700 disabled:opacity-50"
                            >
                                <MinusCircle className="w-6 h-6" />
                            </button>
                            
                            <span className="text-lg font-medium w-12 text-center">
                                {quantity}
                            </span>
                            
                            <button
                                onClick={handleIncrement}
                                disabled={!game || quantity >= game.quantity}
                                className="text-gray-500 hover:text-gray-700 disabled:opacity-50"
                            >
                                <PlusCircle className="w-6 h-6" />
                            </button>
                        </div>

                        <p className="text-sm font-medium text-gray-900">
                            Total: ${((game?.price || 0) * quantity).toFixed(2)}
                        </p>
                    </div>

                    {/* Footer */}
                    <div className="flex justify-end space-x-3 pt-4">
                        <button
                            onClick={onClose}
                            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleConfirm}
                            className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-md"
                        >
                            Add to Cart
                        </button>
                    </div>
                </div>
        </div>
    );
}
