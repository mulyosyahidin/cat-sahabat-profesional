<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Exam;
use App\Models\Formation;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ExamController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $exams = Exam::with('formation')->latest()->paginate(10);

        return Inertia::render('Admin/Exams/Index', [
            'exams' => $exams->items(),
            'meta' => [
                'current_page' => $exams->currentPage(),
                'total_pages' => $exams->lastPage(),
                'per_page' => $exams->perPage(),
                'total_items' => $exams->total(),
            ],
            'success' => session('success'),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $token = date('ymd');
        $token .= substr(str_shuffle('ABCDEFGHIJKLMNOPQRSTUVWXYZ'), 0, 4);

        $formations = Formation::all();

        return Inertia::render('Admin/Exams/Create', [
            'token' => $token,
            'formations' => $formations,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'date' => 'required|date',
            'formation_id' => 'required|exists:formations,id',
            'token' => 'required|string|max:16|unique:exams,token',
            'description' => 'nullable|string',
        ]);

        Exam::create($request->all());

        return redirect()->route('admin.exams.index')->with('success', 'Berhasil membuat ujian baru');
    }

    /**
     * Display the specified resource.
     */
    public function show(Exam $exam)
    {
        $exam->load('formation');

        return Inertia::render('Admin/Exams/Show', [
            'exam' => $exam,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Exam $exam)
    {
        $formations = Formation::all();

        return Inertia::render('Admin/Exams/Edit', [
            'exam' => $exam,
            'formations' => $formations,
            'success' => session('success'),
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Exam $exam)
    {
        $request->validate([
            'formation_id' => 'required|exists:formations,id',
            'name' => 'required|string|max:255',
            'date' => 'required|date',
            'token' => 'required|string|max:16|unique:exams,token,' . $exam->id,
            'description' => 'nullable|string',
        ]);

        $exam->update($request->all());

        return redirect()->back()->with('success', 'Berhasil memperbarui data ujian');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Exam $exam)
    {
        $exam->delete();

        return redirect()->route('admin.exams.index')->with('success', 'Berhasil menghapus ujian');
    }
}
