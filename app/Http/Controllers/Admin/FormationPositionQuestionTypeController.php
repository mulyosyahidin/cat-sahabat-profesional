<?php

namespace App\Http\Controllers\Admin;

use App\Enums\WeightingType;
use App\Http\Controllers\Controller;
use App\Models\Formation;
use App\Models\Formation_position;
use App\Models\Formation_position_question_type;
use Illuminate\Http\Request;
use Inertia\Inertia;

class FormationPositionQuestionTypeController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(Formation $formation, Formation_position $position)
    {
        return Inertia::render('Admin/Formations/Positions/QuestionTypes/Create', [
            'formation' => $formation->only('id', 'name'),
            'position' => $position->only('id', 'name'),
            'weighting_types' => WeightingType::array(),
            'success' => session('success'),
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request, Formation $formation, Formation_position $position)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'display_order' => 'required|integer|min:1|unique:formation_position_question_types,display_order',
            'weighting_type' => 'required|in:' . implode(',', WeightingType::names()),
        ]);

        $position->questionTypes()->create($request->all());

        return redirect()->back()->with('success', 'Berhasil menambah data jenis soal');
    }

    /**
     * Display the specified resource.
     */
    public function show(Formation $formation, Formation_position $position, Formation_position_question_type $question_type)
    {
        return Inertia::render('Admin/Formations/Positions/QuestionTypes/Show', [
            'formation' => $formation->only('id', 'name'),
            'position' => $position->only('id', 'name'),
            'questionType' => $question_type->only('id', 'name', 'display_order', 'weighting_type'),
            'success' => session('success'),
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Formation $formation, Formation_position $position, Formation_position_question_type $question_type)
    {
        return Inertia::render('Admin/Formations/Positions/QuestionTypes/Edit', [
            'formation' => $formation->only('id', 'name'),
            'position' => $position->only('id', 'name'),
            'weighting_types' => WeightingType::array(),
            'questionType' => $question_type->only('id', 'name', 'display_order', 'weighting_type'),
            'success' => session('success'),
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Formation $formation, Formation_position $position, Formation_position_question_type $question_type)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'display_order' => 'required|integer|min:1',
            'weighting_type' => 'required|in:' . implode(',', WeightingType::names()),
        ]);

        $question_type->update($request->all());

        return redirect()->back()->with('success', 'Berhasil memperbarui data jenis soal');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Formation $formation, Formation_position $position, Formation_position_question_type $question_type)
    {
        $question_type->delete();

        return redirect()->route('admin.formation.positions.show', [$formation, $position])->with('success', 'Berhasil menghapus data jenis soal');
    }
}
