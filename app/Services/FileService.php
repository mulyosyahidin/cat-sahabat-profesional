<?php

namespace App\Services;

class FileService
{
    /**
     * Upload file
     *
     * @param $fieldName
     * @return array|false
     */
    public static function upload($fieldName = null): bool|array
    {
        if ($fieldName === null || !request()->hasFile($fieldName) || !request()->file($fieldName)->isValid()) {
            return false;
        }

        $file = request()->file($fieldName);
        $fileName = time() . '_' . $file->getClientOriginalName();

        $yearMonth = date('Y/m');
        $path = $file->storeAs($yearMonth, $fileName, 'public');

        return [
            'name' => $fileName,
            'path' => $path,
            'size' => $file->getSize(),
            'mime_type' => $file->getMimeType(),
        ];
    }

    /**
     * Delete file
     *
     * @param $filePath
     * @return bool
     */
    public static function delete($filePath): bool
    {
        if (file_exists($filePath)) {
            unlink($filePath);

            return true;
        }

        return false;
    }

}
