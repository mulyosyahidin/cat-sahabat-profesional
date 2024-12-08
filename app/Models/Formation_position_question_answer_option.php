<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Formation_position_question_answer_option extends Model
{
    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'formation_position_question_id',
        'option',
        'value',
        'weight',
        'is_correct',
    ];
}
