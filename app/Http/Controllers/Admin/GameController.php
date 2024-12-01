<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;

class GameController extends Controller
{
    public function index()
    {
        return Inertia::render('Admin/Games/Index');
    }

    public function create()
    {
        return Inertia::render('Admin/Games/Create');
    }

    public function store(Request $request)
    {
        // Add validation and game creation logic
    }

    public function edit($id)
    {
        return Inertia::render('Admin/Games/Edit');
    }

    public function update(Request $request, $id)
    {
        // Add validation and game update logic
    }

    public function destroy($id)
    {
        // Add game deletion logic
    }
}
