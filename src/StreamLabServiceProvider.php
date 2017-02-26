<?php

namespace StreamLab\StreamLabProvider;

use Illuminate\Support\ServiceProvider;

class StreamLabServiceProvider extends ServiceProvider
{

    public function boot()
    {
        $path = __DIR__;
        $this->publishes([
            $path.'/config' => base_path('config'),
            $path.'/assets' => base_path('public/StreamLab'),
            $path.'/view' => base_path('resources/views')
        ]);
        $this->loadRoutesFrom(__DIR__.'/routes/streamlabRoutes.php');
    }
    public function register()
    {
        $this->app->singleton('StreamLab', function () {
            return new StreamLab(config('stream_lab.app_id') , config('stream_lab.token'));
        });

        $this->app->booting(function()
        {
            $loader = \Illuminate\Foundation\AliasLoader::getInstance();
            $loader->alias('StreamLab', 'StreamLab\StreamLabProvider\Facades\StreamLabFacades');
        });

    }

}
