<?php

namespace App\Http\Controllers\Admin;

use App\Models\Game;
use Illuminate\Http\Request;

class GameController extends Controller
{
    public function store(Request $request) {
        $request->validate([
            'name' => 'required|string',
            'slug' => 'required|string|unique:games',
            'background_image' => 'nullable|string',
            'price' => 'required|numeric',
            'quantity' => 'required|integer',
            'status' => 'required|in:active,inactive',
        ]);

        Game::create($request->all());

        return redirect()->route('admin.games');
    }

    public function index()
    {
        $games = Game::all();
        return response()->json($games);
    }
}
