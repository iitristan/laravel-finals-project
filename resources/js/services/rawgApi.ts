const RAWG_API_KEY = '22ba7c38700b477aa101668e13e759c2';
const BASE_URL = 'https://api.rawg.io/api';

export const rawgApi = {
    // Get a list of games
    async getGames(page = 1, pageSize = 20) {
        const response = await fetch(
            `${BASE_URL}/games?key=${RAWG_API_KEY}&page=${page}&page_size=${pageSize}`
        );
        return response.json();
    },

    // Get a single game by ID
    async getGameDetails(id: number) {
        const response = await fetch(
            `${BASE_URL}/games/${id}?key=${RAWG_API_KEY}`
        );
        return response.json();
    },

    // Search games
    async searchGames(query: string) {
        const response = await fetch(
            `${BASE_URL}/games?key=${RAWG_API_KEY}&search=${query}`
        );
        return response.json();
    }
}; 