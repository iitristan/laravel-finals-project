interface Props {
    filteredGamesCount: number;
    totalGamesCount: number;
    selectedGenre: string;
    tableSearchQuery: string;
}

export default function ResultsSummary({
    filteredGamesCount,
    totalGamesCount,
    selectedGenre,
    tableSearchQuery
}: Props) {
    return (
        <div className="mb-4 text-sm text-gray-600">
            Showing {filteredGamesCount} of {totalGamesCount} games
            {selectedGenre && ` in ${selectedGenre}`}
            {tableSearchQuery && ` matching "${tableSearchQuery}"`}
        </div>
    );
} 