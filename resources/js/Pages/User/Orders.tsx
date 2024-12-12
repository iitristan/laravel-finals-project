import UserNavbar from "@/Navbars/UserNavbar";
import { Head } from "@inertiajs/react";

interface Order {
    id: number;
    order_number: string;
    total: number;
    status: string;
    created_at: string;
    games: {
        id: number;
        name: string;
        price: number;
        quantity: number;
    }[];
}

interface Props {
    orders: Order[];
}

const Orders = ({ orders = [] }: Props) => {
    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
        });
    };

    return (
        <>
            <Head title="My Orders" />
            <UserNavbar />
            <div className="bg-gray-900 text-white min-h-screen pt-16">
                {/* Hero Section */}
                <div className="bg-gradient-to-r from-indigo-600 to-purple-600 py-12 text-center">
                    <h1 className="text-4xl font-extrabold">My Orders</h1>
                    <p className="text-lg text-gray-200 mt-4">
                        Review and track your game purchases.
                    </p>
                </div>

                {/* Orders Content */}
                <div className="max-w-7xl mx-auto py-12 px-6 sm:px-8">
                    <div className="bg-gray-800 rounded-lg shadow-lg overflow-hidden">
                        <div className="p-6 text-white">
                            <h2 className="text-2xl font-bold mb-6">Your Orders</h2>
                            {orders.length === 0 ? (
                                <p className="text-center text-gray-400">
                                    No orders found. Start shopping now!
                                </p>
                            ) : (
                                <div className="space-y-6">
                                    {orders.map((order) => (
                                        <div
                                            key={order.id}
                                            className="border border-gray-700 rounded-lg p-6 bg-gray-700"
                                        >
                                            {/* Order Header */}
                                            <div className="flex justify-between items-center mb-4">
                                                <div>
                                                    <p className="font-semibold text-lg">
                                                        Order #{order.order_number}
                                                    </p>
                                                    <p className="text-sm text-gray-400">
                                                        Ordered on {formatDate(order.created_at)}
                                                    </p>
                                                </div>
                                                <div className="text-right">
                                                    <p className="font-semibold text-lg">
                                                        Total: ${order.total.toFixed(2)}
                                                    </p>
                                                    <p
                                                        className={`text-sm ${
                                                            order.status === "Completed"
                                                                ? "text-green-400"
                                                                : "text-yellow-400"
                                                        }`}
                                                    >
                                                        Status: {order.status}
                                                    </p>
                                                </div>
                                            </div>

                                            {/* Games in Order */}
                                            <div className="space-y-2">
                                                {order.games.map((game) => (
                                                    <div
                                                        key={game.id}
                                                        className="flex justify-between items-center text-gray-200"
                                                    >
                                                        <span className="text-sm">{game.name}</span>
                                                        <span className="text-sm">
                                                            {game.quantity} x ${game.price.toFixed(2)}
                                                        </span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Orders;
