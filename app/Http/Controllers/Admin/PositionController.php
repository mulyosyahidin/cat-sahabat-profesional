<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Formation;
use App\Models\Position;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PositionController extends Controller
{
    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $formation = Formation::findOrFail(request('formation_id'));

        return Inertia::render('Admin/Positions/Create', [
            'formation' => $formation,
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

        Position::create($request->all());

        return redirect()->back()->with('success', 'Berhasil menambah data jabatan');
    }

    /**
     * Display the specified resource.
     */
    public function show(Position $position)
    {
        $position->load('formation', 'questionTypes.questions');
        $position->loadCount('questionTypes');

        $totalQuestions = $position->questionTypes->sum(function ($questionType) {
            return $questionType->questions->count();
        });

        return Inertia::render('Admin/Positions/Show', [
            'position' => $position,
            'success' => session('success'),
            'total_questions' => $totalQuestions,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Position $position)
    {
        $position->load('formation');

        return Inertia::render('Admin/Positions/Edit', [
            'position' => $position,
            'success' => session('success'),
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Position $position)
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
    public function destroy(Position $position)
    {
        $formationId = $position->formation_id;

        $position->delete();

        return redirect()->route('admin.formations.show', $formationId)->with('success', 'Berhasil menghapus data jabatan');
    }
}
