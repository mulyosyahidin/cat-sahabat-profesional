<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use App\Models\Exam;
use App\Models\Exam_participant;
use Illuminate\Http\Request;
use Inertia\Inertia;

class WelcomeController extends Controller
{
    public function index()
    {
        $exam = Exam::find(1);
        $examParticipant = Exam_participant::where('user_id', \Auth::id())->where('exam_id', $exam->id)->with('position')->first();

        return Inertia::render('User/Welcome', [
            'exam' => $exam,
            'examParticipant' => $examParticipant,
        ]);
    }
}
