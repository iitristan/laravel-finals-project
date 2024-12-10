import { useState, useEffect } from 'react';
import UserNavbar from '@/Navbars/UserNavbar';
import { Head, Link, router } from '@inertiajs/react';
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
    const [items, setItems] = useState(cartItems);
    const [cartTotal, setCartTotal] = useState(total);

    useEffect(() => {
        setItems(cartItems);
        setCartTotal(total);
    }, [cartItems, total]);

    const handleRemoveFromCart = (gameId: number) => {
        const updatedItems = items.filter(item => item.game.id !== gameId);
        setItems(updatedItems);

        const newTotal = updatedItems.reduce((sum, item) =>
            sum + item.game.price * item.quantity, 0);
        setCartTotal(newTotal);
    };

    const handleUpdateQuantity = (gameId: number, quantity: number) => {
        const updatedItems = items.map(item => {
            if (item.game.id === gameId) {
                return { ...item, quantity };
            }
            return item;
        });
        setItems(updatedItems);

        const newTotal = updatedItems.reduce((sum, item) =>
            sum + item.game.price * item.quantity, 0);
        setCartTotal(newTotal);

        router.post(`/cart/update/${gameId}`, { quantity }, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const handleRemoveAll = () => {
        if (confirm('Are you sure you want to remove all items from your cart?')) {
            router.post('/cart/remove-all', {}, {
                preserveState: true,
                onSuccess: () => {
                    setItems([]);
                    setCartTotal(0);
                },
            });
        }
    };

    return (
        <>
            <Head title="Cart" />
            <UserNavbar />
            <div className="bg-gray-900 text-white min-h-screen pt-16">
                {/* Hero Section */}
                <div className="bg-gradient-to-r from-indigo-600 to-purple-600 py-12 text-center">
                    <h1 className="text-4xl font-extrabold">Shopping Cart</h1>
                    <p className="text-lg text-gray-200 mt-4">
                        Review your selected games and proceed to checkout.
                    </p>
                </div>

                {/* Cart Content */}
                <div className="max-w-7xl mx-auto py-12 px-6 sm:px-8">
                    <div className="bg-gray-800 rounded-lg shadow-lg overflow-hidden">
                        <div className="p-6">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-2xl font-bold">Your Cart</h2>
                                {items.length > 0 && (
                                    <button
                                        onClick={handleRemoveAll}
                                        className="text-red-400 hover:text-red-300 text-sm font-medium"
                                    >
                                        Remove All
                                    </button>
                                )}
                            </div>

                            {items.length === 0 ? (
                                <div className="text-center py-12">
                                    <p className="text-gray-400 text-lg">Your cart is empty</p>
                                    <Link
                                        href="/store"
                                        className="mt-4 inline-block bg-indigo-600 text-white py-3 px-6 rounded-full hover:bg-indigo-700 transition-all"
                                    >
                                        Continue Shopping
                                    </Link>
                                </div>
                            ) : (
                                <div className="space-y-6 text-white">
                                    {items.map((item) => (
                                        <CartItem
                                            key={item.game.id}
                                            game={item.game}
                                            quantity={item.quantity}
                                            onRemove={handleRemoveFromCart}
                                            onUpdateQuantity={handleUpdateQuantity}
                                        />
                                    ))}

                                    <div className="mt-8 flex justify-between items-center">
                                        <Link
                                            href="/store"
                                            className="text-indigo-400 hover:text-indigo-300"
                                        >
                                            Continue Shopping
                                        </Link>
                                        <button
                                            onClick={() => {
                                                console.log('Starting checkout with items:', items);
                                                router.post('/checkout', {
                                                    cartItems: JSON.stringify(items),
                                                }, {
                                                    onSuccess: () => {
                                                        console.log('Checkout successful');
                                                        router.post('/cart/remove-all', {}, {
                                                            onSuccess: () => {
                                                                setItems([]);
                                                                setCartTotal(0);
                                                                router.visit('/orders');
                                                            },
                                                        });
                                                    },
                                                    onError: (errors) => {
                                                        console.error('Checkout failed:', errors);
                                                        alert('Checkout failed. Please try again.');
                                                    },  
                                                });
                                            }}
                                            className="bg-indigo-600 text-white px-6 py-3 rounded-md hover:bg-indigo-700 transition-colors"
                                            disabled={items.length === 0}
                                        >
                                            Proceed to Checkout
                                        </button>
                                    </div>
                                    <p className="text-right text-lg font-bold mt-4">
                                        Total: ${cartTotal.toFixed(2)}
                                    </p>
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
