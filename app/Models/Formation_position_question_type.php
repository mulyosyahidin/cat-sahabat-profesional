<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

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
}
