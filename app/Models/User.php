<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use App\Traits\UserRole;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable, UserRole;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'role',
        'profile_picture',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    /**
     * The accessors to append to the model's array form.
     *
     * @var array
     */
    public $appends = [
        'profile_picture_url',
    ];

    /**
     * Get the participant profile associated with the user.
     *
     * @return HasOne
     */
    public function participantProfile(): HasOne
    {
        return $this->hasOne(Participant_profile::class);
    }

    /**
     * Get the exam participants associated with the user.
     *
     * @return HasMany
     */
    public function examParticipants(): HasMany
    {
        return $this->hasMany(Exam_participant::class);
    }

    /**
     * Get the profile picture attribute.
     *
     * @return Attribute
     */
    public function profilePictureUrl(): Attribute
    {
        return Attribute::make(
            get: function () {
                $profilePicture = $this->profile_picture;

                return $profilePicture ? asset('storage/' . $profilePicture) : 'https://www.gravatar.com/avatar/' . md5(strtolower($this->email)) . '?d=identicon';
            }
        );
    }
}
