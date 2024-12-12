<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use App\Models\Exam;
use App\Models\Exam_participant;
use App\Models\Exam_question_answer;
use App\Models\Exam_session;
use App\Models\Question;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Cache;
use Inertia\Inertia;

class ExamController extends Controller
{
    public function take(Request $request, Exam_session $examSession)
    {
        if ($examSession->examParticipant->user_id != auth()->id()) {
            return redirect()->route('user.welcome');
        }

        $currentQuestionIdFromRequest = $request->get('question_id');

        if ($currentQuestionIdFromRequest) {
            $examSession->update([
                'current_question_id' => $currentQuestionIdFromRequest,
            ]);
        }

        $allQuestionData = $this->getData($examSession);

        $allQuestionsData = $allQuestionData['all_questions'];
        $allQuestionIds = $allQuestionData['items'];
        $activeQuestionId = $currentQuestionIdFromRequest ?? ($examSession->current_question_id ?? $allQuestionIds[0]->id);
        $indexNumber = array_search($activeQuestionId, array_column($allQuestionsData, 'id'));

        if ($examSession->status === 'finished') {
            return redirect()->route('user.exams.result', $examSession);
        }

        $questionAnswers = Exam_question_answer::where('exam_session_id', $examSession->id)
            ->get(['question_id', 'answer_option_id']);
        $answeredQuestionIds = $questionAnswers->pluck('question_id')->toArray();

        $questionData = Question::with('questionType', 'options')
            ->findOrFail($activeQuestionId);

        $nextQuestionId = $indexNumber + 1 < count($allQuestionsData)
            ? $allQuestionsData[$indexNumber + 1]['id']
            : null;

        return Inertia::render('User/Exams/Take', [
            'all_question_ids' => $allQuestionIds,
            'meta' => $allQuestionData['meta'],
            'current_question' => $questionData,
            'current_question_index' => $indexNumber,
            'total_question' => count($allQuestionsData),
            'next_question_id' => $nextQuestionId,
            'exam_session_id' => $examSession->id,
            'question_answers' => $questionAnswers,
            'answered_question_ids' => $answeredQuestionIds,
            'start_at' => $examSession->started_at,
            'end_at' => $examSession->maximum_duration_end_at,
        ]);
    }

    public function saveAnswer(Request $request, Exam_session $exam_session)
    {
        $request->validate([
            'answer_id' => 'required|exists:answer_options,id',
            'question_id' => 'required|exists:questions,id',
            'question_type_id' => 'required|exists:question_types,id',
        ]);

        $existingAnswer = Exam_question_answer::where('exam_session_id', $exam_session->id)
            ->where('question_id', $request->question_id)
            ->first();

        if ($existingAnswer) {
            $existingAnswer->update([
                'answer_option_id' => $request->answer_id,
            ]);
        } else {
            Exam_question_answer::create([
                'exam_session_id' => $exam_session->id,
                'question_id' => $request->question_id,
                'question_type_id' => $request->question_type_id,
                'answer_option_id' => $request->answer_id,
            ]);
        }

        return redirect()->back()->with('success', 'Jawaban berhasil disimpan!');
    }

    public function finish(Request $request, Exam_session $exam_session)
    {
        $answers = Exam_question_answer::where('exam_session_id', $exam_session->id)
            ->with([
                'questionType:id,weighting_type',
                'answerOption:id,is_correct,score',
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
                $thisAnswerScore = $answer->answerOption->score;
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

        $allQuestionTypes = $exam_session->examParticipant->position->questionTypes->pluck('id')->toArray();

        foreach ($allQuestionTypes as $questionTypeId) {
            $existingEntry = collect($totalScorePerTypes)->firstWhere('question_type_id', $questionTypeId);

            if (!$existingEntry) {
                $totalScorePerTypes[] = [
                    'exam_session_id' => $exam_session->id,
                    'question_type_id' => $questionTypeId,
                    'score' => 0,
                    'correct_answer_count' => 0,
                    'wrong_answer_count' => 0,
                ];
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

    protected function getData(Exam_session $examSession)
    {
        $exam = $examSession->examParticipant->exam;
        $examParticipant = $examSession->examParticipant;

        $questionTypesIds = $examParticipant->position->questionTypes->pluck('id')->toArray();

        $allQuestions = Question::whereIn('question_type_id', $questionTypesIds)
            ->get(['id']);

        $allQuestionsWithPagination = Question::whereIn('question_type_id', $questionTypesIds)
            ->paginate(20, ['id']);

        return [
            'exam_participant' => $examParticipant,
            'all_questions' => $allQuestions->toArray(),
            'items' => $allQuestionsWithPagination->items(),
            'meta' => [
                'total_items' => $allQuestionsWithPagination->total(),
                'current_page' => $allQuestionsWithPagination->currentPage(),
                'per_page' => $allQuestionsWithPagination->perPage(),
                'last_page' => $allQuestionsWithPagination->lastPage(),
                'total_pages' => $allQuestionsWithPagination->lastPage(),
            ],
        ];
    }
}
