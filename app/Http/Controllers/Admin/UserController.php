<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class UserController extends Controller
{
    public function index()
    {
        $searchQuery = request('search');
        $users = User::where('role', 'user')
            ->when($searchQuery, function ($query, $searchQuery) {
                return $query->where('name', 'LIKE', "%$searchQuery%")
                    ->orWhere('email', 'LIKE', "%$searchQuery%")
                    ->orWhere('nik', 'LIKE', "%$searchQuery%");
            })
            ->paginate();

        return Inertia::render('Admin/Users/Index', [
            'users' => $users->items(),
            'meta' => [
                'current_page' => $users->currentPage(),
                'total_pages' => $users->lastPage(),
                'per_page' => $users->perPage(),
                'total_items' => $users->total(),
            ],
            'success' => session('success'),
            'search_query' => $searchQuery,
        ]);
    }

    public function edit(User $user)
    {
        return Inertia::render('Admin/Users/Edit', [
            'user' => $user,
        ]);
    }

    public function update(Request $request, User $user)
    {
        $data = request()->validate([
            'name' => 'required',
            'email' => 'required|email|unique:users,email,' . $user->id,
            'nik' => 'required',
            'password' => 'nullable',
        ]);

        if ($request->password) {
            $user->update([
                'password' => bcrypt($request->password),
            ]);
        }
        else {
            unset($data['password']);
        }

        $user->update($data);

        return redirect()->route('admin.users.index')->with('success', 'Berhasil memperbarui profil user');
    }

    public function destroy(User $user)
    {
        $user->delete();

        return redirect()->back()->with('success', 'Berhasil menghapus user');
    }

    public function show(User $user)
    {
        $user->load('examParticipants.exam', 'examParticipants.position', 'examParticipants.session');
        $user->loadCount('examParticipants');

        return Inertia::render('Admin/Users/Show', [
            'user' => $user,
            'success' => session('success'),
        ]);
    }
}
