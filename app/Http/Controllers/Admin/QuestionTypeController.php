<?php

namespace App\Http\Controllers\Admin;

use App\Enums\WeightingType;
use App\Http\Controllers\Controller;
use App\Models\Position;
use App\Models\Question_type;
use Illuminate\Http\Request;
use Inertia\Inertia;

class QuestionTypeController extends Controller
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
    public function create()
    {
        $position = Position::where('id', request('position_id'))->with('formation')->firstOrFail();

        return Inertia::render('Admin/QuestionTypes/Create', [
            'position' => $position,
            'weighting_types' => WeightingType::array(),
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
            'display_order' => 'required|integer|min:1',
            'weighting_type' => 'required|in:' . implode(',', WeightingType::names()),
            'position_id' => 'required|exists:positions,id',
        ]);

        Question_type::create($request->all());

        return redirect()->back()->with('success', 'Berhasil menambah data jenis soal');
    }

    /**
     * Display the specified resource.
     */
    public function show(Question_type $question_type)
    {
        $question_type->load('position.formation');

        return Inertia::render('Admin/QuestionTypes/Show', [
            'questionType' => $question_type,
            'success' => session('success'),
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Question_type $question_type)
    {
        $question_type->load('position.formation');

        return Inertia::render('Admin/QuestionTypes/Edit', [
            'weighting_types' => WeightingType::array(),
            'questionType' => $question_type,
            'success' => session('success'),
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Question_type $question_type)
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
    public function destroy(Question_type $question_type)
    {
        $positionId = $question_type->position_id;

        $question_type->delete();

        return redirect()->route('admin.positions.show', $positionId)->with('success', 'Berhasil menghapus data jenis soal');
    }
}
