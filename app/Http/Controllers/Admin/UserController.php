<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;

class UserController extends Controller
{
    public function index()
    {
        return Inertia::render('Admin/Users/Index');
    }

    public function show($id)
    {
        return Inertia::render('Admin/Users/Show');
    }

    public function updateStatus(Request $request, $id)
    {
        // Add user status update logic
    }
}
