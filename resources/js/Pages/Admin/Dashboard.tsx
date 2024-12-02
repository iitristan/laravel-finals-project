import { useEffect, useState } from 'react';
import { Head } from '@inertiajs/react';
import AdminNavbar from '@/Navbars/AdminNavbar';
import { rawgApi } from '@/services/rawgApi';

interface DashboardStats {
    totalGames?: number;
    totalOrders?: number;
    totalUsers?: number;
    totalRevenue?: number;
}

interface Game {
    id: number;
    name: string;
    background_image: string;
    rating: number;
    released: string;
}

const Dashboard = ({ totalOrders = 0, totalUsers = 0, totalRevenue = 0 }: DashboardStats) => {
    const [recentGames, setRecentGames] = useState<Game[]>([]);
    const [totalGames, setTotalGames] = useState(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchGames = async () => {
            try {
                const data = await rawgApi.getGames(1, 6); // Get first 5 games
                setRecentGames(data.results);
                setTotalGames(data.count);
            } catch (error) {
                console.error('Error fetching games:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchGames();
    }, []);

    return (
        <>
            <Head title="Admin Dashboard" />
            <AdminNavbar />
            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    {/* Stats Cards */}
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg mb-6">
                        <div className="p-6 text-gray-900">
                            <h1 className="text-2xl font-semibold mb-6">Dashboard</h1>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                <div className="bg-blue-100 p-4 rounded-lg">
                                    <h2 className="text-lg font-semibold mb-2">Total Games</h2>
                                    <p className="text-3xl font-bold">{totalGames}</p>
                                </div>
                                
                                <div className="bg-green-100 p-4 rounded-lg">
                                    <h2 className="text-lg font-semibold mb-2">Total Orders</h2>
                                    <p className="text-3xl font-bold">{totalOrders}</p>
                                </div>
                                
                                <div className="bg-yellow-100 p-4 rounded-lg">
                                    <h2 className="text-lg font-semibold mb-2">Total Users</h2>
                                    <p className="text-3xl font-bold">{totalUsers}</p>
                                </div>
                                
                                <div className="bg-purple-100 p-4 rounded-lg">
                                    <h2 className="text-lg font-semibold mb-2">Total Revenue</h2>
                                    <p className="text-3xl font-bold">${totalRevenue}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Recent Games Section */}
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6">
                            <h2 className="text-xl font-semibold mb-4">Recent Games from RAWG</h2>
                            {loading ? (
                                <div className="text-center py-4">Loading games...</div>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {recentGames.map((game) => (
                                        <div key={game.id} className="border rounded-lg overflow-hidden">
                                            <img 
                                                src={game.background_image} 
                                                alt={game.name}
                                                className="w-full h-48 object-cover"
                                            />
                                            <div className="p-4">
                                                <h3 className="font-semibold text-lg mb-2">{game.name}</h3>
                                                <div className="text-sm text-gray-600">
                                                    <p>Rating: {game.rating}</p>
                                                    <p>Released: {game.released}</p>
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

export default Dashboard;
