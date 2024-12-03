import { ManagedGame } from '@/types/game';
import GameTableRow from './GameTableRow';

interface Props {
    games: ManagedGame[];
    onGameUpdate: (updatedGame: ManagedGame) => void;
    onGameDelete: (gameId: number) => void;
}

export default function GameTable({ games, onGameUpdate, onGameDelete }: Props) {
    return (
        <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                    <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Game</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rating</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Genres</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {games.map((game) => (
                        <GameTableRow 
                            key={game.id} 
                            game={game} 
                            onUpdate={onGameUpdate}
                            onDelete={onGameDelete}
                        />
                    ))}
                </tbody>
            </table>
        </div>
    );
}