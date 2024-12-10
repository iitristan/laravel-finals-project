<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use App\Models\Game;
use Inertia\Inertia;

class GameController extends Controller
{
    public function show($slug)
    {
        $game = Game::where('slug', $slug)->firstOrFail();
        
        return Inertia::render('Games/Show', [
            'game' => $game
        ]);
    }
} 