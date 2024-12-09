<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Exam_question_answer extends Model
{
    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'exam_session_id',
        'question_id',
        'question_type_id',
        'answer_option_id',
    ];

    /**
     * Get the exam participant that owns the answer.
     *
     * @return BelongsTo
     */
    public function examSession(): BelongsTo
    {
        return $this->belongsTo(Exam_session::class);
    }

    /**
     * Get the question that owns the answer.
     *
     * @return BelongsTo
     */
    public function question(): BelongsTo
    {
        return $this->belongsTo(Question::class, 'question_id');
    }

    /**
     * Get the question type that owns the answer.
     *
     * @return BelongsTo
     */
    public function questionType(): BelongsTo
    {
        return $this->belongsTo(Question_type::class, 'question_type_id');
    }

    /**
     * Get the answer option that owns the answer.
     *
     * @return BelongsTo
     */
    public function answerOption(): BelongsTo
    {
        return $this->belongsTo(Answer_option::class, 'answer_id');
    }
}
