import React from 'react';
import UserNavbar from '@/Navbars/UserNavbar';
import { Head, router } from '@inertiajs/react';
import CartItem from '@/Components/Cart/CartItem';
import { ManagedGame } from '@/types/game';

interface CartItemType {
    game: ManagedGame;
    quantity: number;
}

interface Props {
    cartItems: CartItemType[];
    total: number;
}

const Cart = ({ cartItems = [], total = 0 }: Props) => {
    const handleRemoveFromCart = (gameId: number) => {
        router.delete(`/cart/remove/${gameId}`, {
            preserveScroll: true,
        });
    };

    const handleUpdateQuantity = (gameId: number, quantity: number) => {
        router.post(`/cart/update/${gameId}`, {
            quantity
        }, {
            preserveScroll: true,
        });
    };

    const handleCheckout = () => {
        router.post('/checkout', {}, {
            preserveScroll: true,
        });
    };

    return (
        <>
            <Head title="Cart" />
            <UserNavbar />
            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            <div className="flex justify-between items-center mb-6">
                                <h1 className="text-2xl font-bold">Shopping Cart</h1>
                                <p className="text-lg">
                                    Total: <span className="font-bold">${total.toFixed(2)}</span>
                                </p>
                            </div>

                            {cartItems.length === 0 ? (
                                <div className="text-center py-12">
                                    <p className="text-gray-500 text-lg">Your cart is empty</p>
                                </div>
                            ) : (
                                <div className="space-y-6">
                                    {/* Cart Items */}
                                    <div className="divide-y divide-gray-200">
                                        {cartItems.map((item) => (
                                            <CartItem
                                                key={item.game.id}
                                                game={item.game}
                                                quantity={item.quantity}
                                                onRemove={handleRemoveFromCart}
                                                onUpdateQuantity={handleUpdateQuantity}
                                            />
                                        ))}
                                    </div>

                                    {/* Checkout Button */}
                                    <div className="mt-8 flex justify-end">
                                        <button
                                            onClick={handleCheckout}
                                            className="bg-indigo-600 text-white px-6 py-3 rounded-md hover:bg-indigo-700 transition-colors"
                                        >
                                            Proceed to Checkout
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Cart;
