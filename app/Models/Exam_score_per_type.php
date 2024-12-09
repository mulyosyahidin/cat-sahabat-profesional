<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Exam_score_per_type extends Model
{
    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'exam_session_id',
        'question_type_id',
        'wrong_answer_count',
        'correct_answer_count',
        'score',
    ];

    /**
     * Indicates if the model should be timestamped.
     *
     * @var bool
     */
    public $timestamps = false;

    /**
     * Get the exam session that owns the exam score per type.
     *
     * @return BelongsTo
     */
    public function examSession(): BelongsTo
    {
        return $this->belongsTo(Exam_session::class);
    }

    /**
     * Get the question type that owns the exam score per type.
     *
     * @return BelongsTo
     */
    public function questionType(): BelongsTo
    {
        return $this->belongsTo(Formation_position_question_type::class);
    }

}
