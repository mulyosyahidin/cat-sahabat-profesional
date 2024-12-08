<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class Formation_position_question extends Model
{
    use SoftDeletes;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'formation_position_question_type_id',
        'question',
        'discussion',
    ];

    /**
     * Get the options for the question.
     *
     * @return HasMany
     */
    public function options(): HasMany
    {
        return $this->hasMany(Formation_position_question_answer_option::class);
    }
}
