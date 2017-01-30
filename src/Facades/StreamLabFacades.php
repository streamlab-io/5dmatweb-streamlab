<?php

namespace StreamLab\StreamLabProvider\Facades;

use Illuminate\Support\Facades\Facade;

class StreamLabFacades extends Facade
{

    /**
     * Get the registered name of the component.
     *
     * @return string
     */
    protected static function getFacadeAccessor()
    {
        return 'StreamLab';
    }

}