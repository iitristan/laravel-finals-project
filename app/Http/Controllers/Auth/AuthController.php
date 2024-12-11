<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;

class AuthController extends Controller
{
    public function showLogin()
    {
        return Inertia::render('Auth/Login');
    }

    public function showRegister()
    {
        return Inertia::render('Auth/Register');
    }

    public function login(Request $request)
    {
        $credentials = $request->validate([
            'email' => 'required|email',
            'password' => 'required',
        ]);

        // Check if email exists first
        $user = User::where('email', $credentials['email'])->first();
        
        if (!$user) {
            return back()->withErrors([
                'credentials' => 'No user account found with these credentials.',
            ]);
        }

        if (Auth::attempt($credentials, $request->boolean('remember'))) {
            $request->session()->regenerate();
            return redirect()->intended('/dashboard');
        }

        return back()->withErrors([
            'credentials' => 'The provided credentials do not match our records.',
        ]);
    }

    public function register(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => [
                'required',
                'string',
                'min:8',
                'confirmed',
                'regex:/[a-z]/',      // at least one lowercase letter
                'regex:/[A-Z]/',      // at least one uppercase letter
                'regex:/[0-9]/',      // at least one number
                'regex:/[@$!%*#?&]/', // at least one special character
            ],
        ], [
            'email.unique' => 'An account with this email already exists.',
            'password.min' => 'Password must be at least 8 characters long.',
            'password.confirmed' => 'Password confirmation does not match.',
            'password.regex' => 'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character.',
        ]);

        try {
            $user = User::create([
                'name' => $validated['name'],
                'email' => $validated['email'],
                'password' => Hash::make($validated['password']),
            ]);

            Auth::login($user);
            return redirect('/dashboard')->with('success', 'Account created successfully! Welcome aboard!');
        } catch (\Exception $e) {
            return back()->withErrors([
                'error' => 'Registration failed. Please try again later.',
            ]);
        }
    }

    public function logout(Request $request)
    {
        Auth::logout();
 $request->session()->invalidate();
        $request->session()->regenerateToken();
                return redirect('/');
    }
}
