<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use App\Models\Genre;

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
    ];

    protected $casts = [
        'price' => 'decimal:2',
        'quantity' => 'integer',
        'rating' => 'float',
    ];

    public function genres(): BelongsToMany
    {
        return $this->belongsToMany(Genre::class);
    }
}
