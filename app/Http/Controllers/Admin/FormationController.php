<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Formation;
use Illuminate\Http\Request;
use Inertia\Inertia;

class FormationController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $formations = Formation::paginate(10);

        return Inertia::render('Admin/Formations/Index', [
            'formations' => $formations->items(),
            'meta' => [
                'current_page' => $formations->currentPage(),
                'total_pages' => $formations->lastPage(),
                'per_page' => $formations->perPage(),
                'total_items' => $formations->total(),
            ],
            'success' => session('success'),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('Admin/Formations/Create', [
            'success' => session('success'),
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255|unique:formations,name',
        ], [
            'name.unique' => 'Nama formasi sudah digunakan',
        ]);

        Formation::create($request->all());

        return redirect()->back()->with('success', 'Berhasil menambah data formasi');
    }

    /**
     * Display the specified resource.
     */
    public function show(Formation $formation)
    {
        $formation->load('positions');

        return Inertia::render('Admin/Formations/Show', [
            'formation' => $formation,
            'success' => session('success'),
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Formation $formation)
    {
        return Inertia::render('Admin/Formations/Edit', [
            'formation' => $formation,
            'success' => session('success'),
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Formation $formation)
    {
        $request->validate([
            'name' => 'required|string|max:255',
        ]);

        $formation->update($request->all());

        return redirect()->back()->with('success', 'Berhasil memperbarui data formasi');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Formation $formation)
    {
        $formation->delete();

        return redirect()->route('admin.formations.index')->with('success', 'Berhasil menghapus data formasi');
    }
}
