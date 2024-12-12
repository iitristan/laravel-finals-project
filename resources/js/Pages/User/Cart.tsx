import { useState, useEffect } from "react";
import UserNavbar from "@/Navbars/UserNavbar";
import { Head, Link, router } from "@inertiajs/react";
import CartItem from "@/Components/Cart/CartItem";
import { ManagedGame } from "@/types/game";
import { useToast } from "@/Contexts/ToastContext";
import axios from "axios";

interface CartItemType {
    game: ManagedGame;
    quantity: number;
}

interface Props {
    cartItems: CartItemType[];
    total: number;
    flash: {
        success?: string;
        error?: string;
    };
}

const Cart = ({ cartItems = [], total = 0, flash }: Props) => {
    const { showToast } = useToast();
    const [items, setItems] = useState<CartItemType[]>(cartItems);
    const [cartTotal, setCartTotal] = useState<number>(total);

    useEffect(() => {
        setItems(cartItems);
        setCartTotal(total);
    }, [cartItems, total]);

    useEffect(() => {
        if (flash?.success) {
            showToast(flash.success, "success");
        }
        if (flash?.error) {
            showToast(flash.error, "error");
        }
    }, [flash]);

    const handleRemoveFromCart = (gameId: number) => {
        const updatedItems = items.filter((item) => item.game.id !== gameId);
        setItems(updatedItems);

        const newTotal = updatedItems.reduce(
            (sum, item) => sum + item.game.price * item.quantity,
            0
        );
        setCartTotal(newTotal);
    };

    const handleUpdateQuantity = (gameId: number, quantity: number) => {
        const updatedItems = items.map((item) => {
            if (item.game.id === gameId) {
                return { ...item, quantity };
            }
            return item;
        });
        setItems(updatedItems);

        const newTotal = updatedItems.reduce(
            (sum, item) => sum + item.game.price * item.quantity,
            0
        );
        setCartTotal(newTotal);

        router.post(
            `/cart/update/${gameId}`,
            { quantity },
            {
                preserveState: true,
                preserveScroll: true,
            }
        );
    };

    const handleRemoveAll = () => {
        if (
            confirm("Are you sure you want to remove all items from your cart?")
        ) {
            router.post(
                "/cart/remove-all",
                {},
                {
                    preserveState: true,
                    onSuccess: () => {
                        setItems([]);
                        setCartTotal(0);
                    },
                }
            );
        }
    };

    const handleCheckout = () => {
        axios
            .post(
                "/checkout",
                {
                    cartItems: JSON.stringify(items),
                },
                {
                    headers: {
                        Accept: "application/json",
                        "Content-Type": "application/json",
                    },
                }
            )
            .then((response) => {
                showToast(response.data.message, "success");
                router.visit("/orders");
            })
            .catch((error) => {
                console.error("Checkout failed:", error);
                const errorMessage =
                    error.response?.data?.error ||
                    "Checkout failed. Please try again.";
                showToast(errorMessage, "error");
            });
    };

    return (
        <>
            <Head title="Cart" />
            <UserNavbar />
            <div className="bg-gray-900 text-white min-h-screen pt-16">
                <div className="bg-gradient-to-r from-indigo-600 to-purple-600 py-12 text-center">
                    <h1 className="text-4xl font-extrabold">Shopping Cart</h1>
                    <p className="text-lg text-gray-200 mt-4">
                        Review your selected games and proceed to checkout.
                    </p>
                </div>

                <div className="max-w-7xl mx-auto py-12 px-6 sm:px-8">
                    <div className="bg-gray-800 rounded-lg shadow-lg overflow-hidden">
                        <div className="p-6">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-2xl font-bold">
                                    Your Cart
                                </h2>
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
                                    <p className="text-gray-400 text-lg">
                                        Your cart is empty
                                    </p>
                                    <Link
                                        href="/store"
                                        className="mt-4 inline-block bg-indigo-600 text-white py-3 px-6 rounded-full hover:bg-indigo-700 transition-all"
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
                                            onUpdateQuantity={
                                                handleUpdateQuantity
                                            }
                                        />
                                    ))}

                                    <div className="mt-8 flex justify-between items-center">
                                        <Link
                                            href="/store"
                                            className="text-indigo-400 hover:text-indigo-300 transition-colors duration-200 flex items-center gap-2"
                                        >
                                            <svg
                                                className="w-4 h-4"
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M10 19l-7-7m0 0l7-7m-7 7h18"
                                                />
                                            </svg>
                                            Continue Shopping
                                        </Link>
                                        <button
                                            onClick={handleCheckout}
                                            className="bg-indigo-600 text-white px-8 py-3 rounded-lg hover:bg-indigo-700 transition-colors duration-200 font-semibold shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                                            disabled={items.length === 0}
                                        >
                                            Proceed to Checkout
                                            <svg
                                                className="w-4 h-4"
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M14 5l7 7m0 0l-7 7m7-7H3"
                                                />
                                            </svg>
                                        </button>
                                    </div>
                                    <p className="text-right text-xl font-bold mt-6 text-indigo-300">
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
