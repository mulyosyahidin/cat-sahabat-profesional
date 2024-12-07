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
        Schema::create('formation_position_question_types', function (Blueprint $table) {
            $table->id();
            $table->foreignIdFor(\App\Models\Formation_position::class)->nullable()->constrained()->cascadeOnDelete()->cascadeOnUpdate();
            $table->string('name');
            $table->tinyInteger('display_order')->default(0);
            $table->enum('weighting_type', [...\App\Enums\WeightingType::names()]);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('formation_position_question_types');
    }
};
