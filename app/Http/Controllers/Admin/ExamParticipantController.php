<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Exam;
use App\Models\Exam_participant;
use App\Models\Exam_session;
use App\Models\Formation;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ExamParticipantController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Exam $exam)
    {
        $participants = $exam->participants()
            ->with(['user', 'position', 'session'])
            ->orderBy(Exam_session::select('total_score')
                ->whereColumn('exam_sessions.exam_participant_id', 'exam_participants.id'), 'desc')
            ->paginate(10);

        return Inertia::render('Admin/Exams/Participants/Index', [
            'exam' => $exam,
            'participants' => $participants->items(),
            'meta' => [
                'current_page' => $participants->currentPage(),
                'total_pages' => $participants->lastPage(),
                'per_page' => $participants->perPage(),
                'total_items' => $participants->total(),
            ],
            'success' => session('success'),
        ]);
    }

    /**
     * Display the specified resource.
     */
    public function show(Exam $exam, Exam_participant $examParticipant)
    {
        $examParticipant->load(['user', 'position', 'session']);

        $participantProfile = $examParticipant->user->participantProfile;
        $typeScores = $examParticipant->session->typeScores()->with('questionType')->get();
        $questionAnswers = $examParticipant->session->answers()->with('question', 'questionType', 'answerOption')->get();

        return Inertia::render('Admin/Exams/Participants/Show', [
            'exam' => $examParticipant->exam,
            'examParticipant' => $examParticipant->load(['user', 'position', 'session']),
            'participantProfile' => $participantProfile,
            'typeScores' => $typeScores,
            'questionAnswers' => $questionAnswers,
        ]);
    }

    public function questionAnswers(Exam $exam, Exam_participant $examParticipant)
    {
        $questionAnswers = $examParticipant->session->answers()->with('question', 'questionType', 'answerOption')->paginate(10);

        return Inertia::render('Admin/Exams/Participants/QuestionAnswers', [
            'exam' => $exam,
            'examParticipant' => $examParticipant->load(['user', 'position', 'session']),
            'questionAnswers' => $questionAnswers->items(),
            'meta' => [
                'current_page' => $questionAnswers->currentPage(),
                'total_pages' => $questionAnswers->lastPage(),
                'per_page' => $questionAnswers->perPage(),
                'total_items' => $questionAnswers->total(),
            ],
        ]);
    }
}
