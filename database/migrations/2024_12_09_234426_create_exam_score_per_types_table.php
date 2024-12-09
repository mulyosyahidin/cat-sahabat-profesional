<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('exam_score_per_types', function (Blueprint $table) {
            $table->id();
            $table->foreignIdFor(\App\Models\Exam_session::class)->nullable()->constrained()->cascadeOnDelete()->cascadeOnUpdate();
            $table->foreignIdFor(\App\Models\Question_type::class)->constrained()->cascadeOnDelete()->cascadeOnUpdate();
            $table->smallInteger('wrong_answer_count');
            $table->smallInteger('correct_answer_count');
            $table->smallInteger('score');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('exam_score_per_types');
    }
};
