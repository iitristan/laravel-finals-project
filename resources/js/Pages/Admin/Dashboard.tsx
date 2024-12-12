import { useEffect, useState } from "react";
import { Head, useForm } from "@inertiajs/react";
import AdminNavbar from "@/Navbars/AdminNavbar";
import { rawgApi } from "@/services/rawgApi";

interface DashboardStats {
    totalGames?: number;
    totalOrders?: number;
    totalUsers?: number;
    totalRevenue?: number;
}

interface Review {
    id: number;
    user_id: number;
    review: string;
    rating: number;
    image: string | null;
    created_at: string;
    deleted_at: string | null;
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

const Dashboard = ({
    totalOrders = 0,
    totalUsers = 0,
    totalRevenue = 0,
}: DashboardStats) => {
    const [recentGames, setRecentGames] = useState<Game[]>([]);
    const [totalGames, setTotalGames] = useState(0);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [reviews, setReviews] = useState<Review[]>([]);
    const [users, setUsers] = useState<User[]>([]);
    const [loadingUsers, setLoadingUsers] = useState(true);
    const [loadingReviews, setLoadingReviews] = useState(true);
    const {
        data,
        setData,
        post,
        reset,
        put,
        delete: destroy,
        errors,
    } = useForm({
        id: null,
        review: "",
        rating: 0,
        image: null,
    });

    // Fetch all reviews
    const fetchReviews = async () => {
        try {
            const response = await fetch("/admin/reviews");
            const data = await response.json();
            setReviews(data);
        } catch (error) {
            console.error("Error fetching reviews:", error);
        } finally {
            setLoading(false);
        }
    };

    const softDeleteReview = async (id: number) => {
        if (!confirm("Are you sure you want to soft delete this review?"))
            return;

        try {
            const response = await fetch(`/admin/reviews/${id}`, {
                method: "DELETE",
                headers: {
                    "X-CSRF-TOKEN":
                        document
                            .querySelector('meta[name="csrf-token"]')
                            ?.getAttribute("content") || "",
                },
            });

            if (response.status === 204) {
                // Update the `deleted_at` field of the review in the state
                setReviews((prevReviews) =>
                    prevReviews.map((review) =>
                        review.id === id
                            ? {
                                  ...review,
                                  deleted_at: new Date().toISOString(),
                              }
                            : review
                    )
                );
                alert("Review soft deleted successfully.");
            } else {
                alert("Failed to soft delete review.");
            }
        } catch (error) {
            console.error("Error soft deleting review:", error);
            alert("An error occurred while soft deleting the review.");
        }
    };

    const permanentlyDeleteReview = async (id: number) => {
        if (
            !confirm("Are you sure you want to permanently delete this review?")
        )
            return;

        try {
            const response = await fetch(`/admin/reviews/${id}?force=true`, {
                method: "DELETE",
                headers: {
                    "X-CSRF-TOKEN":
                        document
                            .querySelector('meta[name="csrf-token"]')
                            ?.getAttribute("content") || "",
                },
            });
            if (response.ok) {
                // This will handle 204 No Content as well
                fetchReviews();
                alert("Review permanently deleted.");
            } else {
                const errorData = await response.json();
                alert(
                    `Failed to permanently delete review: ${
                        errorData.message || "Unknown error."
                    }`
                );
            }
        } catch (error) {
            console.error("Error permanently deleting review:", error);
            alert("An error occurred while permanently deleting the review.");
        }
    };

    // Restore soft-deleted review
    const restoreReview = async (id: number) => {
        try {
            const response = await fetch(`/admin/reviews/${id}/restore`, {
                method: "POST",
                headers: {
                    "X-CSRF-TOKEN":
                        document
                            .querySelector('meta[name="csrf-token"]')
                            ?.getAttribute("content") || "",
                },
            });
            if (response.ok) {
                fetchReviews();
                alert("Review restored successfully.");
            } else {
                alert("Failed to restore review.");
            }
        } catch (error) {
            console.error("Error restoring review:", error);
            alert("An error occurred while restoring the review.");
        }
    };

    useEffect(() => {
        fetchReviews();
    }, []);

    useEffect(() => {
        const fetchGames = async () => {
            try {
                const data = await rawgApi.getGames(1, 6);
                setRecentGames(data.results);
                setTotalGames(data.count);
            } catch (error) {
                console.error("Error fetching games:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchGames();
    }, []);

    useEffect(() => {
        fetchReviews();
    }, []);

    // Fetch users
    const fetchUsers = async () => {
        try {
            const csrfToken = document
                .querySelector('meta[name="csrf-token"]')
                ?.getAttribute("content");

            const response = await fetch("/users", {
                headers: {
                    "X-CSRF-TOKEN": csrfToken || "",
                },
                credentials: "include",
            });
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            setUsers(data.users);
        } catch (error) {
            console.error("Error fetching users:", error);
        } finally {
            setLoadingUsers(false);
        }
    };

    // Delete user
    const deleteUser = async (userId: number) => {
        if (!confirm("Are you sure you want to delete this user?")) return;

        try {
            const response = await fetch(`/users/${userId}`, {
                method: "DELETE",
                headers: {
                    "X-CSRF-TOKEN":
                        document
                            .querySelector('meta[name="csrf-token"]')
                            ?.getAttribute("content") || "",
                },
            });

            const data = await response.json();
            if (data.success) {
                alert("User deleted successfully!");
                setUsers((prevUsers) =>
                    prevUsers.filter((user) => user.id !== userId)
                );
            } else {
                alert(data.message || "Failed to delete user.");
            }
        } catch (error) {
            console.error("Error deleting user:", error);
            alert("An error occurred while deleting the user.");
        }
    };

    useEffect(() => {
        fetchUsers();
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
            <Head title="Admin Dashboard" />
            <AdminNavbar />
            <div className="bg-gray-900 text-white min-h-screen flex flex-col">
                <div className="max-w-7xl mx-auto px-6 sm:px-8 py-12 flex-grow">
                    <h1 className="text-3xl font-semibold mb-8 text-center">
                        Manage User Reviews
                    </h1>
                    {loading ? (
                        <div className="text-center py-12">
                            Loading reviews...
                        </div>
                    ) : (
                        <div className="overflow-x-auto bg-gray-800 rounded-lg shadow-lg p-6 mb-12">
                            <table className="table-auto w-full text-sm text-left">
                                <thead className="bg-gray-700 text-white">
                                    <tr>
                                        <th className="px-4 py-2">ID</th>
                                        <th className="px-4 py-2">
                                            User Email
                                        </th>
                                        <th className="px-4 py-2">Review</th>
                                        <th className="px-4 py-2">Rating</th>
                                        <th className="px-4 py-2">Image</th>
                                        <th className="px-4 py-2">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {reviews
                                        .sort((a, b) => a.id - b.id) // Sort by ID
                                        .map((review) => {
                                            const userEmail =
                                                users.find(
                                                    (user) =>
                                                        user.id ===
                                                        review.user_id
                                                )?.email || "Unknown User";

                                            return (
                                                <tr
                                                    key={review.id}
                                                    className={
                                                        review.deleted_at
                                                            ? "bg-gray-600"
                                                            : "bg-gray-800"
                                                    }
                                                >
                                                    <td className="px-4 py-2">
                                                        {review.id}
                                                    </td>
                                                    <td className="px-4 py-2">
                                                        {userEmail}
                                                    </td>
                                                    <td className="px-4 py-2">
                                                        {review.review}
                                                    </td>
                                                    <td className="px-4 py-2">
                                                        {review.rating}
                                                    </td>
                                                    <td className="px-4 py-2">
                                                        {review.image && (
                                                            <img
                                                                src={`/storage/${review.image}`}
                                                                alt="Review"
                                                                className="w-20 h-20 object-cover rounded"
                                                            />
                                                        )}
                                                    </td>
                                                    <td className="px-4 py-2 space-y-2">
                                                        {review.deleted_at ? (
                                                            <button
                                                                className="bg-green-500 px-3 py-1 rounded text-white mr-2"
                                                                onClick={() =>
                                                                    restoreReview(
                                                                        review.id
                                                                    )
                                                                }
                                                            >
                                                                Restore
                                                            </button>
                                                        ) : (
                                                            <button
                                                                className="bg-red-500 px-3 py-1 rounded text-white mr-2"
                                                                onClick={() =>
                                                                    softDeleteReview(
                                                                        review.id
                                                                    )
                                                                }
                                                            >
                                                                Soft Delete
                                                            </button>
                                                        )}
                                                        <button
                                                            className="bg-red-700 px-3 py-1 rounded text-white"
                                                            onClick={() =>
                                                                permanentlyDeleteReview(
                                                                    review.id
                                                                )
                                                            }
                                                        >
                                                            Delete Permanently
                                                        </button>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                </tbody>
                            </table>
                        </div>
                    )}

                    <h1 className="text-3xl font-semibold mb-6 mt-12 text-center">
                        Manage Users
                    </h1>
                    {loadingUsers ? (
                        <div className="text-center py-12">
                            Loading users...
                        </div>
                    ) : (
                        <div className="overflow-x-auto bg-gray-800 rounded-lg shadow-lg p-6">
                            <table className="table-auto w-full text-sm text-left">
                                <thead className="bg-gray-700 text-white">
                                    <tr>
                                        <th className="px-4 py-2">Name</th>
                                        <th className="px-4 py-2">Email</th>
                                        <th className="px-4 py-2">
                                            Joined Date
                                        </th>
                                        <th className="px-4 py-2">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {users.map((user) => (
                                        <tr
                                            key={user.id}
                                            className="bg-gray-800 text-white"
                                        >
                                            <td className="px-4 py-2">
                                                {user.name}
                                            </td>
                                            <td className="px-4 py-2">
                                                {user.email}
                                            </td>
                                            <td className="px-4 py-2">
                                                {new Date(
                                                    user.created_at
                                                ).toLocaleDateString()}
                                            </td>
                                            <td className="px-4 py-2">
                                                <button
                                                    onClick={() =>
                                                        deleteUser(user.id)
                                                    }
                                                    className="bg-red-500 px-3 py-1 rounded text-white"
                                                >
                                                    Delete
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default Dashboard;
