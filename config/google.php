<?php

return [

    'recaptcha' => [
        'enabled' => env('GOOGLE_RECAPTCHA_ENABLED', false),
        'site_key' => env('GOOGLE_RECAPTCHA_SITE_KEY', ''),
        'secret_key' => env('GOOGLE_RECAPTCHA_SECRET_KEY', ''),
    ],
];
