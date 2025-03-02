<?php

namespace App\Traits;

trait EnumToArray
{
    /**
     * Get all enum cases.
     *
     * @return array
     */
    public static function names(): array
    {
        return array_column(self::cases(), 'name');
    }

    /**
     * Get all enum values.
     *
     * @return array
     */
    public static function values(): array
    {
        return array_column(self::cases(), 'value');
    }

    /**
     * Get all enum cases as array value and name pair.
     *
     * @return array
     */
    public static function array(): array
    {
        return array_combine(self::names(), self::values());
    }
}
