import { useEffect, useState } from "react";
import UserNavbar from "@/Navbars/UserNavbar";
import { Head } from "@inertiajs/react";
import { rawgApi } from "@/services/rawgApi"; // Replace with your actual API service

const Dashboard = () => {
    const [featuredGames, setFeaturedGames] = useState([]);
    const [userStats, setUserStats] = useState({
        totalGamesPlayed: 25,
        totalWishlistItems: 10,
        totalHoursPlayed: 120,
    });


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
            try {
                const data = await rawgApi.getGames(1, 8); // Fetch 8 games
                const randomizedGames = shuffleArray(data.results || []).slice(
                    0,
                    4
                ); // Randomize and limit to 4
                setFeaturedGames(randomizedGames);
            } catch (error) {
                console.error("Error fetching featured games:", error);
            }
        };

        fetchFeaturedGames();
    }, []);

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
                <div
                    id="featured"
                    className="max-w-7xl mx-auto py-12 px-6 sm:px-8"
                >
                    <h2 className="text-3xl font-semibold text-center mb-8 text-white">
                        Featured Games for You
                    </h2>
                    {featuredGames.length === 0 ? (
                        <div className="text-center text-gray-400">
                            Loading featured games...
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                            {featuredGames.map((game) => (
                                <div
                                    key={game.id}
                                    className="relative bg-gray-800 rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300"
                                >
                                    <img
                                        src={game.background_image}
                                        alt={game.name}
                                        className="w-full h-48 object-cover"
                                    />
                                    <div className="p-4">
                                        <h3 className="font-semibold text-lg mb-2 text-white">
                                            {game.name}
                                        </h3>
                                        <p className="text-gray-400 text-sm mb-2">
                                            Released:{" "}
                                            {new Date(
                                                game.released
                                            ).toLocaleDateString()}
                                        </p>
                                        <p className="text-gray-400 text-sm">
                                            Rating: {game.rating || "N/A"}
                                        </p>
                                        <div className="mt-4">
                                            <a
                                                href={`/games/${game.slug}`}
                                                className="text-indigo-400 hover:text-indigo-300 font-semibold"
                                            >
                                                View Details
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Personal Progress Section */}
                <div className="bg-gray-800 py-12">
                    {/* Gaming Progress Section */}
                    <div className="max-w-7xl mx-auto py-12 px-6 sm:px-8">
                        <h2 className="text-3xl font-semibold text-center mb-8 text-white">
                            Your Gaming Progress
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            <div className="bg-indigo-600 rounded-lg p-6 shadow-lg">
                                <h3 className="text-lg font-semibold mb-4">
                                    Total Games Played
                                </h3>
                                <p className="text-4xl font-bold">
                                    {userStats.totalGamesPlayed}
                                </p>
                            </div>
                            <div className="bg-purple-600 rounded-lg p-6 shadow-lg">
                                <h3 className="text-lg font-semibold mb-4">
                                    Wishlist Items
                                </h3>
                                <p className="text-4xl font-bold">
                                    {userStats.totalWishlistItems}
                                </p>
                            </div>
                            <div className="bg-pink-600 rounded-lg p-6 shadow-lg">
                                <h3 className="text-lg font-semibold mb-4">
                                    Total Hours Played
                                </h3>
                                <p className="text-4xl font-bold">
                                    {userStats.totalHoursPlayed}
                                </p>
                            </div>
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
