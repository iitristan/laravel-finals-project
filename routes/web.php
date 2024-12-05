<?php

use App\Http\Controllers\AdminController;
use App\Http\Controllers\Admin\GameController;
use App\Http\Controllers\Admin\OrderController;
use App\Http\Controllers\Admin\UserController;
use App\Http\Controllers\Auth\AuthController;
use App\Http\Controllers\User\StoreController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('LandingPage');
});

// Authentication Routes
Route::get('/login', [AuthController::class, 'showLogin'])->name('login');
Route::post('/login', [AuthController::class, 'login']);
Route::get('/register', [AuthController::class, 'showRegister'])->name('register');
Route::post('/register', [AuthController::class, 'register']);
Route::post('/logout', [AuthController::class, 'logout'])->name('logout');

// Admin Routes
Route::prefix('admin')->group(function () {
    Route::get('/login', [AdminController::class, 'loginForm'])->name('admin.login');
    Route::post('login', [AdminController::class, 'login']);
    
    Route::middleware(['auth:admin'])->group(function () {
        Route::get('dashboard', [AdminController::class, 'dashboard'])->name('admin.dashboard');
        Route::post('logout', [AdminController::class, 'logout'])->name('admin.logout');
        
        // Games Management
        Route::get('games', [GameController::class, 'index'])->name('admin.games');
        Route::get('games/create', [GameController::class, 'create'])->name('admin.games.create');
        Route::post('games', [GameController::class, 'store'])->name('admin.games.store');
        Route::get('games/{game}/edit', [GameController::class, 'edit'])->name('admin.games.edit');
        Route::put('games/{game}', [GameController::class, 'update'])->name('admin.games.update');
        Route::delete('games/{game}', [GameController::class, 'destroy'])->name('admin.games.destroy');
        
        // Orders Management
        Route::get('orders', [OrderController::class, 'index'])->name('admin.orders');
        Route::get('orders/{order}', [OrderController::class, 'show'])->name('admin.orders.show');
        Route::put('orders/{order}/status', [OrderController::class, 'updateStatus'])->name('admin.orders.update-status');
        
        // Users Management
        Route::get('users', [UserController::class, 'index'])->name('admin.users');
        Route::get('users/{user}', [UserController::class, 'show'])->name('admin.users.show');
        Route::put('users/{user}/status', [UserController::class, 'updateStatus'])->name('admin.users.update-status');
    });
});

// Protected Routes
Route::middleware(['auth'])->group(function () {
    Route::get('/dashboard', function () {
        return Inertia::render('User/Dashboard');
    })->name('dashboard');

    // Store Routes
    Route::get('/store', [StoreController::class, 'index'])->name('store');

    // Cart Routes
    Route::post('/cart/add/{game}', [StoreController::class, 'addToCart'])->name('cart.add');
    Route::get('/cart', [StoreController::class, 'viewCart'])->name('cart');
    Route::delete('/cart/remove/{game}', [StoreController::class, 'removeFromCart'])->name('cart.remove');
    Route::post('/cart/update/{game}', [StoreController::class, 'updateCartQuantity'])->name('cart.update');

    Route::get('/orders', function () {
        return Inertia::render('User/Orders');
    })->name('orders');

    Route::get('/wishlist', function () {
        return Inertia::render('User/Wishlist');
    })->name('wishlist');
});
