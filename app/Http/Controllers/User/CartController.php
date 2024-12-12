<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CartController extends Controller
{
    public function index()
    {
        $cartItems = session()->get('cart', []);
        $total = $this->calculateTotal($cartItems);

        return Inertia::render('User/Cart', [
            'cartItems' => array_values($cartItems),
            'total' => $total,
            'flash' => [
                'success' => session('success'),
                'error' => session('error')
            ]
        ]);
    }

    public function update(Request $request, $gameId)
    {
        $cart = session()->get('cart', []);
        
        if (isset($cart[$gameId])) {
            $cart[$gameId]['quantity'] = $request->quantity;
            session()->put('cart', $cart);
            
            if ($request->wantsJson()) {
                return response()->json([
                    'message' => 'Cart updated successfully'
                ]);
            }
        }

        return redirect()->back()->with('success', 'Cart updated successfully');
    }

    public function add(Request $request, $gameId)
    {
        $game = Game::findOrFail($gameId);
        $cart = session()->get('cart', []);

        if (!isset($cart[$gameId])) {
            $cart[$gameId] = [
                'game' => $game,
                'quantity' => 1
            ];
        } else {
            $cart[$gameId]['quantity']++;
        }

        session()->put('cart', $cart);

        if ($request->wantsJson()) {
            return response()->json([
                'message' => "{$game->name} added to cart"
            ]);
        }

        return redirect()->back()->with('success', "{$game->name} added to cart");
    }

    public function removeAll()
    {
        session()->forget('cart');
        
        if (request()->wantsJson()) {
            return response()->json([
                'message' => 'Cart cleared successfully'
            ]);
        }

        return redirect()->back()->with('success', 'Cart cleared successfully');
    }

    private function calculateTotal($cartItems)
    {
        return array_reduce($cartItems, function($carry, $item) {
            return $carry + ($item['game']['price'] * $item['quantity']);
        }, 0);
    }
} 