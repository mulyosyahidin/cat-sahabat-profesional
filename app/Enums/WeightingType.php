<?php

namespace App\Enums;

use App\Traits\EnumToArray;

enum WeightingType: string
{
    use EnumToArray;

    case FIVE_AND_ZERO = 'Five and Zero';
    case FIVE_TO_ONE = 'Five to One';
}
