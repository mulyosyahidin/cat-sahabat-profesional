<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class Position extends Model
{
    use SoftDeletes;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'formation_id',
        'name',
        'maximum_test_duration',
    ];

    /**
     * The accessors to append to the model's array form.
     *
     * @var array
     */
    protected $appends = [
        'maximum_test_duration_in_minutes',
    ];

    /**
     * Get the formation that owns the formation_position.
     *
     * @return BelongsTo
     */
    public function formation(): BelongsTo
    {
        return $this->belongsTo(Formation::class);
    }

    /**
     * Get the question types for the formation position.
     *
     * @return HasMany
     */
    public function questionTypes(): HasMany
    {
        return $this->hasMany(Question_type::class);
    }

    /**
     * Get the maximum test duration in minutes.
     *
     * @return int
     */
    public function getMaximumTestDurationInMinutesAttribute(): int
    {
        $value = $this->maximum_test_duration;

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
