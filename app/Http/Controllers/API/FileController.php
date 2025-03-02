<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\File;
use App\Services\FileService;
use Illuminate\Http\Request;

class FileController extends Controller
{
    public function upload(Request $request)
    {
        $request->validate([
            'file' => 'required|max:5096',
        ]);

        $uploadedFile = FileService::upload('file');
        if ($uploadedFile) {
            $file = File::create($uploadedFile);

            return response()->json([
                'location' => '/storage/'. $file->path,
            ]);
        }
    }
}
