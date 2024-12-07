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

        \Log::info('Cart contents:', ['items' => $cartItems]); // Debug log

        return Inertia::render('User/Cart', [
            'cartItems' => $cartItems,
            'total' => $total
        ]);
    }

    public function update(Request $request, $gameId)
    {
        $cart = session()->get('cart', []);
        
        if (isset($cart[$gameId])) {
            $cart[$gameId]['quantity'] = $request->quantity;
            session()->put('cart', $cart);
            
            \Log::info('Cart updated:', ['cart' => $cart]); // Debug log
        }

        return redirect()->back();
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
        \Log::info('Item added to cart:', ['cart' => $cart]); // Debug log

        return redirect()->back()->with('success', 'Game added to cart');
    }

    public function removeAll()
    {
        session()->forget('cart');
        \Log::info('Cart cleared'); // Debug log
        return redirect()->back();
    }

    private function calculateTotal($cartItems)
    {
        return array_reduce($cartItems, function($carry, $item) {
            return $carry + ($item['game']['price'] * $item['quantity']);
        }, 0);
    }
} 