<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Report;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ReportController extends Controller
{
    public function index()
    {
        $reports = Report::with(['user', 'area'])->orderBy('created_at', 'desc')->get();
        return response()->json($reports);
    }

    public function store(Request $request)
    {
        $request->validate([
            'area_id' => 'required|exists:areas,area_id',
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'url_photo' => 'nullable|string|max:255'
        ]);

        $report = Report::create([
            'user_id' => Auth::user()->user_id,
            'area_id' => $request->area_id,
            'title' => $request->title,
            'description' => $request->description,
            'url_photo' => $request->url_photo,
        ]);

        return response()->json($report, 201);
    }

    public function show($id)
    {
        $report = Report::with(['user', 'area'])->findOrFail($id);
        return response()->json($report);
    }

    public function update(Request $request, $id)
    {
        $report = Report::findOrFail($id);

        $request->validate([
            'area_id' => 'sometimes|exists:areas,area_id',
            'title' => 'sometimes|string|max:255',
            'description' => 'sometimes|string',
            'url_photo' => 'nullable|string|max:255',
            'admin_update_note' => 'nullable|string',
            'admin_update_photo' => 'nullable|string|max:255',
            'status' => 'nullable|in:pending,in_progress,resolved,rejected'
        ]);

        $report->update($request->all());
        return response()->json($report);
    }

    public function destroy($id)
    {
        $report = Report::findOrFail($id);
        $report->delete();
        return response()->json(['message' => 'Report deleted successfully']);
    }
}
