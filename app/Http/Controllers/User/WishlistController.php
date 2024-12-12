<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use App\Models\Game;
use App\Models\Wishlist;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class WishlistController extends Controller
{
    public function index()
    {
        $wishlist = Wishlist::firstOrCreate(['user_id' => Auth::id()]);
        $wishlistItems = $wishlist->games()->with('genres')->get();

        return Inertia::render('User/Wishlist', [
            'wishlistItems' => $wishlistItems
        ]);
    }

    public function addToWishlist(Game $game)
    {
        $wishlist = Wishlist::firstOrCreate(['user_id' => Auth::id()]);
        
        try {
            // Check if game is already in wishlist
            if (!$wishlist->games()->where('game_id', $game->id)->exists()) {
                $wishlist->games()->attach($game->id);
                return redirect()->back()->with('success', 'Game added to wishlist');
            }
            return redirect()->back()->with('info', 'Game is already in wishlist');
        } catch (\Exception $e) {
            return redirect()->back()->with('error', 'Failed to add game to wishlist');
        }
    }

    public function removeFromWishlist(Game $game)
    {
        $wishlist = Wishlist::where('user_id', Auth::id())->first();
        
        if (!$wishlist) {
            return redirect()->back()->with('error', 'Wishlist not found');
        }

        try {
            $wishlist->games()->detach($game->id);
            return redirect()->back()->with('success', 'Game removed from wishlist');
        } catch (\Exception $e) {
            return redirect()->back()->with('error', 'Failed to remove game from wishlist');
        }
    }
}
