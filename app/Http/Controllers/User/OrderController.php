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
            return $this->handleErrorResponse($request, 'Cart is empty', 422);
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
                    return $this->handleErrorResponse($request, "Insufficient stock for {$game->name}", 422);
                }

                $game->decrement('quantity', $item['quantity']);

                $order->games()->attach($item['game']['id'], [
                    'quantity' => $item['quantity'],
                    'price' => $item['game']['price']
                ]);
            }

            \DB::commit();
            session()->forget('cart');

            return $this->handleSuccessResponse($request, 'Order placed successfully', route('orders'));

        } catch (\Exception $e) {
            \DB::rollBack();
            return $this->handleErrorResponse($request, 'Failed to create order', 500);
        }
    }

    private function handleErrorResponse($request, $message, $statusCode)
    {
        if ($request->wantsJson()) {
            return response()->json(['error' => $message], $statusCode);
        }
        return redirect()->back()->with('error', $message);
    }

    private function handleSuccessResponse($request, $message, $redirectRoute)
    {
        if ($request->wantsJson()) {
            return response()->json([
                'message' => $message,
                'redirect' => $redirectRoute
            ]);
        }
        return redirect()->route('orders')->with('success', $message);
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
