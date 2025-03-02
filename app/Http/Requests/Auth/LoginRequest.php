<?php

namespace App\Http\Requests\Auth;

use App\Models\Participant_profile;
use App\Models\User;
use Illuminate\Auth\Events\Lockout;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;

class LoginRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'no_hp' => ['required', 'string'],
            'password' => ['required', 'string'],
            'g-recaptcha-response' => [
                config('app.env') === 'production' ? 'required' : 'nullable',
            ],
        ];
    }

    /**
     * Get the validation messages that apply to the request.
     */
    public function messages(): array
    {
        return [
            'g-recaptcha-response.required' => 'The reCAPTCHA verification failed. Please try again.',
        ];
    }

    /**
     * Attempt to authenticate the request's credentials.
     *
     * @throws \Illuminate\Validation\ValidationException
     */
    public function authenticate(): void
    {
        $this->ensureIsNotRateLimited();

        $phoneNumber = $this->input('no_hp');

        // Cari user berdasarkan nomor HP di tabel participant_profiles
        $participant = Participant_profile::where('phone_number', $phoneNumber)->first();
        if (!$participant) {
            RateLimiter::hit($this->throttleKey());

            throw ValidationException::withMessages([
                'no_hp' => 'No. HP atau password salah',
            ]);
        }

        // Ambil user berdasarkan user_id dari tabel participant_profiles
        $user = User::find($participant->user_id);
        if (!$user) {
            RateLimiter::hit($this->throttleKey());

            throw ValidationException::withMessages([
                'no_hp' => 'No. HP atau password salah',
            ]);
        }

        // Periksa password yang dimasukkan
        if (! Hash::check($this->input('password'), $user->password)) {
            RateLimiter::hit($this->throttleKey());

            throw ValidationException::withMessages([
                'no_hp' => 'No. HP atau password salah',
            ]);
        }

        // Jika password benar, login user
        Auth::login($user);

        RateLimiter::clear($this->throttleKey());
    }

    /**
     * Ensure the login request is not rate limited.
     *
     * @throws \Illuminate\Validation\ValidationException
     */
    public function ensureIsNotRateLimited(): void
    {
        if (!RateLimiter::tooManyAttempts($this->throttleKey(), 5)) {
            return;
        }

        event(new Lockout($this));

        $seconds = RateLimiter::availableIn($this->throttleKey());

        throw ValidationException::withMessages([
            'email' => trans('auth.throttle', [
                'seconds' => $seconds,
                'minutes' => ceil($seconds / 60),
            ]),
        ]);
    }

    /**
     * Get the rate limiting throttle key for the request.
     */
    public function throttleKey(): string
    {
        return Str::transliterate(Str::lower($this->string('email')) . '|' . $this->ip());
    }
}
