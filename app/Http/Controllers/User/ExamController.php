<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use App\Models\Exam;
use App\Models\Exam_participant;
use App\Models\Exam_question_answer;
use App\Models\Exam_session;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
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

        if ($examSession->status == 'finished') {
            return redirect()->route('user.exams.result', $examSession);
        }

        $examSession->load('currentQuestion.options');

        $currentQuestionData = collect($questions)
            ->firstWhere('question.id', $examSession->currentQuestion->id);

        $questionAnswers = Exam_question_answer::where('exam_session_id', $examSession->id)
            ->get()
            ->keyBy('question_id');

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
            'question_type_id' => 'required|exists:formation_position_question_types,id',
        ]);

        $existingAnswer = Exam_question_answer::where('exam_session_id', $exam_session->id)
            ->where('question_id', $request->question_id)
            ->first();

        if ($existingAnswer) {
            $existingAnswer->update([
                'answer_id' => $request->answer_id,
            ]);
        } else {
            Exam_question_answer::create([
                'exam_session_id' => $exam_session->id,
                'question_id' => $request->question_id,
                'question_type_id' => $request->question_type_id,
                'answer_id' => $request->answer_id,
            ]);
        }

        return redirect()->back()->with('success', 'Jawaban berhasil disimpan!');
    }

    public function finish(Request $request, Exam_session $exam_session)
    {
        $answers = Exam_question_answer::where('exam_session_id', $exam_session->id)
            ->with([
                'questionType:id,weighting_type',
                'answerOption:id,is_correct,weight',
            ])
            ->get();

        $totalQuestion = $request->total_question;
        $answeredQuestionsCount = $answers->count();
        $unAnsweredQuestionsCount = $totalQuestion - $answeredQuestionsCount;

        $totalScore = 0;
        $totalScorePerTypes = [];

        $totalCorrentAnswersCount = $answers->filter(fn($answer) => $answer->answerOption->is_correct)->count();
        $totalWrongAnswersCount = $answers->filter(fn($answer) => !$answer->answerOption->is_correct)->count();

        foreach ($answers as $answer) {
            $questionTypeId = $answer->question_type_id;
            $questionWeightingType = $answer->questionType->weighting_type;

            $thisAnswerScore = 0;
            if ($questionWeightingType == 'FIVE_AND_ZERO') {
                if ($answer->answerOption->is_correct) {
                    $thisAnswerScore = 5;
                }
            } else if ($questionWeightingType == 'FIVE_TO_ONE') {
                $thisAnswerScore = $answer->answerOption->weight;
            }

            $totalScore += $thisAnswerScore;

            $key = array_search($questionTypeId, array_column($totalScorePerTypes, 'question_type_id'));
            $isCorrect = $answer->answerOption->is_correct;

            if ($key === false) {
                $totalScorePerTypes[] = [
                    'exam_session_id' => $exam_session->id,
                    'question_type_id' => $questionTypeId,
                    'score' => $thisAnswerScore,
                    'correct_answer_count' => $isCorrect ? 1 : 0,
                    'wrong_answer_count' => $isCorrect ? 0 : 1,
                ];
            } else {
                $totalScorePerTypes[$key]['score'] += $thisAnswerScore;
                $totalScorePerTypes[$key]['correct_answer_count'] += $isCorrect ? 1 : 0;
                $totalScorePerTypes[$key]['wrong_answer_count'] += $isCorrect ? 0 : 1;
            }
        }

        $exam_session->typeScores()->insert($totalScorePerTypes);

        $exam_session->update([
            'status' => 'finished',
            'finished_at' => Carbon::now(),
            'answered_questions_count' => $answeredQuestionsCount,
            'unanswered_questions_count' => $unAnsweredQuestionsCount,
            'total_score' => $totalScore,
            'wrong_answer_count' => $totalWrongAnswersCount,
            'correct_answer_count' => $totalCorrentAnswersCount,
        ]);

        return redirect()->route('user.exams.result', $exam_session)->with('success', 'Berhasil menyelesaikan ujian!');
    }

    public function result(Exam_session $exam_session)
    {
        $exam_session->load('typeScores.questionType');

        $exam = $exam_session->examParticipant->exam;
        $examParticipant = $exam_session->examParticipant()->with('position')->first();

        return Inertia::render('User/Exams/Result', [
            'exam' => $exam,
            'examParticipant' => $examParticipant,
            'examSession' => $exam_session,
        ]);
    }

}
