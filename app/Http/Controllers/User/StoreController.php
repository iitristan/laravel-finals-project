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

        return Inertia::render('User/GameStore', [
            'games' => $games
        ]);
    }

    public function addToCart(Request $request, Game $game)
    {
        $request->validate([
            'quantity' => 'required|integer|min:1|max:' . $game->quantity,
        ]);

        $cart = Cart::firstOrCreate([
            'user_id' => Auth::id(),
        ]);

        $cartItem = $cart->items()->where('game_id', $game->id)->first();

        if ($cartItem) {
            $newQuantity = $cartItem->quantity + $request->quantity;
            if ($newQuantity > $game->quantity) {
                return back()->with('error', 'Not enough stock available');
            }
            $cartItem->update(['quantity' => $newQuantity]);
        } else {
            $cart->items()->create([
                'game_id' => $game->id,
                'quantity' => $request->quantity,
            ]);
        }

        return back()->with('success', 'Game added to cart');
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
        $cart = Cart::where('user_id', Auth::id())->first();
        
        if ($cart) {
            $cart->items()->where('game_id', $game->id)->delete();
            
            if (request()->wantsJson()) {
                return response()->json([
                    'success' => true,
                    'message' => 'Item removed from cart'
                ]);
            }
            
            return back()->with('success', 'Item removed from cart');
        }

        if (request()->wantsJson()) {
            return response()->json([
                'success' => false,
                'message' => 'Item not found in cart'
            ], 404);
        }

        return back()->with('error', 'Item not found in cart');
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
}
