<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use App\Models\Game;
use App\Models\Cart;
use App\Models\CartItem;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;

class StoreController extends Controller
{
    public function index()
    {
        $games = Game::with('genres')
            ->where('status', 'active')
            ->get();

        // Add wishlist information to games
        if (Auth::check()) {
            $wishlist = Auth::user()->wishlist;
            if ($wishlist) {
                $wishlistGameIds = $wishlist->games()->pluck('games.id')->toArray();
                $games->each(function ($game) use ($wishlistGameIds) {
                    $game->in_wishlist = in_array($game->id, $wishlistGameIds);
                });
            }
        }

        return Inertia::render('User/GameStore', [
            'games' => $games
        ]);
    }

    public function addToCart(Request $request, Game $game)
    {
        $request->validate([
            'quantity' => [
                'required',
                'integer',
                'min:1',
                'max:' . $game->quantity,
                function ($attribute, $value, $fail) use ($game) {
                    if ($value > $game->quantity) {
                        $fail('The requested quantity exceeds available stock.');
                    }
                },
            ],
        ]);

        // Check if game is active
        if ($game->status !== 'active') {
            return back()->with('error', 'This game is currently not available for purchase.');
        }

        $cart = Cart::firstOrCreate([
            'user_id' => Auth::id(),
        ]);

        $cartItem = $cart->items()->where('game_id', $game->id)->first();

        if ($cartItem) {
            $newQuantity = $cartItem->quantity + $request->quantity;
            if ($newQuantity > $game->quantity) {
                return back()->with('error', 'The total quantity would exceed available stock');
            }
            $cartItem->update(['quantity' => $newQuantity]);
        } else {
            $cart->items()->create([
                'game_id' => $game->id,
                'quantity' => $request->quantity,
            ]);
        }

        return back()->with('success', 'Game added to cart successfully');
    }

    public function viewCart()
    {
        $cart = Cart::with(['items.game'])
            ->where('user_id', Auth::id())
            ->first();

        $cartItems = [];
        $total = 0;

        if ($cart) {
            $cartItems = $cart->items->map(function ($item) {
                return [
                    'game' => $item->game,
                    'quantity' => $item->quantity,
                ];
            });
            $total = $cart->getTotal();
        }

        return Inertia::render('User/Cart', [
            'cartItems' => $cartItems,
            'total' => $total,
        ]);
    }

    public function removeFromCart(Game $game)
    {
        $cart = Cart::where('user_id', Auth::id())->firstOrFail();
        
        $cartItem = $cart->items()->where('game_id', $game->id)->first();
        
        if (!$cartItem) {
            return response()->json([
                'success' => false,
                'message' => 'Item not found in cart'
            ], 404);
        }
        
        $cartItem->delete();
        
        if (request()->wantsJson()) {
            return response()->json([
                'success' => true,
                'message' => 'Item removed from cart successfully'
            ]);
        }
        
        return back()->with('success', 'Item removed from cart');
    }

    public function updateCartQuantity(Request $request, Game $game)
    {
        $request->validate([
            'quantity' => 'required|integer|min:1|max:' . $game->quantity,
        ]);

        $cart = Cart::where('user_id', Auth::id())->first();
        
        if ($cart) {
            $cart->items()
                ->where('game_id', $game->id)
                ->update(['quantity' => $request->quantity]);
        }

        return back()->with('success', 'Cart updated');
    }

    public function removeAllFromCart()
    {
        $cart = Cart::where('user_id', Auth::id())->first();
        
        if ($cart) {
            $cart->items()->delete();
            return back()->with('success', 'Cart cleared successfully');
        }

        return back()->with('error', 'Cart is already empty');
    }

    public function show(Game $game)
    {
        $game->load('genres');
        
        // Add wishlist information
        if (Auth::check()) {
            $wishlist = Auth::user()->wishlist;
            if ($wishlist) {
                $game->in_wishlist = $wishlist->games()->where('games.id', $game->id)->exists();
            }
        }

        return Inertia::render('User/GameDetails', [
            'game' => $game
        ]);
    }
}
