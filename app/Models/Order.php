<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class Order extends Model
{
    protected $fillable = ['user_id', 'total', 'status', 'order_number'];

    protected static function boot()
    {
        parent::boot();
        
        static::creating(function ($order) {
            $order->order_number = strtoupper(Str::random(8));
        });
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function games()
    {
        return $this->belongsToMany(Game::class, 'order_games')
            ->withPivot('quantity', 'price')
            ->withTimestamps();
    }
} 