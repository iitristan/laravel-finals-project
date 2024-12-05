import React from 'react';
import UserNavbar from '@/Navbars/UserNavbar';
import { Head } from '@inertiajs/react';
import StoreGameTable from '@/Components/Store/StoreGameTable';
import { ManagedGame } from '@/types/game';
import { router } from '@inertiajs/react';

interface Props {
    games: ManagedGame[];
}

const GameStore = ({ games }: Props) => {
    const handleAddToCart = (gameId: number, quantity: number) => {
        router.post(`/cart/add/${gameId}`, {
            quantity
        }, {
            preserveScroll: true,
        });
    };

    return (
        <>
            <Head title="Game Store" />
            <UserNavbar />
            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            <h1 className="text-2xl font-bold mb-4">Game Store</h1>
                            <StoreGameTable games={games} onAddToCart={handleAddToCart} />
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default GameStore;
