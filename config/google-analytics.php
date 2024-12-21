<?php

return [

    'id' => env('GOOGLE_ANALYTICS_ID', ''),
    'enabled' => env('APP_ENV', false) === 'production',

];
