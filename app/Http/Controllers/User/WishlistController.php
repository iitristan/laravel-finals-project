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
            $wishlist->games()->attach($game->id);
            return redirect()->back();
        } catch (\Exception $e) {
            // If the game is already in the wishlist, ignore the error
            if ($e->getCode() === '23000') { // Duplicate entry error
                return redirect()->back();
            }
            
            return redirect()->back();
        }
    }

    public function removeFromWishlist(Game $game)
    {
        $wishlist = Wishlist::where('user_id', Auth::id())->first();
        
        if ($wishlist) {
            $wishlist->games()->detach($game->id);
        }

        return redirect()->back();
    }
}
