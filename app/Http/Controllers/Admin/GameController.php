<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Game;
use Illuminate\Http\Request;
use Inertia\Inertia;

class GameController extends Controller
{
    public function index()
    {
        return Inertia::render('Admin/ManageGames', [
            'games' => Game::orderBy('id', 'desc')->get()
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'slug' => 'required|string|max:255',
            'background_image' => 'required|string|max:255',
            'price' => 'required|numeric|min:0',
            'quantity' => 'required|integer|min:0',
            'status' => 'required|string|in:active,inactive',
            'rating' => 'nullable|numeric',
            'genres' => 'nullable|array',
        ]);

        try {
            $game = Game::create($validated);
            return response()->json($game, 201);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    public function update(Request $request, Game $game)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'price' => 'required|numeric|min:0',
            'quantity' => 'required|integer|min:0',
            'status' => 'required|string|in:active,inactive',
        ]);

        try {
            $game->update($validated);
            return redirect()->back()->with('success', 'Game updated successfully');
        } catch (\Exception $e) {
            return redirect()->back()->with('error', 'Failed to update game');
        }
    }

    public function destroy(Game $game)
    {
        try {
            $game->delete();
            return redirect()->back()->with('success', 'Game deleted successfully');
        } catch (\Exception $e) {
            return redirect()->back()->with('error', 'Failed to delete game');
        }
    }
}
