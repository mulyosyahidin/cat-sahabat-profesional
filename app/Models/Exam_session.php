<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

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
        'started_at',
        'finished_at',
    ];

    /**
     * The accessors to append to the model's array form.
     *
     * @var array
     */
    protected $appends = [
        'maximum_duration_in_minutes',
    ];

    /**
     * Get the exam participant that owns the exam session.
     *
     * @return BelongsTo
     */
    public function currentQuestion(): BelongsTo
    {
        return $this->belongsTo(Formation_position_question::class, 'current_question_id');
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
            $hours = (int) $duration[0];
            $minutes = (int) $duration[1];
            $seconds = (int) $duration[2];

            return ($hours * 60) + $minutes + ($seconds / 60);
        }

        return 0;
    }
}
