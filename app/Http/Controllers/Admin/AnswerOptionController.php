<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Answer_option;
use App\Models\Question;
use App\Services\FileService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AnswerOptionController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Question $question)
    {
        $question->load('options', 'questionType');

        return Inertia::render('Admin/AnswerOptions/Index', [
            'question' => $question,
            'success' => session('success'),
            'newOptionId' => session('newOptionId'),
            'newOptions' => session('newOptions'),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request, Question $question)
    {
        if ($question->questionType->weighting_type == 'FIVE_AND_ZERO') {
            $request->validate([
                'is_correct' => 'nullable|boolean',
                'option' => 'required|string|max:1|regex:/^[A-Z]$/|unique:answer_options,option,NULL,id,question_id,' . $question->id,
                'type' => 'required|in:image,text',
                'value' => 'nullable|string|max:255',
                'value_image' => 'nullable|image',
                'score' => 'nullable|integer',
            ]);

            if ($request->is_correct) {
                $question->options()->update(['is_correct' => false, 'score' => 5]);
            }

            $data = [
                'is_correct' => $request->is_correct ?? false,
                'option' => $request->option,
                'type' => $request->type,
                'score' => $request->score,
            ];

            if ($request->type == 'text') {
                $data['value'] = $request->value;
            } else {
                $file = FileService::upload('value_image');
                if ($file) {
                    $data['value'] = $file['path'];
                }
            }

            $option = $question->options()->create($data);
        } else if ($question->questionType->weighting_type == 'FIVE_TO_ONE') {
            $request->validate([
                'is_correct' => 'nullable|boolean',
                'option' => 'required|string|max:1|regex:/^[A-Z]$/|unique:answer_options,option,NULL,id,question_id,' . $question->id,
                'value' => 'required|string|max:255',
                'score' => 'required|integer|min:1|max:5|unique:answer_options,score,NULL,id,question_id,' . $question->id,
            ], [
                'score.min' => 'Bobot harus lebih besar dari 0',
                'score.unique' => 'Sudah ada pilihan dengan nilai :input',
            ]);

            $option = $question->options()->create($request->all());

            if ($request->weight == 5) {
                $question->options()->update(['is_correct' => false]);
                $option->update(['is_correct' => true]);
            }
        }

        return redirect()->back()->with([
            'success' => 'Berhasil menambah pilihan jawaban',
            'newOptionId' => $option->id,
        ]);
    }

    /**
     * Display the specified resource.
     */
    public function show(Answer_option $answer_option)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Question $question, Answer_option $answer_option)
    {
        $question->load('questionType');

        return Inertia::render('Admin/AnswerOptions/Edit', [
            'question' => $question,
            'answerOption' => $answer_option,
            'success' => session('success'),
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Question $question, Answer_option $answer_option)
    {
        if ($question->questionType->weighting_type == 'FIVE_AND_ZERO') {
            $request->validate([
                'option' => 'required|string|max:1|regex:/^[A-Z]$/|unique:answer_options,option,' . $answer_option->id . ',id,question_id,' . $question->id,
                'type' => 'required|in:text,image',
                'value' => 'required_if:type,text|nullable|string|max:255',
                'value_image' => 'required_if:type,image|nullable|image',
            ]);

            if ($request->is_correct) {
                $question->options()->update([
                    'is_correct' => false,
                ]);
            }

            $value = $request->value;

            if ($request->type == 'image') {
                $file = FileService::upload('value_image');
                if ($file) {
                    if ($answer_option->type == 'image') {
                        FileService::delete(storage_path('app/public/'. $answer_option->value));
                    }

                    $value = $file['path'];
                }
            }

            $data = [
                'is_correct' => $request->is_correct ?? false,
                'option' => $request->option,
                'type' => $request->type,
                'value' => $value,
            ];

            $answer_option->update($data);
        } else if ($question->questionType->weighting_type == 'FIVE_TO_ONE') {
            $request->validate([
                'option' => 'required|string|max:1|regex:/^[A-Z]$/|unique:answer_options,option,' . $answer_option->id . ',id,question_id,' . $question->id,
                'value' => 'required|string|max:255',
                'score' => 'nullable|integer|min:1|max:5|unique:answer_options,score,' . $answer_option->id . ',id,question_id,' . $question->id,
            ], [
                'score.min' => 'Bobot harus lebih besar dari 0',
                'score.unique' => 'Sudah ada pilihan dengan nilai :input',
            ]);

            if ($request->score == 5) {
                $question->options()->update([
                    'is_correct' => false,
                ]);
                $answer_option->update([
                    'is_correct' => true,
                ]);
            }

            $answer_option->update($request->all());
        }

        return redirect()->back()->with('success', 'Berhasil memperbarui pilihan jawaban');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Question $question, Answer_option $answer_option)
    {
        if ($answer_option->type == 'image') {
            FileService::delete(storage_path('app/public/'. $answer_option->value));
        }
        $answer_option->delete();

        return redirect()->back()->with('success', 'Berhasil menghapus pilihan jawaban');
    }

    /**
     * Mark the specified resource as correct.
     */
    public function markAsCorrect(Question $question, Answer_option $answer_option)
    {
        $question->options()->update([
            'is_correct' => false,
            'score' => 0,
        ]);

        $answer_option->update([
            'is_correct' => true,
            'score' => 5,
        ]);

        return redirect()->back()->with('success', 'Berhasil menandai jawaban sebagai benar');
    }

    /**
     * Store multiple resources in storage.
     */
    public function storeBulk(Request $request, Question $question)
    {
        if ($question->questionType->weighting_type == 'FIVE_AND_ZERO') {
            $request->validate([
                'options' => 'required|array',
                'options.*.option' => 'required|string|max:1|regex:/^[A-Z]$/|unique:answer_options,option,NULL,id,question_id,' . $question->id,
                'options.*.value' => 'required|string|max:255',
            ], [
                'options.*.option.unique' => 'Pilihan jawaban :input sudah ada',
            ]);

            $options = [];

            foreach ($request->options as $option) {
                $options[] = $question->options()->create($option);
            }
        } else if ($question->questionType->weighting_type == 'FIVE_TO_ONE') {
            $request->validate([
                'options' => 'required|array|min:5',
                'options.*.option' => 'nullable|string|max:1|regex:/^[A-Z]$/|unique:answer_options,option,NULL,id,question_id,' . $question->id,
                'options.*.value' => 'required_with:options.*.option|max:255',
                'options.*.score' => 'required_with:options.*.option|integer|min:1|max:5',
            ], [
                'options.min' => 'Isi semua pilihan jawaban!',
                'options.required' => 'Pilihan jawaban tidak boleh kosong.',
                'options.*.option.unique' => 'Pilihan jawaban :input sudah ada.',
                'options.*.option.regex' => 'Pilihan jawaban harus berupa huruf kapital.',
                'options.*.value.required' => 'Pilihan jawaban tidak boleh kosong.',
                'options.*.value.required_with' => 'Pilihan jawaban tidak boleh kosong.',
                'options.*.score.required_with' => 'Nilai tidak boleh kosong.',
                'options.*.score.integer' => 'Nilai harus berupa angka.',
                'options.*.score.min' => 'Nilai minimal 1.',
                'options.*.score.max' => 'Nilai maksimal 5.',
            ]);

            $weights = collect($request->input('options'))->pluck('score');

            if ($weights->duplicates()->isNotEmpty()) {
                return redirect()->back()
                    ->withErrors(['options' => 'Nilai tidak boleh ada yang sama.'])
                    ->withInput();
            }

            $options = [];

            foreach ($request->options as $option) {
                $options[] = $question->options()->create($option);
            }

            $correctOption = collect($options)->where('score', 5)->first();

            if ($correctOption) {
                $question->options()->update([
                    'is_correct' => false,
                ]);

                $correctOption->update([
                    'is_correct' => true,
                ]);
            }
        }

        return redirect()->back()->with([
            'success' => 'Berhasil menambahkan pilihan jawaban',
            'options' => $options,
            'newOptions' => $options,
        ]);
    }
}
