<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::group(['middleware' => ['auth', 'role:admin'], 'as' => 'admin.', 'prefix' => 'admin'], function () {
    Route::get('/dashboard', [\App\Http\Controllers\Admin\DashboardController::class, 'index'])->name('dashboard');

    Route::get('/profile/edit', [\App\Http\Controllers\Admin\ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [\App\Http\Controllers\Admin\ProfileController::class, 'update'])->name('profile.update');
    Route::patch('/profile/profile-picture', [\App\Http\Controllers\Admin\ProfileController::class, 'updateProfilePicture'])->name('profile.profile-picture');

    Route::post('/formations/{formation}/questions-import', [\App\Http\Controllers\Admin\FormationController::class, 'importQuestions'])->name('formations.question-import');
    Route::resource('formations', \App\Http\Controllers\Admin\FormationController::class);

    Route::resource('positions', \App\Http\Controllers\Admin\PositionController::class)->except('index');
    Route::resource('question-types', \App\Http\Controllers\Admin\QuestionTypeController::class)->except('index');
    Route::resource('questions', \App\Http\Controllers\Admin\QuestionController::class);

    Route::patch('questions/{question}/answer-options/{answer_option}/mark-as-correct', [\App\Http\Controllers\Admin\AnswerOptionController::class, 'markAsCorrect'])->name('questions.answer-options.mark-as-correct');
    Route::post('questions/{question}/answer-options/store-bulk', [\App\Http\Controllers\Admin\AnswerOptionController::class, 'storeBulk'])->name('questions.answer-options.store-bulk');
    Route::resource('questions/{question}/answer-options', \App\Http\Controllers\Admin\AnswerOptionController::class);

    Route::get('/exams/{exam}/participants', [\App\Http\Controllers\Admin\ExamParticipantController::class, 'index'])->name('exams.participants.index');
    Route::get('/exams/{exam}/participants/{exam_participant}', [\App\Http\Controllers\Admin\ExamParticipantController::class, 'show'])->name('exams.participants.show');
    Route::delete('/exams/{exam}/participants/{exam_participant}', [\App\Http\Controllers\Admin\ExamParticipantController::class, 'destroy'])->name('exams.participants.destroy');
    Route::get('/exams/{exam}/participants/{exam_participant}/question-answers', [\App\Http\Controllers\Admin\ExamParticipantController::class, 'questionAnswers'])->name('exams.participants.question-answers');

    Route::get('/exams/{exam}/download-exam-results', [\App\Http\Controllers\Admin\ExamController::class, 'downloadExamResults'])->name('exams.download-exam-results');

    Route::resource('exams', \App\Http\Controllers\Admin\ExamController::class);

    Route::get('/users', [\App\Http\Controllers\Admin\UserController::class, 'index'])->name('users.index');
    Route::get('/users/{user}', [\App\Http\Controllers\Admin\UserController::class, 'show'])->name('users.show');
    Route::get('/users/{user}/edit', [\App\Http\Controllers\Admin\UserController::class, 'edit'])->name('users.edit');
    Route::put('/users/{user}', [\App\Http\Controllers\Admin\UserController::class, 'update'])->name('users.update');
    Route::delete('/users/{user}', [\App\Http\Controllers\Admin\UserController::class, 'destroy'])->name('users.destroy');
});

Route::group(['middleware' => ['auth', 'role:user'], 'as' => 'user.', 'prefix' => 'user'], function () {
    Route::get('/welcome', [\App\Http\Controllers\User\WelcomeController::class, 'index'])->name('welcome');
    Route::post('/welcome/validate-token', [\App\Http\Controllers\User\WelcomeController::class, 'validateToken'])->name('validate-token');
    Route::post('/welcome/take-exam', [\App\Http\Controllers\User\WelcomeController::class, 'takeExam'])->name('take-exam');

    Route::get('/exams/take/{exam_session}', [\App\Http\Controllers\User\ExamController::class, 'take'])->name('exams.take');
    Route::post('/exams/{exam_session}/save-answer', [\App\Http\Controllers\User\ExamController::class, 'saveAnswer'])->name('exams.save-answer');
    Route::post('/exams/{exam_session}/finish', [\App\Http\Controllers\User\ExamController::class, 'finish'])->name('exams.finish');
    Route::get('/exams/{exam_session}/result', [\App\Http\Controllers\User\ExamController::class, 'result'])->name('exams.result');
    Route::get('/exams/{exam_session}/finish-by-system', [\App\Http\Controllers\User\ExamController::class, 'finishBySystem'])->name('exams.finish-by-system');
});

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__ . '/auth.php';
