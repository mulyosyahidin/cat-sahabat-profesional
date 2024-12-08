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
        Schema::create('formation_position_question_answer_options', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('formation_position_question_id')->nullable();
            $table->char('option', 1);
            $table->text('value');
            $table->tinyInteger('weight')->default(0);
            $table->boolean('is_correct')->default(false);
            $table->timestamps();

            $table->foreign('formation_position_question_id', 'fpqi')->references('id')->on('formation_position_questions')->cascadeOnDelete()->cascadeOnUpdate();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('formation_position_question_answer_options');
    }
};
