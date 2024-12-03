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
    genres: {
        id: number;
        name: string;
        slug: string;
    }[];
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
                                                Rating
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Genres
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
                                                    <div className="text-sm text-gray-900">
                                                        {game.rating ? game.rating.toFixed(1) : 'N/A'}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm text-gray-900">
                                                        {game.genres ? game.genres.map(g => g.name).join(', ') : 'N/A'}
                                                    </div>
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
                <div className="fixed inset-0 bg-black bg-opacity-50 overflow-y-auto h-full w-full z-50">
                    <div className="relative top-10 mx-auto p-8 border w-[800px] shadow-2xl rounded-xl bg-white">
                        {/* Modal Header */}
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-2xl font-bold text-gray-800">Add New Game</h3>
                            <button 
                                onClick={() => setIsModalOpen(false)}
                                className="text-gray-400 hover:text-gray-600 transition duration-150"
                            >
                                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        {/* Search Section */}
                        <div className="mb-6">
                            <div className="relative">
                                <input
                                    type="text"
                                    placeholder="Search for games..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full px-4 py-3 pl-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-150"
                                />
                                <div className="absolute left-4 top-3.5 text-gray-400">
                                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                    </svg>
                                </div>
                            </div>
                        </div>

                        {/* Games List */}
                        {loading ? (
                            <div className="flex justify-center items-center py-8">
                                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
                            </div>
                        ) : (
                            <div className="max-h-[600px] overflow-y-auto pr-2">
                                <div className="grid grid-cols-1 gap-4">
                                    {searchResults.map((game) => (
                                        <div 
                                            key={game.id} 
                                            className="flex bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition duration-150"
                                        >
                                            <img 
                                                src={game.background_image} 
                                                alt={game.name}
                                                className="h-32 w-48 object-cover rounded-lg"
                                            />
                                            <div className="ml-4 flex-grow">
                                                <div className="flex justify-between items-start">
                                                    <div>
                                                        <h4 className="text-lg font-semibold text-gray-800">{game.name}</h4>
                                                        <div className="mt-1 text-sm text-gray-600">
                                                            <div className="flex items-center gap-2 mb-1">
                                                                <svg className="h-4 w-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                                                                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                                                </svg>
                                                                <span>{game.rating.toFixed(1)}</span>
                                                            </div>
                                                            <p className="text-sm text-gray-500">
                                                                {game.genres?.map(g => g.name).join(', ')}
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-3">
                                                        <input
                                                            type="number"
                                                            placeholder="Price"
                                                            value={gameInputs[game.id]?.price || ''}
                                                            onChange={(e) => handleInputChange(game.id, 'price', e.target.value)}
                                                            className="w-24 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                        />
                                                        <input
                                                            type="number"
                                                            placeholder="Quantity"
                                                            value={gameInputs[game.id]?.quantity || ''}
                                                            onChange={(e) => handleInputChange(game.id, 'quantity', e.target.value)}
                                                            className="w-24 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                        />
                                                        <button
                                                            onClick={() => handleAddGame(game)}
                                                            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition duration-150 flex items-center gap-2"
                                                        >
                                                            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                                            </svg>
                                                            Add
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </>
    );
}
