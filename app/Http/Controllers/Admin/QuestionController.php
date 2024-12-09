<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Question;
use App\Models\Question_type;
use Illuminate\Http\Request;
use Inertia\Inertia;

class QuestionController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $questionType = Question_type::where('id', request('question_type_id'))->with('position.formation')->firstOrFail();
        $questions = Question::where('question_type_id', $questionType->id)->with('options')->paginate(10);

        return Inertia::render('Admin/Questions/Index', [
            'questions' => $questions->items(),
            'meta' => [
                'current_page' => $questions->currentPage(),
                'total_pages' => $questions->lastPage(),
                'per_page' => $questions->perPage(),
                'total_items' => $questions->total(),
            ],
            'questionType' => $questionType,
            'success' => session('success'),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $questionType = Question_type::where('id', request('question_type_id'))->with('questions', 'position.formation')->firstOrFail();

        return Inertia::render('Admin/Questions/Create', [
            'questionType' => $questionType,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'question' => 'required',
            'discussion' => 'nullable',
            'question_type_id' => 'required|exists:question_types,id',
        ]);

        $question = Question::create($request->all());

        return redirect()->route('admin.answer-options.index', [
            'question' => $question,
        ])->with('success', 'Silahkan tambahkan data pilihan jawaban');
    }

    /**
     * Display the specified resource.
     */
    public function show(Question $question)
    {
        $question->load('options', 'questionType');
        $question->loadCount('options');

        return Inertia::render('Admin/Questions/Show', [
            'question' => $question,
            'success' => session('success'),
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Question $question)
    {
        return Inertia::render('Admin/Questions/Edit', [
            'question' => $question->load('options', 'questionType'),
            'success' => session('success'),
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Question $question)
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
    public function destroy(Question $question)
    {
        $questionTypeId = $question->questionType->id;
        $question->delete();

        return redirect()->route('admin.questions.index', ['question_type_id' => $questionTypeId])->with('success', 'Berhasil menghapus data pertanyaan');
    }
}
