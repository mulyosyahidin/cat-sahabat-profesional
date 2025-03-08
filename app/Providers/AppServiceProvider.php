<?php

namespace App\Providers;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Vite;
use Illuminate\Support\ServiceProvider;
use Inertia\Inertia;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        if (config('app.env') === 'production' && request()->server(key: 'HTTP_X_FORWARDED_PROTO') === 'https') {
            \URL::forceScheme(scheme: 'https');
        }
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        Vite::prefetch(concurrency: 3);

        Model::preventLazyLoading(!app()->isProduction());

        Inertia::share([
            'previous_url' => function () {
                if (url()->previous() !== route('login') && url()->previous() !== '' && url()->previous() !== url()->current()) {
                    return url()->previous();
                } else {
                    return 'empty'; // used in javascript to disable back button behavior
                }
            },

            'app_url' => fn() => config('app.url'),

        ]);
    }
}
