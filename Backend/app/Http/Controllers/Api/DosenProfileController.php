<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\DosenProfile;
use Illuminate\Http\Request;

class DosenProfileController extends Controller
{
    public function index()
    {
        $profiles = DosenProfile::with('user')->get();
        return response()->json($profiles);
    }

    public function store(Request $request)
    {
        $request->validate([
            'user_id' => 'required|exists:users,user_id',
            'nidn' => 'required|string|max:20'
        ]);

        $profile = DosenProfile::create($request->all());
        return response()->json($profile, 201);
    }

    public function show($id)
    {
        $profile = DosenProfile::with('user')->findOrFail($id);
        return response()->json($profile);
    }

    public function update(Request $request, $id)
    {
        $profile = DosenProfile::findOrFail($id);

        $request->validate([
            'nidn' => 'sometimes|required|string|max:20'
        ]);

        $profile->update($request->all());
        return response()->json($profile);
    }

    public function destroy($id)
    {
        $profile = DosenProfile::findOrFail($id);
        $profile->delete();
        return response()->json(['message' => 'Profile deleted successfully']);
    }
}
