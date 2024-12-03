import AdminNavbar from '@/Navbars/AdminNavbar';
import { Head } from '@inertiajs/react';
import route from 'ziggy-js';
import { useState, useEffect } from 'react';
import { rawgApi } from '@/services/rawgApi';
import axios from 'axios';

interface Game {
    id: number;
    name: string;
    slug: string;
    background_image: string;
    rating: number;
    released: string;
    metacritic: number;
}

interface ManagedGame extends Game {
    price: number;
    quantity: number;
    status: 'active' | 'inactive';
}

interface GameInput {
    price: string;
    quantity: string;
}

interface Props {
    games: ManagedGame[];
}

export default function GamesIndex({ games: initialGames }: Props) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState<Game[]>([]);
    const [loading, setLoading] = useState(false);
    const [managedGames, setManagedGames] = useState<ManagedGame[]>(initialGames);
    const [gameInputs, setGameInputs] = useState<Record<number, GameInput>>({});

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

    return (
        <>
            <Head title="Manage Games" />
            <AdminNavbar />
            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            <div className="flex justify-between items-center mb-6">
                                <h1 className="text-2xl font-semibold">Manage Games</h1>
                                <button
                                    onClick={() => setIsModalOpen(true)}
                                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                                >
                                    Add New Game
                                </button>
                            </div>
                            
                            {/* Games Table */}
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Game
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Price
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Quantity
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Status
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Actions
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {managedGames.map((game) => (
                                            <tr key={game.id}>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="flex items-center">
                                                        <img 
                                                            src={game.background_image} 
                                                            alt={game.name}
                                                            className="h-10 w-10 rounded-full mr-3"
                                                        />
                                                        <div className="text-sm font-medium text-gray-900">
                                                            {game.name}
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm text-gray-900">${game.price}</div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm text-gray-900">{game.quantity}</div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                                        {game.status}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                    <button className="text-indigo-600 hover:text-indigo-900 mr-4">
                                                        Edit
                                                    </button>
                                                    <button className="text-red-600 hover:text-red-900">
                                                        Delete
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Add Game Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full">
                    <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-medium">Add New Game</h3>
                            <button 
                                onClick={() => setIsModalOpen(false)}
                                className="text-gray-500 hover:text-gray-700"
                            >
                                ×
                            </button>
                        </div>
                        
                        <input
                            type="text"
                            placeholder="Search games..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full p-2 border rounded mb-4"
                        />

                        {loading ? (
                            <div className="text-center py-4">Loading...</div>
                        ) : (
                            <div className="max-h-60 overflow-y-auto mb-4">
                                {searchResults.map((game) => (
                                    <div key={game.id} className="flex items-center p-2 hover:bg-gray-100 cursor-pointer">
                                        <img 
                                            src={game.background_image} 
                                            alt={game.name}
                                            className="h-12 w-12 rounded object-cover mr-3"
                                        />
                                        <div>
                                            <div className="font-medium">{game.name}</div>
                                            <div className="text-sm text-gray-500">
                                                Rating: {game.rating}
                                            </div>
                                            <div className="mt-2">
                                                <input
                                                    type="number"
                                                    placeholder="Price"
                                                    value={gameInputs[game.id]?.price || ''}
                                                    onChange={(e) => handleInputChange(game.id, 'price', e.target.value)}
                                                    className="w-24 p-1 border rounded mr-2"
                                                />
                                                <input
                                                    type="number"
                                                    placeholder="Quantity"
                                                    value={gameInputs[game.id]?.quantity || ''}
                                                    onChange={(e) => handleInputChange(game.id, 'quantity', e.target.value)}
                                                    className="w-24 p-1 border rounded mr-2"
                                                />
                                                <button
                                                    onClick={() => handleAddGame(game)}
                                                    className="bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600"
                                                >
                                                    Add
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            )}
        </>
    );
}
