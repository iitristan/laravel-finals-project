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
        try {
            $status = $request->input('status');
            if (!$status) {
                return response()->json([
                    'error' => 'Status is required'
                ], 422);
            }

            $order = Order::findOrFail($id);
            $order->status = $status;
            $order->save();

            // mga message sa status!!!!
            $message = match ($status) {
                'to be shipped' => "Order #{$order->id} has been marked for shipping",
                'shipped' => "Order #{$order->id} has been shipped successfully",
                default => "Order #{$order->id} status updated to {$status}"
            };

            if ($request->wantsJson()) {
                return response()->json([
                    'message' => $message
                ]);
            }

            return redirect()->back()->with('success', $message);

        } catch (\Exception $e) {
            if ($request->wantsJson()) {
                return response()->json([
                    'error' => 'Failed to update order status',
                    'details' => $e->getMessage()
                ], 500);
            }

            return redirect()->back()->with('error', 'Failed to update order status');
        }
    }
}
