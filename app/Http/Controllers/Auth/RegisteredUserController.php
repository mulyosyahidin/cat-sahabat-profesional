<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\Position;
use App\Models\User;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules;
use Inertia\Inertia;
use Inertia\Response;

class RegisteredUserController extends Controller
{
    /**
     * Display the registration view.
     */
    public function create()
    {
        $activeFormationId = 1;

        $positions = Position::where('formation_id', $activeFormationId)->get();

        return view('auth.register', compact('positions'));
    }

    /**
     * Handle an incoming registration request.
     *
     * @throws \Illuminate\Validation\ValidationException
     */
    public function store(Request $request): RedirectResponse
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'nik' => 'required|unique:users,nik',
            'password' => ['required'],
            'phone_number' => ['nullable', 'string', 'max:16'],
            'address' => ['nullable', 'string', 'max:255'],
            'g-recaptcha-response' => ['nullable'],
        ], [
            'g-recaptcha-response.required' => 'The reCAPTCHA verification failed. Please try again.',
        ]);

        $email = str_replace(' ', '', $request->nik) . '@cbt.app';

        $user = User::create([
            'name' => $request->name,
            'email' => $email,
            'nik' => $request->nik,
            'password' => Hash::make($request->password),
        ]);

        $user->participantProfile()->create([
            'phone_number' => $request->phone_number,
            'address' => $request->address,
        ]);

        event(new Registered($user));

        Auth::login($user);

        return redirect(route('user.welcome', absolute: false));
    }
}
