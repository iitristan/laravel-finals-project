import UserNavbar from '@/Navbars/UserNavbar';
import { Head } from '@inertiajs/react';

const Dashboard = () => {
    return (
        <>
            <Head title="User Dashboard" />
            <UserNavbar />
            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            <h1 className="text-2xl font-bold mb-4">Welcome to your Dashboard</h1>
                            {/* Add your dashboard content here */}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Dashboard;
