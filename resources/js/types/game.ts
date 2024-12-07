export interface Game {
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

export interface ManagedGame extends Game {
    price: number;
    quantity: number;
    status: 'active' | 'inactive';
    in_wishlist?: boolean;
} 