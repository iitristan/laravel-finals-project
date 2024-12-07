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
        
        // Recalculate total
        const newTotal = updatedItems.reduce((sum, item) => 
            sum + (item.game.price * item.quantity), 0);
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

        // Recalculate total
        const newTotal = updatedItems.reduce((sum, item) => 
            sum + (item.game.price * item.quantity), 0);
        setCartTotal(newTotal);

        router.post(`/cart/update/${gameId}`, {
            quantity
        }, {
            preserveState: true,
            preserveScroll: true
        });
    };

    const handleRemoveAll = () => {
        if (confirm('Are you sure you want to remove all items from your cart?')) {
            router.post('/cart/remove-all', {}, {
                preserveState: true,
                onSuccess: () => {
                    setItems([]);
                    setCartTotal(0);
                }
            });
        }
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
                                <div className="flex items-center gap-4">
                                    <h1 className="text-2xl font-bold">Shopping Cart</h1>
                                    {items.length > 0 && (
                                        <button
                                            onClick={handleRemoveAll}
                                            className="text-red-600 hover:text-red-700 text-sm font-medium"
                                        >
                                            Remove All
                                        </button>
                                    )}
                                </div>
                                <p className="text-lg">
                                    Total: <span className="font-bold">${cartTotal.toFixed(2)}</span>
                                </p>
                            </div>

                            {items.length === 0 ? (
                                <div className="text-center py-12">
                                    <p className="text-gray-500 text-lg">Your cart is empty</p>
                                    <Link
                                        href={route('store')}
                                        className="mt-4 inline-block text-indigo-600 hover:text-indigo-500"
                                    >
                                        Continue Shopping
                                    </Link>
                                </div>
                            ) : (
                                <div className="space-y-6">
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
                                            href={route('store')}
                                            className="text-indigo-600 hover:text-indigo-500"
                                        >
                                            Continue Shopping
                                        </Link>
                                        <button
                                            onClick={() => {
                                                console.log('Starting checkout with items:', items);
                                                router.post(route('checkout'), {
                                                    cartItems: JSON.stringify(items)
                                                }, {
                                                    onSuccess: () => {
                                                        console.log('Checkout successful');
                                                        // Clear cart in backend
                                                        router.post('/cart/remove-all', {}, {
                                                            onSuccess: () => {
                                                                setItems([]);
                                                                setCartTotal(0);
                                                                router.visit(route('orders'));
                                                            }
                                                        });
                                                    },
                                                    onError: (errors) => {
                                                        console.error('Checkout failed:', errors);
                                                        alert('Checkout failed. Please try again.');
                                                    }
                                                });
                                            }}
                                            className="bg-indigo-600 text-white px-6 py-3 rounded-md hover:bg-indigo-700 transition-colors"
                                            disabled={items.length === 0}
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
