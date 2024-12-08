<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use App\Models\Order;
use Illuminate\Http\Request;
use Inertia\Inertia;

class OrderController extends Controller
{
    public function store(Request $request)
    {
        $user = auth()->user();
        $cartItems = json_decode($request->cartItems, true);   

        if (empty($cartItems)) {
            return redirect()->back()->with('error', 'Cart is empty');
        }

        try {
            $total = array_sum(array_map(function($item) {
                return $item['quantity'] * $item['game']['price'];
            }, $cartItems));

            $order = Order::create([
                'user_id' => $user->id,
                'total' => $total,
                'status' => 'to be packed'
            ]);

            foreach ($cartItems as $item) {
                $order->games()->attach($item['game']['id'], [
                    'quantity' => $item['quantity'],
                    'price' => $item['game']['price']
                ]);
            }

            session()->forget('cart');
            return redirect()->route('orders')->with('success', 'Order placed successfully');
        } catch (\Exception $e) {
            return redirect()->back()->with('error', 'Failed to create order');
        }
    }

    public function index()
    {
        $orders = auth()->user()
            ->orders()
            ->with('games')
            ->orderBy('created_at', 'desc')
            ->get();

        return Inertia::render('User/Orders', [
            'orders' => $orders->map(function ($order) {
                return [
                    'id' => $order->id,
                    'total' => $order->total,
                    'status' => $order->status,
                    'created_at' => $order->created_at,
                    'games' => $order->games->map(function ($game) {
                        return [
                            'id' => $game->id,
                            'name' => $game->name,
                            'price' => $game->pivot->price,
                            'quantity' => $game->pivot->quantity,
                        ];
                    })
                ];
            })
        ]);
    }
}
