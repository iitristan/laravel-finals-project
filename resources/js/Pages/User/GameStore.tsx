import UserNavbar from '@/Navbars/UserNavbar';
import { Head } from '@inertiajs/react';
import { router } from '@inertiajs/react';
import { ManagedGame } from '@/types/game';
import GameStore from '@/Components/Store/GameStore';

interface Props {
    games: ManagedGame[];
}

const GameStorePage = ({ games }: Props) => {
    const handleAddToCart = (gameId: number, quantity: number) => {
        router.post(`/cart/add/${gameId}`, {
            quantity,
        }, {
            preserveScroll: true,
        });
    };

    return (
        <>
            <Head title="Game Store" />
            <UserNavbar />
            <div className="bg-gray-900 text-white min-h-screen pt-16">
                {/* Hero Section */}
                <div className="bg-gradient-to-r from-indigo-600 to-purple-600 py-12 text-center">
                    <h1 className="text-4xl font-extrabold">Game Store</h1>
                    <p className="text-lg text-gray-200 mt-4">
                        Explore and purchase your favorite games with ease.
                    </p>
                </div>

                {/* Game Store Content */}
                <div className="max-w-7xl mx-auto py-12 px-6 sm:px-8">
                    <div className="bg-gray-800 rounded-lg shadow-lg overflow-hidden">
                        <div className="p-6 text-black">
                            <h2 className="text-2xl font-bold mb-6 text-white">Available Games</h2>
                            <GameStore games={games} onAddToCart={handleAddToCart} />
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default GameStorePage;
