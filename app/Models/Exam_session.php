<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Exam_session extends Model
{
    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'exam_participant_id',
        'current_question_id',
        'status',
        'maximum_duration',
        'maximum_duration_end_at',
        'total_questions',
        'current_answered_questions',
        'started_at',
        'finished_at',
        'finished_by',
        'answered_questions_count',
        'unanswered_questions_count',
        'total_score',
        'wrong_answer_count',
        'correct_answer_count',
    ];

    /**
     * The accessors to append to the model's array form.
     *
     * @var array
     */
    protected $appends = [
        'maximum_duration_in_minutes',
        'answered_question_percent',
        'correct_answer_percent',
        'total_processing_time',
    ];

    /**
     * Get the exam participant that owns the exam session.
     *
     * @return BelongsTo
     */
    public function examParticipant(): BelongsTo
    {
        return $this->belongsTo(Exam_participant::class);
    }

    /**
     * Get the exam participant that owns the exam session.
     *
     * @return BelongsTo
     */
    public function currentQuestion(): BelongsTo
    {
        return $this->belongsTo(Question::class, 'current_question_id');
    }

    /**
     * Get scores per question type.
     *
     * @return HasMany
     */
    public function typeScores(): HasMany
    {
        return $this->hasMany(Exam_score_per_type::class);
    }

    /**
     * Get answers per question.
     *
     * @return HasMany
     */
    public function answers(): HasMany
    {
        return $this->hasMany(Exam_question_answer::class);
    }

    /**
     * Get the maximum test duration in minutes.
     *
     * @return int
     */
    public function getMaximumDurationInMinutesAttribute(): int
    {
        $value = $this->maximum_duration;

        $duration = explode(':', $value);

        if (count($duration) === 3) {
            $hours = (int)$duration[0];
            $minutes = (int)$duration[1];
            $seconds = (int)$duration[2];

            return ($hours * 60) + $minutes + ($seconds / 60);
        }

        return 0;
    }

    /**
     * Get the percentage of answered questions.
     *
     * @return float|int
     */
    public function getAnsweredQuestionPercentAttribute(): float|int
    {
        $answered = $this->answered_questions_count;
        $unanswered = $this->unanswered_questions_count;

        if (($answered + $unanswered) === 0) {
            return 0;
        }

        $percent = ($answered / ($answered + $unanswered)) * 100;

        return number_format($percent, 2);
    }

    /**
     * Get the percentage of correct answers.
     *
     * @return float|int
     */
    public function getCorrectAnswerPercentAttribute(): float|int
    {
        $correct = $this->correct_answer_count;
        $wrong = $this->wrong_answer_count;

        if (($correct + $wrong) === 0) {
            return 0;
        }

        $percent = ($correct / ($correct + $wrong)) * 100;

        return number_format($percent, 2);
    }

    /**
     * Get the total processing time in minutes.
     *
     * @return int
     */
    public function getTotalProcessingTimeAttribute(): int
    {
        $startedAt = $this->started_at;
        $finishedAt = $this->finished_at;

        if ($startedAt === null || $finishedAt === null) {
            return 0;
        }

        $startedAt = strtotime($startedAt);
        $finishedAt = strtotime($finishedAt);

        return ($finishedAt - $startedAt) / 60;
    }
}
