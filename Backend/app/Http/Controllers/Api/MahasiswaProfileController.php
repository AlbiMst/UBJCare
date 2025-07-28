<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\MahasiswaProfile;
use App\Models\User;
use Illuminate\Http\Request;

class MahasiswaProfileController extends Controller
{
    public function index()
    {
        $profiles = MahasiswaProfile::with('user')->get();
        return response()->json($profiles);
    }

    public function store(Request $request)
    {
        $request->validate([
            'user_id' => 'required|exists:users,user_id',
            'npm' => 'required|string|max:20',
            'fakultas' => 'required|string|max:100',
            'prodi' => 'required|string|max:100',
        ]);

        $profile = MahasiswaProfile::create($request->all());

        return response()->json($profile, 201);
    }

    public function show($id)
    {
        $profile = MahasiswaProfile::with('user')->findOrFail($id);
        return response()->json($profile);
    }

    public function update(Request $request, $id)
    {
        $profile = MahasiswaProfile::findOrFail($id);

        $request->validate([
            'npm' => 'sometimes|required|string|max:20',
            'fakultas' => 'sometimes|required|string|max:100',
            'prodi' => 'sometimes|required|string|max:100',
        ]);

        $profile->update($request->all());

        return response()->json($profile);
    }

    public function destroy($id)
    {
        $profile = MahasiswaProfile::findOrFail($id);
        $profile->delete();

        return response()->json(['message' => 'Profile deleted successfully']);
    }
}
