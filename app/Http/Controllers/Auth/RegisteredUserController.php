<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\Formation_position;
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

        $positions = Formation_position::where('formation_id', $activeFormationId)->get();

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
            'email' => 'required|string|lowercase|email|max:255|unique:' . User::class,
            'password' => ['required', Rules\Password::defaults()],
            'phone_number' => ['required', 'string', 'max:16'],
            'address' => ['required', 'string', 'max:255'],
            'position_id' => ['required', 'integer', 'exists:formation_positions,id'],
        ]);

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
        ]);

        $user->participantProfile()->create([
            'phone_number' => $request->phone_number,
            'address' => $request->address,
        ]);

        $examId = 1;

        $user->examParticipants()->create([
            'exam_id' => $examId,
            'formation_position_id' => $request->position_id,
        ]);

        event(new Registered($user));

        Auth::login($user);

        return redirect(route('user.welcome', absolute: false));
    }
}
