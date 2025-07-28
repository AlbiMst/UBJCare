<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Area;
use Illuminate\Http\Request;

class AreaController extends Controller
{
    public function index()
    {
        $areas = Area::all();
        return response()->json($areas);
    }

    public function store(Request $request)
    {
        $request->validate([
            'area_name' => 'required|string|max:100',
            'description' => 'nullable|string',
            'photo' => 'nullable|string|max:255'
        ]);

        $area = Area::create($request->all());
        return response()->json($area, 201);
    }

    public function show($id)
    {
        $area = Area::findOrFail($id);
        return response()->json($area);
    }

    public function update(Request $request, $id)
    {
        $area = Area::findOrFail($id);

        $request->validate([
            'area_name' => 'sometimes|required|string|max:100',
            'description' => 'nullable|string',
            'photo' => 'nullable|string|max:255'
        ]);

        $area->update($request->all());
        return response()->json($area);
    }

    public function destroy($id)
    {
        $area = Area::findOrFail($id);
        $area->delete();
        return response()->json(['message' => 'Area deleted successfully']);
    }
}
