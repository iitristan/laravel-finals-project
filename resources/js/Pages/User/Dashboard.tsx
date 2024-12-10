import { useEffect, useState } from "react";
import UserNavbar from "@/Navbars/UserNavbar";
import { Head } from "@inertiajs/react";
import { rawgApi } from "@/services/rawgApi"; // Replace with your actual API service

// Add interfaces at the top
interface Game {
    id: number;
    name: string;
    background_image: string;
    released: string;
    rating: number;
    slug: string;
}

interface UserStats {
    totalGamesPlayed: number;
    totalWishlistItems: number;
    totalHoursPlayed: number;
}

const Dashboard = () => {
    const [featuredGames, setFeaturedGames] = useState<Game[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [userStats, setUserStats] = useState({
        totalGamesPlayed: 25,
        totalWishlistItems: 10,
        totalHoursPlayed: 120,
    });
    const [wishlistedGames, setWishlistedGames] = useState<number[]>([]);

    // Utility to shuffle an array
    const shuffleArray = (array) => {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    };

    useEffect(() => {
        const fetchFeaturedGames = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const data = await rawgApi.getGames(1, 8);
                const randomizedGames = shuffleArray(data.results || []).slice(0, 4);
                setFeaturedGames(randomizedGames);
            } catch (error) {
                setError('Failed to load featured games. Please try again later.');
                console.error("Error fetching featured games:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchFeaturedGames();
    }, []);

    // Add toggle wishlist function
    const toggleWishlist = (gameId: number) => {
        setWishlistedGames(prev => 
            prev.includes(gameId)
                ? prev.filter(id => id !== gameId)
                : [...prev, gameId]
        );
    };

    // Extract GameCard component
    const GameCard = ({ game }: { game: Game }) => (
        <div className="relative bg-gray-800 rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
            <img
                src={game.background_image}
                alt={game.name}
                className="w-full h-48 object-cover"
                loading="lazy"
            />
            <div className="p-4">
                <h3 className="font-semibold text-lg mb-2 text-white truncate">
                    {game.name}
                </h3>
                <p className="text-gray-400 text-sm mb-2">
                    Released: {new Date(game.released).toLocaleDateString()}
                </p>
                <div className="flex items-center mb-2">
                    <span className="text-yellow-400 mr-1">★</span>
                    <span className="text-gray-400 text-sm">
                        {game.rating ? game.rating.toFixed(1) : "N/A"}
                    </span>
                </div>
                <div className="mt-4 flex justify-between items-center">
                    <a
                        href={`/games/${game.slug}`}
                        className="text-indigo-400 hover:text-indigo-300 font-semibold"
                    >
                        View Details
                    </a>
                    <button 
                        onClick={() => toggleWishlist(game.id)}
                        className="text-gray-400 hover:text-yellow-400 transition-colors"
                    >
                        <span className="sr-only">
                            {wishlistedGames.includes(game.id) ? 'Remove from wishlist' : 'Add to wishlist'}
                        </span>
                        {wishlistedGames.includes(game.id) ? '★' : '☆'}
                    </button>
                </div>
            </div>
        </div>
    );

    // Extract StatsCard component
    const StatsCard = ({ title, value, bgColor }: { title: string; value: number; bgColor: string }) => (
        <div className={`${bgColor} rounded-lg p-4 shadow-lg transform hover:scale-105 transition-transform`}>
            <h3 className="text-sm font-medium mb-2 text-white/90">{title}</h3>
            <p className="text-3xl font-bold text-white">{value}</p>
        </div>
    );

    return (
        <>
            <Head title="User Dashboard" />
            <UserNavbar />
            <div className="bg-gray-900 text-white min-h-screen pt-16">
                {/* Hero Section */}
                <div className="bg-gradient-to-r from-indigo-600 to-purple-600 py-12">
                    <div className="max-w-7xl mx-auto px-6 sm:px-8 text-center">
                        <h1 className="text-4xl sm:text-5xl font-extrabold leading-tight text-white">
                            Welcome to Your Dashboard
                        </h1>
                        <p className="text-lg sm:text-xl text-gray-200 mt-4">
                            Explore your favorite games and personal progress
                            here.
                        </p>
                        <div className="mt-6">
                            <a
                                href="#featured"
                                className="bg-white text-indigo-600 py-3 px-6 rounded-full text-lg font-medium hover:bg-gray-100 transition-all"
                            >
                                Explore Featured Games
                            </a>
                        </div>
                    </div>
                </div>

                {/* Featured Games Section */}
                <div id="featured" className="max-w-7xl mx-auto py-12 px-6 sm:px-8">
                    <h2 className="text-3xl font-semibold text-center mb-8 text-white">
                        Featured Games for You
                    </h2>
                    {isLoading ? (
                        <div className="text-center text-gray-400">
                            <div className="animate-spin inline-block w-8 h-8 border-4 border-t-indigo-500 border-gray-800 rounded-full" />
                            <p className="mt-4">Loading featured games...</p>
                        </div>
                    ) : error ? (
                        <div className="text-center text-red-400">{error}</div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                            {featuredGames.map((game) => (
                                <GameCard key={game.id} game={game} />
                            ))}
                        </div>
                    )}
                </div>

                {/* Gaming Progress Section */}
                <div className="bg-gray-800 py-8">
                    <div className="max-w-7xl mx-auto px-6 sm:px-8">
                        <h2 className="text-2xl font-semibold text-center mb-6 text-white">
                            Your Gaming Progress
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <StatsCard
                                title="Total Games Played"
                                value={userStats.totalGamesPlayed}
                                bgColor="bg-indigo-600"
                            />
                            <StatsCard
                                title="Wishlist Items"
                                value={userStats.totalWishlistItems}
                                bgColor="bg-purple-600"
                            />
                            <StatsCard
                                title="Total Hours Played"
                                value={userStats.totalHoursPlayed}
                                bgColor="bg-pink-600"
                            />
                        </div>
                    </div>
                </div>

                {/* Footer Section */}
                <footer className="bg-gray-900 py-8">
                    <div className="max-w-7xl mx-auto text-center text-gray-400">
                        <p className="text-sm">
                            &copy; 2024 GameHub, All Rights Reserved.
                        </p>
                        <div className="mt-4">
                            <a
                                href="#"
                                className="text-indigo-400 hover:text-indigo-300 font-semibold"
                            >
                                Privacy Policy
                            </a>{" "}
                            |{" "}
                            <a
                                href="#"
                                className="text-indigo-400 hover:text-indigo-300 font-semibold"
                            >
                                Terms of Service
                            </a>
                        </div>
                    </div>
                </footer>
            </div>
        </>
    );
};

export default Dashboard;