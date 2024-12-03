import { Head } from '@inertiajs/react';
import { useState, useEffect, useMemo } from 'react';
import AdminNavbar from '@/Navbars/AdminNavbar';
import GameTable from '@/Components/Manage Games/GameTable';
import AddGameModal from '@/Components/Manage Games/AddGameModal';
import SearchAndFilter from '@/Components/Manage Games/SearchAndFilter';
import ResultsSummary from '@/Components/Manage Games/ResultsSummary';
import { rawgApi } from '@/services/rawgApi';
import axios from 'axios';
import route from 'ziggy-js';
import { Game, ManagedGame } from '@/types/game';
import { GameInput } from '@/types/gameInput';

interface Props {
    games: ManagedGame[];
}

export default function ManageGames({ games: initialGames }: Props) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState<Game[]>([]);
    const [loading, setLoading] = useState(false);
    const [managedGames, setManagedGames] = useState<ManagedGame[]>(initialGames);
    const [gameInputs, setGameInputs] = useState<Record<number, GameInput>>({});
    const [tableSearchQuery, setTableSearchQuery] = useState('');
    const [selectedGenre, setSelectedGenre] = useState<string>('');

    const filteredGames = useMemo(() => {
        return managedGames.filter(game => {
            const matchesSearch = game.name.toLowerCase().includes(tableSearchQuery.toLowerCase());
            const matchesGenre = selectedGenre === '' || game.genres?.some(genre => genre.name === selectedGenre);
            return matchesSearch && matchesGenre;
        });
    }, [managedGames, tableSearchQuery, selectedGenre]);

    useEffect(() => {
        const searchGames = async () => {
            setLoading(true);
            try {
                if (searchQuery.trim()) {
                    const data = await rawgApi.searchGames(searchQuery);
                    setSearchResults(data.results);
                } else {
                    const data = await rawgApi.getGames(1, 10);
                    setSearchResults(data.results);
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

    const handleInputChange = (gameId: number, field: 'price' | 'quantity', value: string) => {
        setGameInputs(prev => ({
            ...prev,
            [gameId]: {
                ...prev[gameId],
                [field]: value
            }
        }));
    };

    const handleAddGame = async (game: Game) => {
        const inputs = gameInputs[game.id] || { price: '', quantity: '' };
        const price = parseFloat(inputs.price);
        const quantity = parseInt(inputs.quantity);

        if (isNaN(price) || isNaN(quantity)) {
            alert('Please enter valid price and quantity');
            return;
        }

        try {
            const response = await axios.post(route('admin.games.store'), {
                name: game.name,
                slug: game.slug,
                background_image: game.background_image,
                price,
                quantity,
                status: 'active',
                rating: game.rating,
                genres: game.genres,
            });

            if (response.status === 201) {
                const newGame = response.data;
                setManagedGames(prevGames => [...prevGames, newGame]);
                setIsModalOpen(false);
                setGameInputs(prev => {
                    const newInputs = { ...prev };
                    delete newInputs[game.id];
                    return newInputs;
                });
            }
        } catch (error) {
            console.error('Error adding game:', error);
            if (axios.isAxiosError(error)) {
                alert(error.response?.data?.error || 'Failed to add game');
            }
        }
    };

    const handleGameUpdate = (updatedGame: ManagedGame) => {
        setManagedGames(prevGames => 
            prevGames.map(game => 
                game.id === updatedGame.id ? updatedGame : game
            )
        );
    };

    const handleGameDelete = (gameId: number) => {
        setManagedGames(prevGames => 
            prevGames.filter(game => game.id !== gameId)
        );
    };

    return (
        <>
            <Head title="Manage Games" />
            <div className="min-h-screen bg-gray-100">
                <AdminNavbar />
                <div className="py-10">
                    <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                        <div className="bg-white overflow-hidden shadow-xl sm:rounded-lg p-6">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-2xl font-semibold text-gray-800">Games</h2>
                                <button
                                    onClick={() => setIsModalOpen(true)}
                                    className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
                                >
                                    Add Game
                                </button>
                            </div>

                            <SearchAndFilter
                                tableSearchQuery={tableSearchQuery}
                                setTableSearchQuery={setTableSearchQuery}
                                selectedGenre={selectedGenre}
                                setSelectedGenre={setSelectedGenre}
                                managedGames={managedGames}
                            />

                            <ResultsSummary
                                filteredGamesCount={filteredGames.length}
                                totalGamesCount={managedGames.length}
                                selectedGenre={selectedGenre}
                                tableSearchQuery={tableSearchQuery}
                            />

                            <GameTable 
                                games={filteredGames} 
                                onGameUpdate={handleGameUpdate}
                                onGameDelete={handleGameDelete}
                            />
                        </div>
                    </div>
                </div>
            </div>

            <AddGameModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
                loading={loading}
                searchResults={searchResults}
                gameInputs={gameInputs}
                onInputChange={handleInputChange}
                onAddGame={handleAddGame}
            />
        </>
    );
}
