import { useEffect, useState } from 'react';
import { Head } from '@inertiajs/react';
import { rawgApi } from '@/services/rawgApi';
import WelcomeNavbar from '@/Navbars/WelcomeNavbar';

interface Game {
    id: number;
    slug: string;
    name: string;
    released: string;
    background_image: string;
    rating: number;
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
    }[];
}

const LandingPage = () => {
    const [recentGames, setRecentGames] = useState<Game[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');

    // Fetch recent games on page load
    useEffect(() => {
        const fetchGames = async () => {
            try {
                const data = await rawgApi.getGames(1, 8); // Get first 6 games
                const sortedGames = data.results.sort((a: Game, b: Game) => {
                    return new Date(b.released).getTime() - new Date(a.released).getTime();
                });
                setRecentGames(sortedGames);
            } catch (error) {
                console.error('Error fetching games:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchGames();
    }, []);

    // Handle search query and filter games based on user input
    useEffect(() => {
        const searchGames = async () => {
            setLoading(true);
            try {
                if (searchQuery.trim()) {
                    const data = await rawgApi.searchGames(searchQuery);
                    const sortedGames = data.results.sort((a: Game, b: Game) => {
                        return new Date(b.released).getTime() - new Date(a.released).getTime();
                    });
                    setRecentGames(sortedGames);
                } else {
                    const data = await rawgApi.getGames(1, 8);
                    const sortedGames = data.results.sort((a: Game, b: Game) => {
                        return new Date(b.released).getTime() - new Date(a.released).getTime();
                    });
                    setRecentGames(sortedGames);
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
            <Head title="Landing Page" />
            <WelcomeNavbar />
            <div className="bg-gray-900 text-white min-h-screen">
                {/* Hero Section */}
                <div className="bg-cover bg-center h-96 relative">
                    <div className="absolute inset-0 bg-black opacity-50"></div>
                    <div className="absolute inset-0 flex items-center justify-center text-center px-6 py-8">
                        <div className="space-y-4">
                            <h1 className="text-4xl sm:text-5xl font-extrabold leading-tight text-white">
                              Buy and Explore Games
                            </h1>
                            <p className="text-lg sm:text-xl text-gray-300">Browse top games, find your perfect match, and start playing today.</p>
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Search for games..."
                                className="w-full sm:w-96 py-2 px-4 text-lg rounded-lg bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            />
                        </div>
                    </div>
                </div>

                {/* About Section */}
<div className="max-w-7xl mx-auto py-8 px-6 sm:px-8">
    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 items-center justify-center">
        <div className="flex flex-col items-center md:items-start">
            <h2 className="text-3xl font-semibold mb-4 text-center md:text-left">What Is Our Platform?</h2>
            <p className="text-lg text-gray-300 text-center md:text-left">
                We offer a platform to discover, purchase, and play some of the best video games on the market. With a wide
                selection of genres and unique features, we aim to provide the best game browsing and purchasing experience.
            </p>
            <div className="mt-6 text-center md:text-left">
                <a href="#" className="text-indigo-600 hover:text-indigo-800 font-semibold">Learn More</a>
            </div>
        </div>
        <div className="flex justify-center">
            <img
                src="/cat.png"
                alt="About Platform"
                className="rounded-lg w-[360px] object-cover"
            />
        </div>
    </div>
</div>


                {/* Featured Games Section */}
                <div className="max-w-7xl mx-auto py-8 px-6 sm:px-8">
                    <h2 className="text-3xl font-semibold text-center mb-8">Featured Games</h2>
                    {loading ? (
                        <div className="text-center py-4">Loading games...</div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                            {recentGames.map((game) => (
                                <div key={game.id} className="relative bg-white rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
                                    <img
                                        src={game.background_image}
                                        alt={game.name}
                                        className="w-full h-56 object-cover"
                                    />
                                    <div className="p-4">
                                        <h3 className="font-semibold text-lg mb-2">{game.name}</h3>
                                        <p className="text-gray-600 text-sm mb-2">Rating: {game.rating}</p>
                                        <p className="text-gray-600 text-sm mb-2">Released: {game.released}</p>
                                        <p className="text-gray-600 text-sm">
                                            Genres: {game.genres.map((g) => g.name).join(', ')}
                                        </p>
                                        <div className="mt-4">
                                            <a href={`/games/${game.slug}`} className="text-indigo-600 hover:text-indigo-800 font-semibold">More Info</a>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Footer Section */}
                <footer className="bg-gray-800 py-8">
                    <div className="max-w-7xl mx-auto text-center text-white">
                        <p className="text-sm">
                            &copy; 2024 Game Store, All Rights Reserved.
                        </p>
                        <div className="mt-4">
                            <a href="#" className="text-indigo-600 hover:text-indigo-800 font-semibold">Privacy Policy</a> |{' '}
                            <a href="#" className="text-indigo-600 hover:text-indigo-800 font-semibold">Terms of Service</a>
                        </div>
                    </div>
                </footer>
            </div>
        </>
    );
};

export default LandingPage;
