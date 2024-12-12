import { ManagedGame } from '@/types/game';
import { useState } from 'react';
import { router } from '@inertiajs/react';
import { Edit2, Trash2 } from 'lucide-react';
import EditGameModal from './EditGameModal';
import { useToast } from '@/Contexts/ToastContext';

interface Props {
    game: ManagedGame;
    onUpdate: (updatedGame: ManagedGame) => void;
    onDelete: (gameId: number) => void;
}

export default function GameTableRow({ game, onUpdate, onDelete }: Props) {
    const { showToast } = useToast();
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);

    const handleDelete = () => {
        if (confirm('Are you sure you want to delete this game?')) {
            router.post(`/admin/games/${game.id}`, {
                _method: 'DELETE'
            }, {
                preserveScroll: true,
                onSuccess: () => {
                    onDelete(game.id);
                    showToast(`${game.name} deleted successfully`, 'success');
                },
                onError: () => {
                    showToast('Failed to delete game', 'error');
                }
            });
        }
    };

    const calculateTotalStockValue = (price: number, quantity: number) => {
        return (price * quantity).toFixed(2);
    };

    return (
        <tr>
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
                    ${calculateTotalStockValue(game.price, game.quantity)}
                </div>
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900">
                    {game.rating ? game.rating.toFixed(1) : 'N/A'}
                </div>
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
                <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                    {game.status}
                </span>
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center space-x-2">
                    <button
                        onClick={() => setIsEditModalOpen(true)}
                        className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
                        title="Edit game"
                    >
                        <Edit2 className="w-5 h-5" />
                    </button>
                    <button
                        onClick={handleDelete}
                        className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 transition-colors"
                        title="Delete game"
                    >
                        <Trash2 className="w-5 h-5" />
                    </button>
                </div>
            </td>
            <EditGameModal
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                game={game}
                onUpdate={onUpdate}
            />
        </tr>
    );
}