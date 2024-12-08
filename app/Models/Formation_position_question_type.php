<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Formation_position_question_type extends Model
{
    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'formation_position_id',
        'name',
        'display_order',
        'weighting_type',
    ];

    /**
     * Get the questions for the formation position question type.
     *
     * @return HasMany
     */
    public function questions(): HasMany
    {
        return $this->hasMany(Formation_position_question::class);
    }
}
