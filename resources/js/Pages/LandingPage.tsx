import { useEffect, useState } from "react";
import { Head, useForm } from "@inertiajs/react";
import { rawgApi } from "@/services/rawgApi";
import WelcomeNavbar from "@/Navbars/WelcomeNavbar";
import UserNavbar from "@/Navbars/UserNavbar";

interface LandingPageProps {
    isAuthenticated: boolean;
    user?: {
        name: string;
        email: string;
    };
}

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

const LandingPage: React.FC<LandingPageProps> = ({ isAuthenticated, user }) => {
    const [recentGames, setRecentGames] = useState<Game[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [reviews, setReviews] = useState([]);
    const { data, setData, post, reset, errors } = useForm({
        review: "",
        rating: 0,
        image: null,
    });

    // Fetch recent games on page load
    useEffect(() => {
        const fetchGames = async () => {
            try {
                const data = await rawgApi.getGames(1, 8); // Get first 6 games
                const sortedGames = data.results.sort((a: Game, b: Game) => {
                    return (
                        new Date(b.released).getTime() -
                        new Date(a.released).getTime()
                    );
                });
                setRecentGames(sortedGames);
            } catch (error) {
                console.error("Error fetching games:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchGames();
    }, []);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setData("image", e.target.files[0]);
        }
    };

    useEffect(() => {
        // Fetch reviews from the backend
        const fetchReviews = async () => {
            try {
                const response = await fetch("/reviews");
                const result = await response.json();
                setReviews(result.data);
            } catch (error) {
                console.error("Error fetching reviews:", error);
            }
        };
        fetchReviews();
    }, []);
    
    const submitReview = async (e: React.FormEvent) => {
        e.preventDefault();
    
        post('/reviews', {
            onError: (errors) => {
                console.error('Review Submission Errors:', errors);
                alert('Failed to submit review. Please check the form.');
            },
            onSuccess: () => {
                reset();
                alert('Review submitted successfully!');
                fetchReviews(); // Fetch the updated list of reviews
            },
        });
    };
    

    // Handle search query and filter games based on user input
    useEffect(() => {
        const searchGames = async () => {
            setLoading(true);
            try {
                if (searchQuery.trim()) {
                    const data = await rawgApi.searchGames(searchQuery);
                    const sortedGames = data.results.sort(
                        (a: Game, b: Game) => {
                            return (
                                new Date(b.released).getTime() -
                                new Date(a.released).getTime()
                            );
                        }
                    );
                    setRecentGames(sortedGames);
                } else {
                    const data = await rawgApi.getGames(1, 8);
                    const sortedGames = data.results.sort(
                        (a: Game, b: Game) => {
                            return (
                                new Date(b.released).getTime() -
                                new Date(a.released).getTime()
                            );
                        }
                    );
                    setRecentGames(sortedGames);
                }
            } catch (error) {
                console.error("Error searching games:", error);
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
            {isAuthenticated ? <UserNavbar /> : <WelcomeNavbar />}
            <div className="bg-gray-900 text-white min-h-screen">
                {/* Hero Section */}
                <div className="bg-cover bg-center h-96 relative">
                    <div className="absolute inset-0 bg-black opacity-50"></div>
                    <div className="absolute inset-0 flex items-center justify-center text-center px-6 py-8">
                        <div className="space-y-4">
                            <h1 className="text-4xl sm:text-5xl font-extrabold leading-tight text-white">
                                Buy and Explore Games
                            </h1>
                            <p className="text-lg sm:text-xl text-gray-300">
                                Browse top games, find your perfect match, and
                                start playing today.
                            </p>
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
                            <h2 className="text-3xl font-semibold mb-4 text-center md:text-left">
                                What Is Our Platform?
                            </h2>
                            <p className="text-lg text-gray-300 text-center md:text-left">
                                We offer a platform to discover, purchase, and
                                play some of the best video games on the market.
                                With a wide selection of genres and unique
                                features, we aim to provide the best game
                                browsing and purchasing experience.
                            </p>
                            <div className="mt-6 text-center md:text-left">
                                <a
                                    href="#"
                                    className="text-indigo-600 hover:text-indigo-800 font-semibold"
                                >
                                    Learn More
                                </a>
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
                    <h2 className="text-3xl font-semibold text-center mb-8">
                        Featured Games
                    </h2>
                    {loading ? (
                        <div className="text-center py-4">Loading games...</div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                            {recentGames.map((game) => (
                                <div
                                    key={game.id}
                                    className="group bg-gray-900/50 rounded-lg overflow-hidden hover:bg-gray-800/50 transition-all duration-300 flex flex-col"
                                >
                                    <div className="relative w-full h-48 bg-gray-700">
                                        <img
                                            src={
                                                game.background_image ||
                                                "/images/placeholder-game.jpg"
                                            }
                                            alt={game.name}
                                            className="absolute inset-0 w-full h-full object-cover"
                                            loading="lazy"
                                            onError={(e) => {
                                                const target =
                                                    e.target as HTMLImageElement;
                                                target.src =
                                                    "/images/placeholder-game.jpg";
                                            }}
                                        />
                                    </div>
                                    <div className="p-4 space-y-2 flex-1 flex flex-col">
                                        <h3 className="font-bold text-xl text-white">
                                            {game.name}
                                        </h3>
                                        <div className="flex items-center text-sm text-gray-400">
                                            <span className="flex items-center">
                                                <span className="text-yellow-400 mr-1">
                                                    ★
                                                </span>
                                                {game.rating}
                                            </span>
                                            <span className="mx-2">•</span>
                                            <span>
                                                {new Date(
                                                    game.released
                                                ).getFullYear()}
                                            </span>
                                        </div>
                                        <div className="text-sm text-gray-400">
                                            {game.genres
                                                .slice(0, 2)
                                                .map((g) => g.name)
                                                .join(", ")}
                                        </div>
                                        <div className="flex-1"></div>
                                        <a
                                            href={`/games/${game.slug}`}
                                            className="block w-full text-center py-2 px-4 bg-indigo-600 hover:bg-indigo-700 rounded text-white font-medium transition-colors duration-300"
                                        >
                                            More Info
                                        </a>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Review Submission Section (Only for authenticated users) */}
                {isAuthenticated && (
                    <div className="max-w-7xl mx-auto py-8 px-6 sm:px-8 bg-gray-800 rounded-lg mt-8">
                        <h2 className="text-3xl font-semibold mb-4">
                            Submit Your Review
                        </h2>
                        <form onSubmit={submitReview} className="space-y-4">
                            <textarea
                                value={data.review}
                                onChange={(e) =>
                                    setData("review", e.target.value)
                                }
                                placeholder="Write your review here..."
                                className="w-full p-4 rounded-lg bg-gray-700 text-white focus:outline-none"
                            />
                            {errors.review && (
                                <div className="text-red-500 text-sm">
                                    {errors.review}
                                </div>
                            )}
                            <div className="flex items-center space-x-4">
                                {/* <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleFileChange}
                                    className="text-gray-300"
                                /> */}
                                {errors.image && (
                                    <div className="text-red-500 text-sm">
                                        {errors.image}
                                    </div>
                                )}
                                <div>
                                    <label>Rating:</label>
                                    <input
                                        type="number"
                                        min="1"
                                        max="5"
                                        value={data.rating}
                                        onChange={(e) =>
                                            setData(
                                                "rating",
                                                Number(e.target.value)
                                            )
                                        }
                                        className="ml-2 w-16 p-2 bg-gray-700 text-white rounded-md"
                                    />
                                </div>
                            </div>
                            {errors.rating && (
                                <div className="text-red-500 text-sm">
                                    {errors.rating}
                                </div>
                            )}
                            <button
                                type="submit"
                                className="bg-indigo-600 hover:bg-indigo-700 px-6 py-3 rounded-lg text-white font-medium"
                            >
                                Submit Review
                            </button>
                        </form>
                    </div>
                )}  
  {/* Display Reviews */}
  <div className="max-w-7xl mx-auto py-8 px-6 sm:px-8 bg-gray-800 rounded-lg mt-8">
                    <h2 className="text-3xl font-semibold mb-6">
                        What Our Users Say
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                        {reviews.map((review: any) => (
                            <div
                                key={review.id}
                                className="bg-gray-700 p-6 rounded-lg shadow-md flex flex-col"
                            >
                                <p className="text-gray-300 italic">
                                    "{review.review}"
                                </p>
                                {review.image && (
                                    <img
                                        src={`/storage/${review.image}`}
                                        alt="Review"
                                        className="mt-4 rounded-lg"
                                    />
                                )}
                                <div className="mt-4 flex items-center">
                                    <div className="font-semibold text-white">
                                        {review.user_name}
                                    </div>
                                    <div className="ml-auto text-yellow-400">
                                        {"★".repeat(review.rating) +
                                            "☆".repeat(5 - review.rating)}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </>
    );
};

export default LandingPage;
