<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Position;
use Illuminate\Http\Request;

class PositionController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $positions = Position::paginate(10);

        return inertia('Admin/Positions/Index', [
            'positions' => $positions->items(),
            'meta' => [
                'current_page' => $positions->currentPage(),
                'total_pages' => $positions->lastPage(),
                'per_page' => $positions->perPage(),
                'total_items' => $positions->total(),
            ],
            'success' => session('success'),
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
        ]);

        Position::create($request->all());

        return redirect()->route('admin.positions.index')->with('success', 'Berhasil menambah data jabatan');
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Position $position)
    {
        $request->validate([
            'name' => 'required|string|max:255',
        ]);

        $position->update($request->all());

        return redirect()->route('admin.positions.index')->with('success', 'Berhasil memperbarui data jabatan');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Position $position)
    {
        $position->delete();

        return redirect()->route('admin.positions.index')->with('success', 'Berhasil menghapus data jabatan');
    }
}
