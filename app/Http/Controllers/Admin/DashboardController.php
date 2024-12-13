<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Exam;
use App\Models\Exam_participant;
use App\Models\Formation;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        $count = [
            'formation' => Formation::count(),
            'exam' => Exam::count(),
            'exam_participant' => Exam_participant::count(),
        ];
        return Inertia::render('Admin/Dashboard', [
            'count' => $count,
        ]);
    }
}
