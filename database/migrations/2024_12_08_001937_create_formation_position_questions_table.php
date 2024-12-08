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
        Schema::create('formation_position_questions', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('formation_position_question_type_id')->nullable();
            $table->text('question');
            $table->text('discussion')->nullable();
            $table->timestamps();
            $table->softDeletes();

            $table->foreign('formation_position_question_type_id', 'fpqti')->references('id')->on('formation_position_question_types')->cascadeOnDelete()->cascadeOnUpdate();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('formation_position_questions');
    }
};
