<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use App\Models\Exam;
use App\Models\Exam_participant;
use App\Models\Exam_question_answer;
use App\Models\Exam_session;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Inertia\Inertia;

class ExamController extends Controller
{
    public function index()
    {
        $exam = Exam::find(1);

        $examParticipant = Exam_participant::where('user_id', \Auth::id())
            ->where('exam_id', $exam->id)
            ->with([
                'position.questionTypes.questions.options'
            ])->first();

        $registeredExam = $examParticipant;

        $cacheKey = 'exam_' . $exam->id . '_questions';
        $questions = Cache::remember($cacheKey, 5, function () use ($examParticipant) {
            $questions = [];
            $positions = $examParticipant->position;

            foreach ($positions->questionTypes->sortBy('display_order') as $questionType) {
                foreach ($questionType->questions as $question) {
                    $questions[] = [
                        'question' => $question,
                        'question_type' => $questionType,
                        'answer_options' => $question->options,
                    ];
                }
            }

            return $questions;
        });

        $examSession = Exam_session::where('exam_participant_id', $registeredExam->id)
            ->where('status', 'active')
            ->first();

        if ($examSession == null) {
            $maximumDuration = $registeredExam->position->maximum_test_duration_in_minutes;
            $startedAt = now();
            $maximumDurationEndAt = $startedAt->copy()->addMinutes($maximumDuration);

            $examSession = Exam_session::create([
                'exam_participant_id' => $registeredExam->id,
                'current_question_id' => $questions[0]['question']->id,
                'status' => 'active',
                'maximum_duration' => $maximumDuration,
                'maximum_duration_end_at' => $maximumDurationEndAt,
                'started_at' => $startedAt,
            ]);
        }

        $examSession->load('currentQuestion.options');

        $currentQuestionData = collect($questions)
            ->firstWhere('question.id', $examSession->currentQuestion->id);

//        dd($currentQuestionData);

        $questionAnswers = Exam_question_answer::where('exam_participant_id', $registeredExam->id)
            ->get()
            ->keyBy('question_id');

//        dd($questionAnswers);

//        dd($examSession->started_at);

        return Inertia::render('User/Exams/Index', [
            'currentQuestionData' => $currentQuestionData,
            'questions' => $questions,
            'examSession' => $examSession,
            'questionAnswers' => $questionAnswers,
            'start_at' => $examSession->started_at,
            'end_at' => $examSession->maximum_duration_end_at,
        ]);
    }

    public function setCurrentQuestion(Request $request, Exam_session $exam_session)
    {
        $exam_session->update([
            'current_question_id' => $request->question_id,
        ]);

        return redirect()->back();
    }

    public function saveAnswer(Request $request, Exam_session $exam_session)
    {
        $request->validate([
            'answer_id' => 'required|exists:formation_position_question_answer_options,id',
            'question_id' => 'required|exists:formation_position_questions,id',
        ]);

        $existingAnswer = Exam_question_answer::where('exam_participant_id', $exam_session->exam_participant_id)
            ->where('question_id', $request->question_id)
            ->first();

        if ($existingAnswer) {
            $existingAnswer->update([
                'answer_id' => $request->answer_id,
            ]);
        } else {
            Exam_question_answer::create([
                'exam_participant_id' => $exam_session->exam_participant_id,
                'question_id' => $request->question_id,
                'answer_id' => $request->answer_id,
            ]);
        }

        return redirect()->back()->with('success', 'Jawaban berhasil disimpan!');
    }

}
