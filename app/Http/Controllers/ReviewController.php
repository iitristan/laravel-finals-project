<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Review;
use App\Models\User; // Import the User model
use Illuminate\Support\Facades\Auth;
use Intervention\Image\Facades\Image;

class ReviewController extends Controller
{
    public function index()
    {
        $reviews = Review::with('user:id,email')->latest()->get();
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

    public function update(Request $request, $id)
    {
        $review = Review::findOrFail($id);
    
        $request->validate([
            'review' => 'required|string|max:500',
            'rating' => 'required|integer|min:1|max:5',
        ]);
    
        $review->update($request->only('review', 'rating'));
    
        return back(); // Reload the current page
    }
    
    

    public function destroy(Request $request, $id)
{
    $review = Review::withTrashed()->findOrFail($id);

    if ($request->query('force')) {
        $review->forceDelete();
        return response()->noContent(); // Return 204 No Content for successful deletion
    }

    $review->delete();
    return response()->noContent(); // Return 204 No Content for successful soft deletion
}

    
    public function restore($id)
    {
        $review = Review::withTrashed()->findOrFail($id);
        $review->restore();
        return redirect()->back(); // Redirect to the previous page
    }
    

    // New method to get the user ID based on email
    public function getUserIdByEmail(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
        ]);

        $user = User::where('email', $request->email)->first();

        if ($user) {
            return response()->json(['user_id' => $user->id]);
        }

        return response()->json(['message' => 'User not found'], 404);
    }
}
