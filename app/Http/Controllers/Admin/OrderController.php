<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Order;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;

class OrderController extends Controller
{
    public function index()
    {
        $orders = Order::with(['user', 'games'])
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(function ($order) {
                return [
                    'id' => $order->id,
                    'total' => $order->total,
                    'status' => $order->status,
                    'created_at' => $order->created_at,
                    'user' => [
                        'id' => $order->user->id,
                        'name' => $order->user->name,
                    ],
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

        return Inertia::render('Admin/ManageOrders', [
            'orders' => $orders
        ]);
    }

    public function updateStatus(Request $request, $id)
    {
        $status = $request->input('status');
        if (!$status) {
            throw new \Exception('Status is required');
        }

        $order = Order::findOrFail($id);
        $order->status = $status;
        $order->saveOrFail();

        return redirect()->back();
    }
}
