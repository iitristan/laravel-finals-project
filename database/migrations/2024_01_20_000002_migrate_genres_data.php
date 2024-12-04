<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Str;

return new class extends Migration
{
    public function up(): void
    {
        $games = DB::table('games')->get();
        
        foreach ($games as $game) {
            $genres = json_decode($game->genres ?? '[]', true);
            
            if (is_array($genres)) {
                foreach ($genres as $genreName) {
                    if (is_string($genreName)) {
                        // Find or create genre
                        $genreId = DB::table('genres')->insertGetId([
                            'name' => $genreName,
                            'slug' => Str::slug($genreName),
                            'created_at' => now(),
                            'updated_at' => now(),
                        ]);

                        // Create relationship
                        DB::table('game_genre')->insert([
                            'game_id' => $game->id,
                            'genre_id' => $genreId,
                            'created_at' => now(),
                            'updated_at' => now(),
                        ]);
                    }
                }
            }
        }

        // Remove the genres column from games table
        Schema::table('games', function (Blueprint $table) {
            $table->dropColumn('genres');
        });
    }

    public function down(): void
    {
        // Add back the genres column
        Schema::table('games', function (Blueprint $table) {
            $table->json('genres')->nullable();
        });

        // Migrate data back to JSON format
        $games = DB::table('games')->get();
        foreach ($games as $game) {
            $genres = DB::table('game_genre')
                ->join('genres', 'genres.id', '=', 'game_genre.genre_id')
                ->where('game_id', $game->id)
                ->pluck('genres.name')
                ->toArray();

            DB::table('games')
                ->where('id', $game->id)
                ->update(['genres' => json_encode($genres)]);
        }
    }
};
