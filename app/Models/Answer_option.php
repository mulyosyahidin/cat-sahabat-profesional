<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Answer_option extends Model
{
    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'question_id',
        'option',
        'value',
        'is_correct',
        'score',
    ];
}
