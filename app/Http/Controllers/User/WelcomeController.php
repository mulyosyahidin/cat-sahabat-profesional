<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use App\Models\Exam;
use App\Models\Exam_participant;
use App\Models\Exam_session;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Inertia\Inertia;

class WelcomeController extends Controller
{
    public function index()
    {
        $currentUserExamParticipant = Exam_participant::where('user_id', auth()->id())->with('exam', 'position')->get();
        $hasActiveExamSession = $currentUserExamParticipant->filter(function ($examParticipant) {
            return $examParticipant->session()->where('status', 'active')->exists();
        })->isNotEmpty();

        $activeExamParticipant = $currentUserExamParticipant->filter(function ($examParticipant) {
            return $examParticipant->session()->where('status', 'active')->exists();
        })->first();

        $activeExam = $activeExamParticipant->exam ?? null;
        $activeExamSession = $activeExamParticipant->session ?? null;
        $activeExamPosition = $activeExamParticipant->position ?? null;

        return Inertia::render('User/Welcome', [
            'status' => session('status'),
            'exam_positions' => session('exam_positions'),
            'has_active_exam_session' => $hasActiveExamSession,
            'active_exam' => $activeExam,
            'active_exam_position' => $activeExamPosition,
            'active_exam_session' => $activeExamSession ?? null,
        ]);
    }

    public function validateToken(Request $request)
    {
        $request->validate([
            'token' => 'required|string|exists:exams,token',
        ], [
            'token.exists' => 'Kode token tidak ada',
        ]);

        $exam = Exam::where('token', $request->token)->first();

        if ($exam->participants()->where('user_id', auth()->id())->exists()) {
            return redirect()->back()->withErrors([
                'token' => 'Anda sudah pernah mengikuti ujian ini!',
            ]);
        }

        return redirect()->back()->with('exam_positions', $exam->formation->positions);
    }

    public function takeExam(Request $request)
    {
        $request->validate([
            'token' => 'required|string|exists:exams,token',
            'position_id' => 'required|integer|exists:positions,id',
        ], [
            'token.exists' => 'Kode token tidak ada',
        ]);

        $cacheKey = 'exam_data_by_token_' . $request->token;
        if (!Cache::has($cacheKey)) {
            $exam = Exam::where('token', $request->token)->first();

            Cache::put($cacheKey, $exam, now()->addMinutes(30));
        }

        $exam = Cache::get($cacheKey);

        $examParticipant = Exam_participant::updateOrCreate(
            [
                'user_id' => auth()->id(),
                'exam_id' => $exam->id,
                'position_id' => $request->position_id,
            ],
            [
                'updated_at' => now(),
            ]
        );

        $position = $examParticipant->position()->with('formation', 'questionTypes.questions')->first();
        $totalQuestions = $position->questionTypes->sum(function ($questionType) {
            return $questionType->questions->count();
        });

        $examSession = $examParticipant->session()->create([
            'status' => 'active',
            'maximum_duration' => $examParticipant->position->maximum_test_duration_in_minutes,
            'maximum_duration_end_at' => now()->addMinutes($examParticipant->position->maximum_test_duration_in_minutes),
            'total_questions' => $totalQuestions,
            'started_at' => now(),
        ]);

        return redirect()->route('user.exams.take', $examSession->id);
    }
}
