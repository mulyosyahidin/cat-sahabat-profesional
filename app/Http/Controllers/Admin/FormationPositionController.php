<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Formation;
use App\Models\Formation_position;
use Illuminate\Http\Request;
use Inertia\Inertia;

class FormationPositionController extends Controller
{
    /**
     * Show the form for creating a new resource.
     */
    public function create(Formation $formation)
    {
        return Inertia::render('Admin/Formations/Positions/Create', [
            'formation' => $formation,
            'success' => session('success')
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request, Formation $formation)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'maximum_test_duration' => [
                'required',
                'string',
                'max:16',
                function ($attribute, $value, $fail) {
                    if (!preg_match('/^([0-9]{1,2}):([0-5][0-9]):([0-5][0-9])$/', $value)) {
                        $fail('Format durasi ujian tidak valid. Gunakan format jam:menit:detik.');
                    }
                },
            ],
        ]);

        $formation->positions()->create($request->all());

        return redirect()->back()->with('success', 'Berhasil menambah data jabatan');
    }

    /**
     * Display the specified resource.
     */
    public function show(Formation $formation, Formation_position $position)
    {
        $position->load('questionTypes');

        return Inertia::render('Admin/Formations/Positions/Show', [
            'formation' => $formation,
            'position' => $position,
            'success' => session('success'),
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Formation $formation, Formation_position $position)
    {
        return Inertia::render('Admin/Formations/Positions/Edit', [
            'formation' => $formation,
            'position' => $position,
            'success' => session('success')
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Formation $formation, Formation_position $position)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'maximum_test_duration' => [
                'required',
                'string',
                'max:16',
                function ($attribute, $value, $fail) {
                    if (!preg_match('/^([0-9]{1,2}):([0-5][0-9]):([0-5][0-9])$/', $value)) {
                        $fail('Format durasi ujian tidak valid. Gunakan format jam:menit:detik.');
                    }
                },
            ],
        ]);

        $position->update($request->all());

        return redirect()->back()->with('success', 'Berhasil memperbarui data jabatan');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Formation $formation, Formation_position $position)
    {
        $position->delete();

        return redirect()->route('admin.formations.show', $formation)->with('success', 'Berhasil menghapus data jabatan');
    }
}
