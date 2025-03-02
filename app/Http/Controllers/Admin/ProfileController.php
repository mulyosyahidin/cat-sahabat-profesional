<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Services\FileService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ProfileController extends Controller
{
    public function edit()
    {
        return Inertia::render('Admin/Profile/Edit', [
            'user' => \Auth::user(),
            'success' => \Session::get('success'),
        ]);
    }

    public function update(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users,email,' . \Auth::id(),
            'password' => 'nullable|string|min:8',
        ]);

        $request->user()->update(
            $request->only('name', 'email')
            + ($request->has('password') ? ['password' => \Hash::make($request->input('password'))] : [])
        );

        return redirect()->route('admin.profile.edit')->with('success', 'Berhasil memperbarui profil');
    }

    public function updateProfilePicture(Request $request)
    {
        $request->validate([
            'profile_picture' => 'required|image:jpg,png|max:1024',
        ]);

        $file = FileService::upload('profile_picture');
        if ($file) {
            if ($request->user()->profile_picture) {
                FileService::delete(storage_path('app/public/' . $request->user()->profile_picture));
            }

            $request->user()->update(['profile_picture' => $file['path']]);
        }

        return redirect()->route('admin.profile.edit')->with('success', 'Berhasil memperbarui foto profil');
    }
}
