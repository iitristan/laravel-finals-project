<?php

use App\Http\Controllers\AdminController;
use App\Http\Controllers\Admin\GameController;
use App\Http\Controllers\Admin\OrderController;
use App\Http\Controllers\Admin\UserController;
use App\Http\Controllers\Auth\AuthController;
use App\Http\Controllers\User\StoreController;
use App\Http\Controllers\User\WishlistController;
use App\Http\Controllers\User\OrderController as UserOrderController;
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
        Route::get('/orders', [OrderController::class, 'index'])->name('admin.orders.index');
        Route::get('/orders/{id}', [OrderController::class, 'show'])->name('admin.orders.show');
        Route::post('/orders/{id}/status', [OrderController::class, 'updateStatus'])
            ->name('admin.orders.update-status')
            ->middleware(['auth', 'verified']);
        
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
    Route::get('/games/{game}', [StoreController::class, 'show'])->name('games.show');

    // Cart Routes
    Route::middleware(['auth'])->group(function () {
        Route::get('/cart', [StoreController::class, 'viewCart'])->name('cart.index');
        Route::post('/cart/add/{game}', [StoreController::class, 'addToCart'])->name('cart.add');
        Route::post('/cart/update/{game}', [StoreController::class, 'updateCartQuantity'])->name('cart.update');
        Route::post('/cart/remove/{game}', [StoreController::class, 'removeFromCart'])->name('cart.remove');
        Route::post('/cart/remove-all', [StoreController::class, 'removeAllFromCart'])->name('cart.removeAll');
    });

    Route::post('/checkout', [UserOrderController::class, 'store'])->name('checkout');
    Route::get('/orders', [UserOrderController::class, 'index'])->name('orders');

    // Wishlist Routes
    Route::post('/wishlist/{game}/add', [WishlistController::class, 'addToWishlist'])->name('wishlist.add');
    Route::get('/wishlist', [WishlistController::class, 'index'])->name('wishlist.index');
});

Route::middleware(['auth:admin'])->group(function () {
    Route::post('/admin/orders/{id}/status', [OrderController::class, 'updateStatus'])
        ->name('admin.orders.update-status')
        ->middleware(['auth', 'verified']);
});
