import { useForm } from '@inertiajs/inertia-react';

export default function Dashboard() {
    const { post } = useForm();

    const handleLogout = () => {
        post('/logout');
    };

    return (
        <div className="min-h-screen bg-gray-100">
            <nav className="bg-white shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16">
                        <div className="flex items-center">
                            <h1 className="text-xl font-semibold">Dashboard</h1>
                        </div>
                        <div className="flex items-center">
                            <button
                                onClick={handleLogout}
                                className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 focus:outline-none"
                            >
                                Logout
                            </button>
                        </div>
                    </div>
                </div>
            </nav>
            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6">
                            Welcome to your dashboard!
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
