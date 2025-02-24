<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Question;
use App\Models\Question_type;
use App\Services\FileService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class QuestionController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $searchQuery = request('search');

        $questionType = Question_type::where('id', request('question_type_id'))->with('position.formation')->firstOrFail();
        $questions = Question::where('question_type_id', $questionType->id)
            ->when($searchQuery, function ($query, $searchQuery) {
                $query->where('question', 'like', '%' . $searchQuery . '%');
            })
            ->with('options')
            ->paginate();

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
            'search_query' => $searchQuery,
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
            'type' => 'required|in:image,text',
            'question' => 'required_if:type,text|nullable|string',
            'question_image' => 'required_if:type,image|nullable|image',
            'discussion' => 'nullable|string',
            'question_type_id' => 'required|exists:question_types,id',
        ]);

        $data = [
            'discussion' => $request->discussion,
            'question_type_id' => $request->question_type_id,
            'type' => $request->type,
        ];

        if ($request->type == 'text') {
            $data['question'] = $request->question;
        } else {
            $file = FileService::upload('question_image');
            if ($file) {
                $data['question'] = $file['path'] ?? null;
            }
        }

        $question = Question::create($data);

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
            'type' => 'required|in:image,text',
            'question' => 'required_if:type,text|nullable|string',
            'question_image' => 'required_if:type,image|nullable|image',
            'discussion' => 'nullable',
        ]);

        $data = [
            'discussion' => $request->discussion,
            'type' => $request->type,
        ];

        if ($request->type == 'text') {
            $data['question'] = $request->question;
        } else {
            $file = FileService::upload('question_image');
            if ($file) {
                if ($question->type == 'image' && $question->question) {
                    FileService::delete(storage_path('app/public/' . $question->question));
                }

                $data['question'] = $file['path'] ?? null;
            }
        }

        $question->update($data);

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
