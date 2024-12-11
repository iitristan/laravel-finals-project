<?php

namespace App\Http\Controllers;


use App\Http\Controllers\Controller;


use Illuminate\Http\Request;
use App\Models\Review;
use Illuminate\Support\Facades\Auth;
use Intervention\Image\Facades\Image;

class ReviewController extends Controller
{
    public function index()
    {
        $reviews = Review::with('user')->latest()->get();
        return response()->json(['data' => $reviews]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'review' => 'required|string|max:500',
            'rating' => 'required|integer|min:1|max:5',
            'image' => 'nullable|image|max:2048',
        ]);
    
        $imagePath = null;
    
        if ($request->hasFile('image')) {
            $image = $request->file('image');
            $imagePath = $image->store('reviews', 'public');
    
            // Resize using Intervention Image
            $img = \Intervention\Image\Facades\Image::make(public_path("storage/{$imagePath}"))->resize(800, 800);
            $img->save();
        }
    
        $review = Review::create([
            'user_id' => Auth::id(),
            'review' => $request->input('review'),
            'rating' => $request->input('rating'),
            'image' => $imagePath,
        ]);
    
       
        return back();
    }
    public function adminIndex()
{
    $reviews = Review::withTrashed()->get();
    return response()->json($reviews);
}

public function update(Request $request, Review $review)
{
    $request->validate([
        'review' => 'required|string|max:500',
        'rating' => 'required|integer|min:1|max:5',
    ]);

    $review->update($request->only('review', 'rating'));
    return response()->json(['message' => 'Review updated successfully']);
}

public function destroy(Request $request, Review $review)
{
    if ($request->query('force')) {
        $review->forceDelete();
        return response()->json(['message' => 'Review permanently deleted']);
    } else {
        $review->delete();
        return response()->json(['message' => 'Review soft deleted']);
    }
}

public function restore($id)
{
    $review = Review::withTrashed()->findOrFail($id);
    $review->restore();
    return response()->json(['message' => 'Review restored successfully']);
}
}    