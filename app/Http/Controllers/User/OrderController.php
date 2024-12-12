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
            if ($request->wantsJson()) {
                return response()->json([
                    'error' => 'Cart is empty'
                ], 422);
            }
            return redirect()->back()->with('error', 'Cart is empty');
        }

        try {
            \DB::beginTransaction();

            $total = array_sum(array_map(function($item) {
                return $item['quantity'] * $item['game']['price'];
            }, $cartItems));

            $order = Order::create([
                'user_id' => $user->id,
                'total' => $total,
                'status' => 'to be packed'
            ]);

            foreach ($cartItems as $item) {
                $game = \App\Models\Game::find($item['game']['id']);
                
                if ($game->quantity < $item['quantity']) {
                    \DB::rollBack();
                    $errorMessage = "Insufficient stock for {$game->name}";
                    
                    if ($request->wantsJson()) {
                        return response()->json(['error' => $errorMessage], 422);
                    }
                    return redirect()->back()->with('error', $errorMessage);
                }

                $game->decrement('quantity', $item['quantity']);

                $order->games()->attach($item['game']['id'], [
                    'quantity' => $item['quantity'],
                    'price' => $item['game']['price']
                ]);
            }

            \DB::commit();
            session()->forget('cart');

            $successMessage = 'Order placed successfully';
            
            if ($request->wantsJson()) {
                return response()->json([
                    'message' => $successMessage,
                    'redirect' => route('orders')
                ]);
            }

            return redirect()->route('orders')->with('success', $successMessage);

        } catch (\Exception $e) {
            \DB::rollBack();
            $errorMessage = 'Failed to create order';
            
            if ($request->wantsJson()) {
                return response()->json(['error' => $errorMessage], 500);
            }
            return redirect()->back()->with('error', $errorMessage);
        }
    }

    public function index()
    {
        $orders = auth()->user()
            ->orders()
            ->with('games')
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(function ($order) {
                return [
                    'id' => $order->id,
                    'order_number' => $order->order_number,
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
            });

        return Inertia::render('User/Orders', [
            'orders' => $orders
        ]);
    }
}
