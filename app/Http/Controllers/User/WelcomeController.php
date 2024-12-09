<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use App\Models\Exam;
use App\Models\Exam_participant;
use App\Models\Exam_session;
use Illuminate\Http\Request;
use Inertia\Inertia;

class WelcomeController extends Controller
{
    public function index()
    {
        $exam = Exam::find(1);
        $examParticipant = Exam_participant::where('user_id', \Auth::id())->where('exam_id', $exam->id)->with('position')->first();

        $examSession = Exam_session::where('exam_participant_id', $examParticipant->id)
            ->first();

        if ($examSession != null && $examSession->status == 'finished') {
            return redirect()->route('user.exams.result', $examSession->id);
        }

        return Inertia::render('User/Welcome', [
            'exam' => $exam,
            'examSession' => $examSession,
            'examParticipant' => $examParticipant,
        ]);
    }
}
