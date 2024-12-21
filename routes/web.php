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
    Route::get('/exams/{exam}/participants/{exam_participant}/question-answers', [\App\Http\Controllers\Admin\ExamParticipantController::class, 'questionAnswers'])->name('exams.participants.question-answers');

    Route::get('/exams/{exam}/download-exam-results', [\App\Http\Controllers\Admin\ExamController::class, 'downloadExamResults'])->name('exams.download-exam-results');

    Route::resource('exams', \App\Http\Controllers\Admin\ExamController::class);

    Route::get('/users', [\App\Http\Controllers\Admin\UserController::class, 'index'])->name('users.index');
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

Route::get('/test', function () {
    $isCorrectText = '(INI YANG BENAR)';

    for ($i = 1; $i <= 90; $i++) {
        // Membuat data soal
        $question = \App\Models\Question::create([
            'question_type_id' => 1,
            'question' => "[P3K][PAP][Kompetensi Teknis] Pertanyaan ke-$i: Apa jawaban yang benar?",
            'discussion' => "Ini adalah pembahasan untuk pertanyaan ke-$i.",
        ]);

        // Menentukan jawaban benar secara acak
        $correctOption = rand(1, 5); // Pilih angka acak antara 1 hingga 5

        // Membuat 5 pilihan jawaban (A-E)
        $options = ['A', 'B', 'C', 'D', 'E']; // Huruf pilihan
        for ($j = 1; $j <= 5; $j++) {
            $isCorrect = $j === $correctOption; // Tandai jika pilihan ini adalah jawaban benar

            \App\Models\Answer_option::create([
                'question_id' => $question->id,
                'option' => $options[$j - 1], // Menggunakan huruf A-E
                'value' => "Teks jawaban untuk pilihan {$options[$j - 1]} soal ke-$i". ($isCorrect ? " $isCorrectText" : ''), // Teks pilihan
                'is_correct' => $isCorrect,
                'score' => $isCorrect ? 5 : 0, // Skor 5 jika benar, 0 jika salah
            ]);
        }
    }

    echo "Selesai membuat soal kompetensi teknis!";

    for ($i = 1; $i <= 20; $i++) {
        // Membuat data soal
        $question = \App\Models\Question::create([
            'question_type_id' => 2,
            'question' => "[P3K][PAP][Sosio Kultural] Pertanyaan ke-$i: Apa jawaban yang benar?",
            'discussion' => "Ini adalah pembahasan untuk pertanyaan ke-$i.",
        ]);

        // Mendefinisikan opsi jawaban (A, B, C, D, E)
        $options = ['A', 'B', 'C', 'D', 'E'];

        // Mendefinisikan skor yang akan digunakan (1 sampai 5 tanpa duplikat)
        $scores = [1, 2, 3, 4, 5];

        // Mengacak urutan opsi dan skor
        shuffle($options);
        shuffle($scores);

        // Membuat 5 pilihan jawaban
        for ($j = 0; $j < 5; $j++) {
            // Menentukan apakah jawaban ini benar (is_correct) jika skor = 5
            $isCorrect = ($scores[$j] === 5);

            \App\Models\Answer_option::create([
                'question_id' => $question->id,
                'option' => $options[$j], // Menggunakan A, B, C, D, E secara acak
                'value' => "Jawaban {$options[$j]} untuk Pertanyaan $i soal ke-$i". ($isCorrect ? " $isCorrectText" : ''), // Teks pilihan
                'is_correct' => $isCorrect,
                'score' => $scores[$j], // Skor acak antara 1 hingga 5 tanpa duplikat
            ]);
        }
    }

    echo "Selesai membuat soal sosio kultural!";

    for ($i = 1; $i <= 25; $i++) {
        // Membuat data soal
        $question = \App\Models\Question::create([
            'question_type_id' => 3,
            'question' => "[P3K][PAP][Manajerial] Pertanyaan ke-$i: Apa jawaban yang benar?",
            'discussion' => "Ini adalah pembahasan untuk pertanyaan ke-$i.",
        ]);

        // Mendefinisikan opsi jawaban (A, B, C, D, E)
        $options = ['A', 'B', 'C', 'D', 'E'];

        // Mendefinisikan skor yang akan digunakan (1 sampai 5 tanpa duplikat)
        $scores = [1, 2, 3, 4, 5];

        // Mengacak urutan opsi dan skor
        shuffle($options);
        shuffle($scores);

        // Membuat 5 pilihan jawaban
        for ($j = 0; $j < 5; $j++) {
            // Menentukan apakah jawaban ini benar (is_correct) jika skor = 5
            $isCorrect = ($scores[$j] === 5);

            \App\Models\Answer_option::create([
                'question_id' => $question->id,
                'option' => $options[$j], // Menggunakan A, B, C, D, E secara acak
                'value' => "Jawaban {$options[$j]} untuk Pertanyaan $i soal ke-$i". ($isCorrect ? " $isCorrectText" : ''), // Teks pilihan
                'is_correct' => $isCorrect,
                'score' => $scores[$j], // Skor acak antara 1 hingga 5 tanpa duplikat
            ]);
        }
    }

    echo "Selesai membuat soal manajerial!";

    for ($i = 1; $i <= 10; $i++) {
        // Membuat data soal
        $question = \App\Models\Question::create([
            'question_type_id' => 4,
            'question' => "[P3K][PAP][Wawancara] Pertanyaan ke-$i: Apa jawaban yang benar?",
            'discussion' => "Ini adalah pembahasan untuk pertanyaan ke-$i.",
        ]);

        // Mendefinisikan opsi jawaban (A, B, C, D, E)
        $options = ['A', 'B', 'C', 'D', 'E'];

        // Mendefinisikan skor yang akan digunakan (1 sampai 5 tanpa duplikat)
        $scores = [1, 2, 3, 4, 5];

        // Mengacak urutan opsi dan skor
        shuffle($options);
        shuffle($scores);

        // Membuat 5 pilihan jawaban
        for ($j = 0; $j < 5; $j++) {
            // Menentukan apakah jawaban ini benar (is_correct) jika skor = 5
            $isCorrect = ($scores[$j] === 5);

            \App\Models\Answer_option::create([
                'question_id' => $question->id,
                'option' => $options[$j], // Menggunakan A, B, C, D, E secara acak
                'value' => "Jawaban {$options[$j]} untuk Pertanyaan $i soal ke-$i". ($isCorrect ? " $isCorrectText" : ''), // Teks pilihan
                'is_correct' => $isCorrect,
                'score' => $scores[$j], // Skor acak antara 1 hingga 5 tanpa duplikat
            ]);
        }
    }

    echo "Selesai membuat soal wawancara!";
});

require __DIR__ . '/auth.php';
