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
}
