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
        'exam_participant_id',
        'question_id',
        'answer_id',
    ];

    /**
     * Get the exam participant that owns the answer.
     *
     * @return BelongsTo
     */
    public function examParticipant(): BelongsTo
    {
        return $this->belongsTo(Exam_participant::class);
    }

    /**
     * Get the question that owns the answer.
     *
     * @return BelongsTo
     */
    public function question(): BelongsTo
    {
        return $this->belongsTo(Formation_position_question::class, 'question_id');
    }

    /**
     * Get the answer option that owns the answer.
     *
     * @return BelongsTo
     */
    public function answerOption(): BelongsTo
    {
        return $this->belongsTo(Formation_position_question_answer_option::class, 'answer_id');
    }
}
