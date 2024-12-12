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
    const [editingReviewId, setEditingReviewId] = useState<number | null>(null);
    const [editingContent, setEditingContent] = useState<{
        review: string;
        rating: number;
    }>({
        review: "",
        rating: 0,
    });

    const { data, setData, post, reset, errors } = useForm({
        review: "",
        rating: 0,
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

    useEffect(() => {
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
        post("/reviews", {
            onSuccess: () => {
                reset();
                alert("Review submitted successfully!");
                window.location.reload();
            },
            onError: (errors) => {
                console.error("Review submission errors:", errors);
                alert("Failed to submit review.");
            },
        });
    };

    const handleEditReview = (id: number) => {
        const reviewToEdit = reviews.find((review: any) => review.id === id);
        if (reviewToEdit) {
            setEditingReviewId(id);
            setEditingContent({
                review: reviewToEdit.review,
                rating: reviewToEdit.rating,
            });
        }
    };

    const saveEditedReview = async () => {
        if (editingReviewId === null) return;

        // Clear previous errors
        setData("errors", null);

        try {
            const csrfToken = document
                .querySelector('meta[name="csrf-token"]')
                ?.getAttribute("content");

            const response = await fetch(`/reviews/${editingReviewId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "X-CSRF-TOKEN": csrfToken || "",
                },
                body: JSON.stringify(editingContent),
            });

            if (response.ok) {
                const result = await response.json();
                // Update local state with the updated review
                setReviews((prev) =>
                    prev.map((review) =>
                        review.id === editingReviewId
                            ? { ...review, ...result.review }
                            : review
                    )
                );
                setEditingReviewId(null);
                setEditingContent({ review: "", rating: 0 });
                alert("Review updated successfully!");
            } else {
                // Handle non-successful HTTP responses
                const errorData = await response.json();
                if (errorData.errors) {
                    // Display specific validation errors
                    setData("errors", errorData.errors);
                } else {
                    alert(
                        `Error: ${
                            errorData.message || "Failed to update review."
                        }`
                    );
                }
            }
        } catch (error) {
            console.error("Error updating review:", error);
            alert("An unexpected error occurred while updating the review.");
        }
    };

    const handleDeleteReview = async (id: number) => {
        if (!confirm("Are you sure you want to delete this review?")) return;

        try {
            const csrfToken = document
                .querySelector('meta[name="csrf-token"]')
                ?.getAttribute("content");

            const response = await fetch(`/reviews/${id}`, {
                method: "DELETE",
                headers: {
                    "X-CSRF-TOKEN": csrfToken || "",
                },
            });

            if (response.ok) {
                alert("Review deleted successfully!");
                setReviews((prev) => prev.filter((review) => review.id !== id));
            } else {
                const errorData = await response.json();
                alert(
                    `Error: ${errorData.error || "Failed to delete review."}`
                );
            }
        } catch (error) {
            console.error("Error deleting review:", error);
            alert("An error occurred while deleting the review.");
        }
    };

    const cancelEditing = () => {
        setEditingReviewId(null);
        setEditingContent({ review: "", rating: 0 });
    };

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
                                    className="bg-gray-800 rounded-lg shadow-lg overflow-hidden transition-transform transform hover:scale-105"
                                >
                                    <div className="relative">
                                        <img
                                            src={
                                                game.background_image ||
                                                "/images/placeholder-game.jpg"
                                            }
                                            alt={game.name}
                                            className="w-full h-48 object-cover"
                                            loading="lazy"
                                            onError={(e) => {
                                                const target =
                                                    e.target as HTMLImageElement;
                                                target.src =
                                                    "/images/placeholder-game.jpg";
                                            }}
                                        />
                                        <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                                            <p className="text-white text-center px-2 text-sm">
                                                {game.genres
                                                    .map((g) => g.name)
                                                    .join(", ")}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="p-4">
                                        <h3 className="font-bold text-lg text-white">
                                            {game.name}
                                        </h3>
                                        <div className="mt-2 text-sm text-gray-400">
                                            <p>
                                                Rating:{" "}
                                                <span className="text-yellow-400">
                                                    {game.rating}
                                                </span>
                                            </p>
                                            <p>
                                                Released:{" "}
                                                {new Date(
                                                    game.released
                                                ).toLocaleDateString()}
                                            </p>
                                            <p>Platforms:</p>
                                            <ul className="list-disc list-inside">
                                                {game.platforms.map((p) => (
                                                    <li
                                                        key={p.platform.id}
                                                        className="text-gray-300"
                                                    >
                                                        {p.platform.name}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
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
                        {reviews
                            .filter((review: any) =>
                                isAuthenticated
                                    ? review.user?.email === user?.email
                                    : true
                            )
                            .map((review: any) => (
                                <div
                                    key={review.id}
                                    className="bg-gray-700 p-6 rounded-lg shadow-md flex flex-col"
                                >
                                    {editingReviewId === review.id ? (
                                        <>
                                            <textarea
                                                value={editingContent.review}
                                                onChange={(e) =>
                                                    setEditingContent({
                                                        ...editingContent,
                                                        review: e.target.value,
                                                    })
                                                }
                                                className="w-full p-2 rounded-lg bg-gray-800 text-white"
                                            />
                                            <input
                                                type="number"
                                                value={editingContent.rating}
                                                onChange={(e) =>
                                                    setEditingContent({
                                                        ...editingContent,
                                                        rating: Number(
                                                            e.target.value
                                                        ),
                                                    })
                                                }
                                                min="1"
                                                max="5"
                                                className="w-16 mt-2 p-2 rounded-lg bg-gray-800 text-white"
                                            />
                                            <div className="flex space-x-4 mt-2">
                                                <button
                                                    onClick={saveEditedReview}
                                                    className="bg-green-600 px-4 py-2 rounded-lg text-white"
                                                >
                                                    Save
                                                </button>
                                                <button
                                                    onClick={cancelEditing}
                                                    className="bg-red-600 px-4 py-2 rounded-lg text-white"
                                                >
                                                    Cancel
                                                </button>
                                            </div>
                                        </>
                                    ) : (
                                        <>
                                            <p className="text-gray-300 italic">
                                                "{review.review}"
                                            </p>
                                            <div className="mt-4 flex items-center">
                                                <div className="font-semibold text-white">
                                                    {review.user?.email ||
                                                        "Anonymous User"}
                                                </div>
                                                <div className="ml-auto text-yellow-400">
                                                    {"★".repeat(review.rating) +
                                                        "☆".repeat(
                                                            5 - review.rating
                                                        )}
                                                </div>
                                            </div>
                                            {isAuthenticated &&
                                                review.user?.email ===
                                                    user?.email && (
                                                    <div className="mt-4 flex space-x-4">
                                                        <button
                                                            onClick={() =>
                                                                handleEditReview(
                                                                    review.id
                                                                )
                                                            }
                                                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                                                        >
                                                            Edit
                                                        </button>
                                                        <button
                                                            onClick={() =>
                                                                handleDeleteReview(
                                                                    review.id
                                                                )
                                                            }
                                                            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                                                        >
                                                            Delete
                                                        </button>
                                                    </div>
                                                )}
                                        </>
                                    )}
                                </div>
                            ))}
                    </div>
                </div>
            </div>
        </>
    );
};

export default LandingPage;
