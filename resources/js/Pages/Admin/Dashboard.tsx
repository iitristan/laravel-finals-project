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
    tba: boolean;
    background_image: string;
    rating: number;
    rating_top: number;
    ratings: {
        id: number;
        title: string;
        count: number;
        percent: number;
    }[];
    ratings_count: number;
    reviews_text_count: number;
    added: number;
    metacritic: number;
    playtime: number;
    suggestions_count: number;
    updated: string;
    genres: {
        id: number;
        name: string;
        slug: string;
    }[];
    platforms: {
        platform: {
            id: number;
            name: string;
            slug: string;
        };
        released_at: string;
        requirements?: {
            minimum?: string;
            recommended?: string;
        };
    }[];
    stores: {
        id: number;
        store: {
            id: number;
            name: string;
            slug: string;
        };
    }[];
    tags: {
        id: number;
        name: string;
        slug: string;
        language: string;
        games_count: number;
    }[];
    esrb_rating?: {
        id: number;
        name: string;
        slug: string;
    };
}

const Dashboard = ({ totalOrders = 0, totalUsers = 0, totalRevenue = 0 }: DashboardStats) => {
    const [recentGames, setRecentGames] = useState<Game[]>([]);
    const [totalGames, setTotalGames] = useState(0);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');

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

                    {/* Search Bar */}
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg mb-6">
                        <div className="p-6">
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
                                    className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent shadow-sm transition duration-150 ease-in-out"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Recent Games Section */}
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6">
                            <h2 className="text-xl font-semibold mb-4">
                                {searchQuery ? 'Search Results' : 'Recent Games from RAWG'}
                            </h2>
                            {loading ? (
                                <div className="text-center py-4">Loading games...</div>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {recentGames.map((game) => {
                                        return (
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
                                                        <p>Metacritic: {game.metacritic || 'N/A'}</p>
                                                        {game.genres && (
                                                            <p>Genres: {game.genres.map(g => g.name).join(', ')}</p>
                                                        )}
                                                        {game.platforms && (
                                                            <p>Platforms: {game.platforms.map(p => p.platform.name).join(', ')}</p>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
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
