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
            Review your past purchases and track order details.
        </p>
    </div>

    <div className="max-w-7xl mx-auto py-12 px-6 sm:px-8">
        <div className="bg-gray-800 rounded-lg shadow-lg overflow-hidden">
            <div className="p-6">
                <h2 className="text-2xl font-bold mb-6 text-white">
                    Order History
                </h2>
                {orders.length === 0 ? (
                    <p className="text-gray-400 text-center text-lg">
                        No orders found.
                    </p>
                ) : (
                    <div className="space-y-8">
                        {orders.map((order) => (
                            <div
                                key={order.id}
                                className="border border-gray-700 rounded-lg bg-gray-700 p-6 hover:shadow-md transition-shadow"
                            >
                                <div className="flex justify-between items-center mb-4">
                                    <div>
                                        <p className="text-indigo-300 font-medium">
                                            Ordered on {formatDate(order.created_at)}
                                        </p>
                                        <p className="text-white font-bold">
                                            Order #{order.order_number}
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-lg text-indigo-200 font-bold">
                                            Total: ${order.total}
                                        </p>
                                        <p className="text-gray-400">
                                            Status: {order.status}
                                        </p>
                                    </div>
                                </div>
                                <div className="divide-y divide-gray-600">
                                    {order.games.map((game) => (
                                        <div
                                            key={game.id}
                                            className="flex justify-between py-3"
                                        >
                                            <span className="text-gray-300">
                                                {game.name}
                                            </span>
                                            <span className="text-gray-400">
                                                {game.quantity} x ${game.price}
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
