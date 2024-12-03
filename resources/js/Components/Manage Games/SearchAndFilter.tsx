import { useMemo } from 'react';
import { ManagedGame } from '@/types/game';

interface Props {
    tableSearchQuery: string;
    setTableSearchQuery: (query: string) => void;
    selectedGenre: string;
    setSelectedGenre: (genre: string) => void;
    managedGames: ManagedGame[];
}

export default function SearchAndFilter({
    tableSearchQuery,
    setTableSearchQuery,
    selectedGenre,
    setSelectedGenre,
    managedGames
}: Props) {
    const availableGenres = useMemo(() => {
        const genreSet = new Set<string>();
        managedGames.forEach(game => {
            game.genres?.forEach(genre => {
                genreSet.add(genre.name);
            });
        });
        return Array.from(genreSet).sort();
    }, [managedGames]);

    return (
        <div className="mb-6 flex gap-4">
            <div className="flex-1">
                <div className="relative">
                    <input
                        type="text"
                        placeholder="Search games..."
                        value={tableSearchQuery}
                        onChange={(e) => setTableSearchQuery(e.target.value)}
                        className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <div className="absolute left-3 top-2.5 text-gray-400">
                        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </div>
                </div>
            </div>
            <div className="w-64">
                <select
                    value={selectedGenre}
                    onChange={(e) => setSelectedGenre(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                    <option value="">All Genres</option>
                    {availableGenres.map((genre) => (
                        <option key={genre} value={genre}>
                            {genre}
                        </option>
                    ))}
                </select>
            </div>
        </div>
    );
} 