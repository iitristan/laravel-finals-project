<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use App\Models\Game;
use Inertia\Inertia;

class StoreController extends Controller
{
    public function index()
    {
        $games = Game::with('genres')
            ->where('status', 'active')
            ->get();

        return Inertia::render('User/GameStore', [
            'games' => $games
        ]);
    }

    public function addToCart(Game $game)
    {
        // TODO: Implement cart functionality
        return back()->with('success', 'Game added to cart');
    }
}
