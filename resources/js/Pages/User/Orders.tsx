import UserNavbar from '@/Navbars/UserNavbar';
import { Head } from '@inertiajs/react';

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
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    return (
        <>
            <Head title="My Orders" />
            <UserNavbar />
            <div className="py-16">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            <h1 className="text-2xl font-bold mb-6">My Orders</h1>
                            {orders.length === 0 ? (
                                <p className="text-gray-500 text-center">No orders found</p>
                            ) : (
                                <div className="space-y-6">
                                    {orders.map((order) => (
                                        <div key={order.id} className="border rounded-lg p-4">
                                            <div className="flex justify-between mb-4">
                                                <div>
                                                    <p className="font-semibold">Ordered on {formatDate(order.created_at)}</p>
                                                    <p className="font-semibold">Order #{order.order_number}</p>
                                                </div>
                                                <div className="text-right">
                                                    <p className="font-semibold">Total: ${order.total}</p>
                                                    <p className="text-sm text-gray-500">Status: {order.status}</p>
                                                </div>
                                            </div>
                                            <div className="space-y-2">
                                                {order.games.map((game) => (
                                                    <div key={game.id} className="flex justify-between">
                                                        <span>{game.name}</span>
                                                        <span>
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
