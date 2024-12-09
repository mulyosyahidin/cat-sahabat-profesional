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

    Route::resource('formations', \App\Http\Controllers\Admin\FormationController::class);
    Route::group(['prefix' => 'formations/{formation}', 'as' => 'formation.'], function () {
        Route::resource('positions', \App\Http\Controllers\Admin\FormationPositionController::class)->except('index');

        Route::group(['prefix' => 'positions/{position}', 'as' => 'position.'], function () {
            Route::resource('question-types', \App\Http\Controllers\Admin\FormationPositionQuestionTypeController::class)->except('index');

            Route::group(['prefix' => 'question-types/{question_type}', 'as' => 'question-type.'], function () {
                Route::resource('questions', \App\Http\Controllers\Admin\FormationPositionQuestionController::class);

                Route::group(['prefix' => 'questions/{question}', 'as' => 'question.'], function () {
                    Route::patch('answer-options/{answer_option}/mark-as-correct', [\App\Http\Controllers\Admin\FormationPositionQuestionAnswerOptionController::class, 'markAsCorrect'])->name('answer-option.mark-as-correct');
                    Route::post('answer-options/store-bulk', [\App\Http\Controllers\Admin\FormationPositionQuestionAnswerOptionController::class, 'storeBulk'])->name('answer-options.store-bulk');

                    Route::resource('answer-options', \App\Http\Controllers\Admin\FormationPositionQuestionAnswerOptionController::class);
                });
            });
        });
    });

    Route::resource('exams', \App\Http\Controllers\Admin\ExamController::class);
});

Route::group(['middleware' => ['auth', 'role:user'], 'as' => 'user.', 'prefix' => 'user'], function () {
    Route::get('/welcome', [\App\Http\Controllers\User\WelcomeController::class, 'index'])->name('welcome');

    Route::get('/exams', [\App\Http\Controllers\User\ExamController::class, 'index'])->name('exams.index');
    Route::post('/exams/{exam_session}/save-answer', [\App\Http\Controllers\User\ExamController::class, 'saveAnswer'])->name('exams.save-answer');
    Route::post('/exams/{exam_session}/set-current-question', [\App\Http\Controllers\User\ExamController::class, 'setCurrentQuestion'])->name('exams.set-current-question');
    Route::post('/exams/{exam_session}/finish', [\App\Http\Controllers\User\ExamController::class, 'finish'])->name('exams.finish');
    Route::get('/exams/{exam_session}/result', [\App\Http\Controllers\User\ExamController::class, 'result'])->name('exams.result');
});

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__ . '/auth.php';
