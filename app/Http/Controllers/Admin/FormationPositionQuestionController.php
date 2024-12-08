<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Formation;
use App\Models\Formation_position;
use App\Models\Formation_position_question;
use App\Models\Formation_position_question_type;
use Illuminate\Http\Request;
use Inertia\Inertia;

class FormationPositionQuestionController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Formation $formation, Formation_position $position, Formation_position_question_type $question_type)
    {
        $questions = $question_type->questions()->with('options')->paginate(10);

        return Inertia::render('Admin/Formations/Positions/QuestionTypes/Questions/Index', [
            'formation' => $formation,
            'position' => $position,
            'questionType' => $question_type,
            'questions' => $questions->items(),
            'meta' => [
                'current_page' => $questions->currentPage(),
                'total_pages' => $questions->lastPage(),
                'per_page' => $questions->perPage(),
                'total_items' => $questions->total(),
            ],
            'success' => session('success'),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(Formation $formation, Formation_position $position, Formation_position_question_type $question_type)
    {
        $question_count = $question_type->questions()->count();

        return Inertia::render('Admin/Formations/Positions/QuestionTypes/Questions/Create', [
            'formation' => $formation,
            'position' => $position,
            'questionType' => $question_type,
            'questionCount' => $question_count,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request, Formation $formation, Formation_position $position, Formation_position_question_type $question_type)
    {
        $request->validate([
            'question' => 'required',
            'discussion' => 'nullable',
        ]);

        $question = $question_type->questions()->create($request->all());

        return redirect()->route('admin.formation.position.question-type.question.answer-options.index', [
            'formation' => $formation,
            'position' => $position,
            'question_type' => $question_type,
            'question' => $question,
        ])->with('success', 'Silahkan tambahkan data pilihan jawaban');
    }

    /**
     * Display the specified resource.
     */
    public function show(Formation $formation, Formation_position $position, Formation_position_question_type $question_type, Formation_position_question $question)
    {
        $question->load('options');
        $question->loadCount('options');

        return Inertia::render('Admin/Formations/Positions/QuestionTypes/Questions/Show', [
            'formation' => $formation,
            'position' => $position,
            'questionType' => $question_type,
            'question' => $question,
            'success' => session('success'),
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Formation $formation, Formation_position $position, Formation_position_question_type $question_type, Formation_position_question $question)
    {
        return Inertia::render('Admin/Formations/Positions/QuestionTypes/Questions/Edit', [
            'formation' => $formation,
            'position' => $position,
            'questionType' => $question_type,
            'question' => $question->load('options'),
            'success' => session('success'),
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Formation $formation, Formation_position $position, Formation_position_question_type $question_type, Formation_position_question $question)
    {
        $request->validate([
            'question' => 'required',
            'discussion' => 'nullable',
        ]);

        $question->update($request->all());

        return redirect()->back()->with('success', 'Berhasil memperbarui data pertanyaan');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Formation $formation, Formation_position $position, Formation_position_question_type $question_type, Formation_position_question $question)
    {
        $question->delete();

        return redirect()->route('admin.formation.position.question-type.questions.index', [$formation->id, $position->id, $question_type->id])->with('success', 'Berhasil menghapus data pertanyaan');
    }
}
