<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class Question extends Model
{
    use SoftDeletes;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'question_type_id',
        'type',
        'question',
        'discussion',
    ];

    /**
     * Get the question type that owns the question.
     *
     * @return BelongsTo
     */
    public function questionType(): BelongsTo
    {
        return $this->belongsTo(Question_type::class);
    }

    /**
     * Get the options for the question.
     *
     * @return HasMany
     */
    public function options(): HasMany
    {
        return $this->hasMany(Answer_option::class);
    }
}
