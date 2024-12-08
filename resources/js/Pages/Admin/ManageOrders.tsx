import AdminNavbar from '@/Navbars/AdminNavbar';
import { Head, useForm } from '@inertiajs/react';
import axios from 'axios';

interface Game {
    id: number;
    name: string;
    price: number;
    quantity: number;
}

interface User {
    id: number;
    name: string;
}

interface Order {
    id: number;
    total: number;
    status: string;
    created_at: string;
    user: User;
    games: Game[];
}

interface Props {
    orders: Order[];
}

export default function ManageOrders({ orders = [] }: Props) {
    const { post, processing } = useForm();

    const updateOrderStatus = (orderId: number, newStatus: string) => {
        axios.post(route('admin.orders.update-status', orderId), {
            status: newStatus,
        }, {
            headers: {
                'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content')
            }
        }).then(() => {
            window.location.reload();
        }).catch((error) => {
            console.error('Failed to update:', error);
        });
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'to be packed':
                return 'text-yellow-500';
            case 'to be shipped':
                return 'text-blue-500';
            case 'shipped':
                return 'text-green-500';
            default:
                return 'text-gray-500';
        }
    };

    return (
        <>
            <Head title="Manage Orders" />
            <AdminNavbar />
            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            <h1 className="text-2xl font-bold mb-6">Manage Orders</h1>
                            {orders.length === 0 ? (
                                <p className="text-gray-500 text-center">No orders found</p>
                            ) : (
                                <div className="space-y-6">
                                    {orders.map((order) => (
                                        <div key={order.id} className="border rounded-lg p-4">
                                            <div className="flex justify-between mb-4">
                                                <div>
                                                    <p className="font-semibold">Order #{order.id}</p>
                                                    <p className="text-sm text-gray-500">
                                                        Customer: {order.user.name}
                                                    </p>
                                                    <p className="text-sm text-gray-500">
                                                        Date: {new Date(order.created_at).toLocaleDateString()}
                                                    </p>
                                                </div>
                                                <div className="text-right">
                                                    <p className="font-semibold">Total: ${order.total}</p>
                                                    <p className={`text-sm ${getStatusColor(order.status)}`}>
                                                        Status: {order.status}
                                                    </p>
                                                    <div className="mt-2 space-x-2">
                                                        {order.status === 'to be packed' && (
                                                            <button
                                                                onClick={() => updateOrderStatus(order.id, 'to be shipped')}
                                                                disabled={processing}
                                                                className="bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600 transition"
                                                            >
                                                                Mark as To Be Shipped
                                                            </button>
                                                        )}
                                                        {order.status === 'to be shipped' && (
                                                            <button
                                                                onClick={() => updateOrderStatus(order.id, 'shipped')}
                                                                disabled={processing}
                                                                className="bg-green-500 text-white px-3 py-1 rounded text-sm hover:bg-green-600 transition"
                                                            >
                                                                Mark as Shipped
                                                            </button>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="mt-4">
                                                <h3 className="font-semibold mb-2">Order Items:</h3>
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
}
