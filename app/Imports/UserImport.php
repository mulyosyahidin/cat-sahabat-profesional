<?php

namespace App\Imports;

use App\Models\User;
use Illuminate\Support\Collection;
use Maatwebsite\Excel\Concerns\ToCollection;
use Maatwebsite\Excel\Concerns\WithHeadingRow;

class UserImport implements ToCollection, WithHeadingRow
{
    /**
     * @param Collection $rows
     */
    public function collection(Collection $rows)
    {
        foreach ($rows as $row) {
            $name = $row['name'];
            $nik = $row['nik'];

            if (!empty($name) && !empty($nik)) {
                $email = $nik . '@cbt.app';

                User::firstOrCreate(
                    ['nik' => $nik],
                    [
                        'name' => $name,
                        'password' => bcrypt('12345678'),
                        'role' => 'user',
                        'email' => $email,
                        'email_verified_at' => now(),
                    ]
                );
            }
        }
    }
}
