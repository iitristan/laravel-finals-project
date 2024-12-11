import React, { useState } from 'react';
import { router } from '@inertiajs/react';

interface AddToWishlistButtonProps {
    gameId: number;
    isInWishlist?: boolean;
    className?: string;
    showText?: boolean;
}

const AddToWishlistButton: React.FC<AddToWishlistButtonProps> = ({ 
    gameId, 
    isInWishlist = false,
    className = '',
    showText = false
}) => {
    const [inWishlist, setInWishlist] = useState(isInWishlist);
    const [isLoading, setIsLoading] = useState(false);

    const handleToggleWishlist = () => {
        if (inWishlist) {
            return; // Do nothing if already in wishlist
        }

        setIsLoading(true);
        router.post(`/wishlist/${gameId}/add`, {}, {
            preserveScroll: true,
            preserveState: true,
            onSuccess: () => {
                setInWishlist(true);
                setIsLoading(false);
            },
            onError: () => setIsLoading(false),
        });
    };

    return (
        <button
            onClick={handleToggleWishlist}
            disabled={isLoading || inWishlist}
            className={`flex items-center space-x-2 ${
                inWishlist 
                    ? 'text-yellow-500' 
                    : 'text-gray-400 hover:text-gray-500'
            } transition-colors ${className}`}
            title={inWishlist ? 'In Wishlist' : 'Add to Wishlist'}
        >
            <svg
                xmlns="http://www.w3.org/2000/svg"
                className={`h-6 w-6 ${isLoading ? 'animate-pulse' : ''}`}
                fill={inWishlist ? 'currentColor' : 'none'}
                viewBox="0 0 24 24"
                stroke="currentColor"
            >
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                />
            </svg>
            {showText && (
                <span>{inWishlist ? 'In Wishlist' : 'Add to Wishlist'}</span>
            )}
        </button>
    );
};

export default AddToWishlistButton;
