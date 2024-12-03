<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Game extends Model
{
    protected $fillable = [
        'name',
        'slug',
        'background_image',
        'price',
        'quantity',
        'status',
        'rating',
        'genres'
    ];

    protected $casts = [
        'price' => 'decimal:2',
        'quantity' => 'integer',
        'rating' => 'float',
        'genres' => 'array'
    ];
}
