<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Formation;
use App\Models\Formation_position;
use App\Models\Formation_position_question;
use App\Models\Formation_position_question_answer_option;
use App\Models\Formation_position_question_type;
use Illuminate\Http\Request;
use Inertia\Inertia;

class FormationPositionQuestionAnswerOptionController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Formation $formation, Formation_position $position, Formation_position_question_type $question_type, Formation_position_question $question)
    {
        $question->load('options');

        return Inertia::render('Admin/Formations/Positions/QuestionTypes/Questions/AnswerOptions/Index', [
            'formation' => $formation,
            'position' => $position,
            'questionType' => $question_type,
            'question' => $question,
            'success' => session('success'),
            'newOptionId' => session('newOptionId'),
            'newOptions' => session('newOptions'),
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request, Formation $formation, Formation_position $position, Formation_position_question_type $question_type, Formation_position_question $question)
    {
        if ($question_type->weighting_type == 'FIVE_AND_ZERO') {
            $request->validate([
                'is_correct' => 'nullable|boolean',
                'option' => 'required|string|max:1|regex:/^[A-Z]$/|unique:formation_position_question_answer_options,option,NULL,id,formation_position_question_id,' . $question->id,
                'value' => 'required|string|max:255',
                'weight' => 'nullable|integer',
            ]);

            if ($request->is_correct) {
                $question->options()->update(['is_correct' => false]);
            }

            $option = $question->options()->create($request->all());
        } else if ($question_type->weighting_type == 'FIVE_TO_ONE') {
            $request->validate([
                'is_correct' => 'nullable|boolean',
                'option' => 'required|string|max:1|regex:/^[A-Z]$/|unique:formation_position_question_answer_options,option,NULL,id,formation_position_question_id,' . $question->id,
                'value' => 'required|string|max:255',
                'weight' => 'required|integer|min:1|max:5|unique:formation_position_question_answer_options,weight,NULL,id,formation_position_question_id,' . $question->id,
            ], [
                'weight.min' => 'Bobot harus lebih besar dari 0',
                'weight.unique' => 'Sudah ada pilihan dengan nilai :input',
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
     * Show the form for editing the specified resource.
     */
    public function edit(Formation $formation, Formation_position $position, Formation_position_question_type $question_type, Formation_position_question $question, Formation_position_question_answer_option $answer_option)
    {
        return Inertia::render('Admin/Formations/Positions/QuestionTypes/Questions/AnswerOptions/Edit', [
            'formation' => $formation,
            'position' => $position,
            'questionType' => $question_type,
            'question' => $question,
            'answerOption' => $answer_option,
            'success' => session('success'),
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Formation $formation, Formation_position $position, Formation_position_question_type $question_type, Formation_position_question $question, Formation_position_question_answer_option $answer_option)
    {
        if ($question_type->weighting_type == 'FIVE_AND_ZERO') {
            $request->validate([
                'option' => 'required|string|max:1|regex:/^[A-Z]$/|unique:formation_position_question_answer_options,option,' . $answer_option->id . ',id,formation_position_question_id,' . $question->id,
                'value' => 'required|string|max:255',
            ]);

            if ($request->is_correct) {
                $question->options()->update(['is_correct' => false]);
            }

            $answer_option->update($request->all());
        } else if ($question_type->weighting_type == 'FIVE_TO_ONE') {
            $request->validate([
                'option' => 'required|string|max:1|regex:/^[A-Z]$/|unique:formation_position_question_answer_options,option,' . $answer_option->id . ',id,formation_position_question_id,' . $question->id,
                'value' => 'required|string|max:255',
                'weight' => 'nullable|integer|min:1|max:5|unique:formation_position_question_answer_options,weight,' . $answer_option->id . ',id,formation_position_question_id,' . $question->id,
            ], [
                'weight.min' => 'Bobot harus lebih besar dari 0',
                'weight.unique' => 'Sudah ada pilihan dengan nilai :input',
            ]);

            if ($request->weight == 5) {
                $question->options()->update(['is_correct' => false]);
                $answer_option->update(['is_correct' => true]);
            }

            $answer_option->update($request->all());
        }

        return redirect()->back()->with('success', 'Berhasil memperbarui pilihan jawaban');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Formation $formation, Formation_position $position, Formation_position_question_type $question_type, Formation_position_question $question, Formation_position_question_answer_option $answer_option)
    {
        $answer_option->delete();

        return redirect()->back()->with('success', 'Berhasil menghapus pilihan jawaban');
    }

    /**
     * Mark the specified resource as correct.
     */
    public function markAsCorrect(Formation $formation, Formation_position $position, Formation_position_question_type $question_type, Formation_position_question $question, Formation_position_question_answer_option $answer_option)
    {
        $answer_option->update(['is_correct' => true]);

        return redirect()->back()->with('success', 'Berhasil menandai jawaban sebagai benar');
    }

    /**
     * Store multiple resources in storage.
     */
    public function storeBulk(Request $request, Formation $formation, Formation_position $position, Formation_position_question_type $question_type, Formation_position_question $question)
    {
        if ($question_type->weighting_type == 'FIVE_AND_ZERO') {
            $request->validate([
                'options' => 'required|array',
                'options.*.option' => 'required|string|max:1|regex:/^[A-Z]$/|unique:formation_position_question_answer_options,option,NULL,id,formation_position_question_id,' . $question->id,
                'options.*.value' => 'required|string|max:255',
            ], [
                'options.*.option.unique' => 'Pilihan jawaban :input sudah ada',
            ]);

            $options = [];

            foreach ($request->options as $option) {
                $options[] = $question->options()->create($option);
            }
        }
        else if ($question_type->weighting_type == 'FIVE_TO_ONE') {
            $request->validate([
                'options' => 'required|array|min:5',
                'options.*.option' => 'nullable|string|max:1|regex:/^[A-Z]$/|unique:formation_position_question_answer_options,option,NULL,id,formation_position_question_id,' . $question->id,
                'options.*.value' => 'required_with:options.*.option|max:255',
                'options.*.weight' => 'required_with:options.*.option|integer|min:1|max:5',
            ], [
                'options.min' => 'Isi semua pilihan jawaban!',
                'options.required' => 'Pilihan jawaban tidak boleh kosong.',
                'options.*.option.unique' => 'Pilihan jawaban :input sudah ada.',
                'options.*.option.regex' => 'Pilihan jawaban harus berupa huruf kapital.',
                'options.*.value.required' => 'Pilihan jawaban tidak boleh kosong.',
                'options.*.value.required_with' => 'Pilihan jawaban tidak boleh kosong.',
                'options.*.weight.required_with' => 'Nilai tidak boleh kosong.',
                'options.*.weight.integer' => 'Nilai harus berupa angka.',
                'options.*.weight.min' => 'Nilai minimal 1.',
                'options.*.weight.max' => 'Nilai maksimal 5.',
            ]);

            $weights = collect($request->input('options'))->pluck('weight');

            if ($weights->duplicates()->isNotEmpty()) {
                return redirect()->back()
                    ->withErrors(['options' => 'Nilai tidak boleh ada yang sama.'])
                    ->withInput();
            }

            $options = [];

            foreach ($request->options as $option) {
                $options[] = $question->options()->create($option);
            }

            $correctOption = collect($options)->where('weight', 5)->first();

            if ($correctOption) {
                $question->options()->update(['is_correct' => false]);
                $correctOption->update(['is_correct' => true]);
            }
        }

        return redirect()->back()->with([
            'success' => 'Berhasil menambahkan pilihan jawaban',
            'options' => $options,
            'newOptions' => $options,
        ]);
    }
}
