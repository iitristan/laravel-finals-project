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
    slug: string;
    name: string;
    released: string;
    background_image: string;
    rating: number;
    metacritic: number;
    genres: {
        id: number;
        name: string;
    }[];
    platforms: {
        platform: {
            id: number;
            name: string;
        };
    }[];
}

const Dashboard = ({ totalOrders = 0, totalUsers = 0, totalRevenue = 0 }: DashboardStats) => {
    const [recentGames, setRecentGames] = useState<Game[]>([]);
    const [totalGames, setTotalGames] = useState(0);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        const fetchGames = async () => {
            try {
                const data = await rawgApi.getGames(1, 6);
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

    useEffect(() => {
        const searchGames = async () => {
            setLoading(true);
            try {
                if (searchQuery.trim()) {
                    const data = await rawgApi.searchGames(searchQuery);
                    setRecentGames(data.results);
                } else {
                    const data = await rawgApi.getGames(1, 6);
                    setRecentGames(data.results);
                }
            } catch (error) {
                console.error('Error searching games:', error);
            } finally {
                setLoading(false);
            }
        };

        const timeoutId = setTimeout(searchGames, 300);
        return () => clearTimeout(timeoutId);
    }, [searchQuery]);

    return (
        <>
            <Head title="Admin Dashboard" />
            <AdminNavbar />
            {loading && (
                <div className="fixed inset-0 z-50 bg-gray-900 bg-opacity-75 flex items-center justify-center">
                    <div className="text-white text-lg font-semibold animate-pulse">Loading...</div>
                </div>
            )}
            <div className="bg-gray-900 text-white py-12">
                <div className="max-w-7xl mx-auto px-6 sm:px-8">
                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                        <div className="bg-gradient-to-r from-blue-500 to-blue-700 text-white p-6 rounded-lg shadow-lg">
                            <h2 className="text-lg font-semibold mb-2">Total Games</h2>
                            <p className="text-4xl font-bold">{totalGames}</p>
                        </div>
                        <div className="bg-gradient-to-r from-green-500 to-green-700 text-white p-6 rounded-lg shadow-lg">
                            <h2 className="text-lg font-semibold mb-2">Total Orders</h2>
                            <p className="text-4xl font-bold">{totalOrders}</p>
                        </div>
                        <div className="bg-gradient-to-r from-yellow-500 to-yellow-700 text-white p-6 rounded-lg shadow-lg">
                            <h2 className="text-lg font-semibold mb-2">Total Users</h2>
                            <p className="text-4xl font-bold">{totalUsers}</p>
                        </div>
                        <div className="bg-gradient-to-r from-purple-500 to-purple-700 text-white p-6 rounded-lg shadow-lg">
                            <h2 className="text-lg font-semibold mb-2">Total Revenue</h2>
                            <p className="text-4xl font-bold">${totalRevenue}</p>
                        </div>
                    </div>

                    {/* Search Bar */}
                    <div className="bg-gray-800 rounded-lg shadow-lg mb-12 p-6">
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <svg
                                    className="h-5 w-5 text-gray-400"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                                    />
                                </svg>
                            </div>
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Search games..."
                                className="block w-full pl-10 pr-4 py-2 rounded-lg bg-gray-700 border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                            />
                        </div>
                    </div>

                    {/* Recent Games Section */}
                    <div className="bg-gray-800 rounded-lg shadow-lg p-6">
                        <h2 className="text-2xl font-semibold mb-4">
                            {searchQuery ? 'Search Results' : 'Recent Games from RAWG'}
                        </h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {recentGames.map((game) => (
                                <div
                                    key={game.id}
                                    className="bg-gray-700 rounded-lg shadow-lg overflow-hidden"
                                >
                                    <img
                                        src={game.background_image}
                                        alt={game.name}
                                        className="w-full h-40 object-cover"
                                    />
                                    <div className="p-4">
                                        <h3 className="font-semibold text-lg mb-2">{game.name}</h3>
                                        <div className="text-sm text-gray-200">
                                            <p>Rating: {game.rating}</p>
                                            <p>Released: {game.released}</p>
                                            <p>Metacritic: {game.metacritic || 'N/A'}</p>
                                            {game.genres && (
                                                <p>Genres: {game.genres.map((g) => g.name).join(', ')}</p>
                                            )}
                                            {game.platforms && (
                                                <p>
                                                    Platforms: {game.platforms.map((p) => p.platform.name).join(', ')}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Dashboard;
