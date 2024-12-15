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
        ]);

        try {
            // unique name checker sa mga laro!!!!!!!!!!!
            $existingGame = Game::where('name', $validated['name'])
                ->orWhere('slug', $validated['slug'])
                ->first();

            if ($existingGame) {
                return response()->json([
                    'error' => 'Game already exists',
                    'message' => "{$validated['name']} already exists in the store!"
                ], 422);
            }

            $game = Game::create($validated);
            return response()->json([
                'game' => $game,
                'message' => "{$game->name} added successfully!"
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Failed to add game',
                'details' => $e->getMessage()
            ], 500);
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
            
            if ($request->wantsJson()) {
                return response()->json([
                    'game' => $game,
                    'message' => "{$game->name} updated successfully!"
                ]);
            }

            return back()->with('success', "{$game->name} updated successfully!");
        } catch (\Exception $e) {
            if ($request->wantsJson()) {
                return response()->json([
                    'error' => 'Failed to update game',
                    'details' => $e->getMessage()
                ], 500);
            }

            return back()->with('error', 'Failed to update game');
        }
    }

    public function destroy(Game $game)
    {
        $game->delete();
        
        return redirect()->back()
            ->with('message', 'Game deleted successfully!');
    }
}
