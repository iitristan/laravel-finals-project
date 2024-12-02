<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
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
}
