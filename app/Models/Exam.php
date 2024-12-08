<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Exam extends Model
{
    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'formation_id',
        'name',
        'date',
        'description',
        'token',
    ];

    /**
     * Get the formation that owns the Exam
     *
     * @return BelongsTo
     */
    public function formation(): BelongsTo
    {
        return $this->BelongsTo(Formation::class);
    }
}
