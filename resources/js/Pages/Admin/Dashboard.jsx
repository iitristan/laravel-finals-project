import React from 'react';
import { Head } from '@inertiajs/react';
import AdminNavbar from '@/Components/AdminNavbar';

export default function Dashboard() {
    return (
        <>
            <Head title="Admin Dashboard" />
            <AdminNavbar />
            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            <h1 className="text-2xl font-semibold mb-6">Dashboard</h1>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                <div className="bg-blue-100 p-4 rounded-lg">
                                    <h2 className="text-lg font-semibold mb-2">Total Games</h2>
                                    <p className="text-3xl font-bold">0</p>
                                </div>
                                
                                <div className="bg-green-100 p-4 rounded-lg">
                                    <h2 className="text-lg font-semibold mb-2">Total Orders</h2>
                                    <p className="text-3xl font-bold">0</p>
                                </div>
                                
                                <div className="bg-yellow-100 p-4 rounded-lg">
                                    <h2 className="text-lg font-semibold mb-2">Total Users</h2>
                                    <p className="text-3xl font-bold">0</p>
                                </div>
                                
                                <div className="bg-purple-100 p-4 rounded-lg">
                                    <h2 className="text-lg font-semibold mb-2">Total Revenue</h2>
                                    <p className="text-3xl font-bold">$0</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
