<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Order;
use Illuminate\Http\Request;
use Inertia\Inertia;

class OrderController extends Controller
{
    public function index()
    {
        return Inertia::render('Admin/ManageOrders');
    }

    public function show($id)
    {
        return Inertia::render('Admin/Orders/Show');
    }

    public function updateStatus(Request $request, $id)
    {
        // Add order status update logic
    }

    public function store(Request $request)
    {
        $user = auth()->user();
        $cartItems = session()->get('cart', []);
        
        if (empty($cartItems)) {
            return redirect()->back()->with('error', 'Cart is empty');
        }

        $total = collect($cartItems)->sum(function ($item) {
            return $item['game']->price * $item['quantity'];
        });

        // Create the order
        $order = Order::create([
            'user_id' => $user->id,
            'total' => $total,
            'status' => 'pending'
        ]);

        // Attach games to the order
        foreach ($cartItems as $item) {
            $order->games()->attach($item['game']->id, [
                'quantity' => $item['quantity'],
                'price' => $item['game']->price
            ]);
        }

        // Clear the cart
        session()->forget('cart');

        return redirect()->route('orders');
    }
}
