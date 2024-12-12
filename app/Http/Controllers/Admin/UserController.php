<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\User;
use Inertia\Inertia;

class UserController extends Controller
{
    /**
     * Display a listing of users.
     */
    public function index()
    {
        $users = User::select('id', 'name', 'email', 'created_at')->get();
        return Inertia::render('Admin/ManageUsers', [
            'users' => $users,
        ]);
    }

    /**
     * Show the details of a specific user.
     */
    public function show($id)
    {
        $user = User::find($id);

        if (!$user) {
            return redirect()->route('admin.users')->withErrors('User not found.');
        }

        return Inertia::render('Admin/Users/Show', [
            'user' => $user,
        ]);
    }

    /**
     * Update the status of a user (e.g., activate or deactivate).
     */
    public function updateStatus(Request $request, $id)
    {
        $user = User::find($id);

        if (!$user) {
            return response()->json([
                'success' => false,
                'message' => 'User not found.',
            ], 404);
        }

        $request->validate([
            'status' => 'required|boolean',
        ]);

        $user->status = $request->input('status');
        $user->save();

        return response()->json([
            'success' => true,
            'message' => 'User status updated successfully.',
        ]);
    }

    /**
     * Fetch all users from the database.
     */
    public function fetchUsers()
    {
        $users = User::select('id', 'name', 'email', 'created_at')->get();
    
        return response()->json(['users' => $users]);
    }
    

    /**
     * Delete a user by ID.
     */
    public function deleteUser($id)
    {
        $user = User::find($id);

        if (!$user) {
            return response()->json([
                'success' => false,
                'message' => 'User not found.',
            ], 404);
        }

        $user->delete();

        return response()->json([
            'success' => true,
            'message' => 'User deleted successfully.',
        ]);
    }
}
