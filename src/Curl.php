<?php
namespace StreamLab\StreamLabProvider;

class Curl{

    protected $curlObject = null;

    protected $curlOptions = array(
        'RETURNTRANSFER'        => true,
        'FAILONERROR'           => true,
        'FOLLOWLOCATION'        => false,
        'CONNECTTIMEOUT'        => '',
        'TIMEOUT'               => 30,
        'USERAGENT'             => '',
        'URL'                   => '',
        'POST'                  => false,
        'HTTPHEADER'            => array(),
    );
    protected $packageOptions = array(
        'data'                  => array(),
        'asJsonRequest'         => false,
        'asJsonResponse'        => false,
        'returnAsArray'         => false,
        'responseObject'        => false,
        'enableDebug'           => false,
        'containsFile'          => false,
        'debugFile'             => '',
        'saveFile'              => '',
    );
    /**
     * Set the URL to which the request is to be sent
     *
     * @param $url string   The URL to which the request is to be sent
     * @return Builder
     */
    public function to($url)
    {
        return $this->withCurlOption( 'URL', $url );
    }

    public function withTimeout($timeout = 30)
    {
        return $this->withCurlOption( 'TIMEOUT', $timeout );
    }

    public function withData($data = array())
    {
        return $this->withPackageOption( 'data', $data );
    }

    public function allowRedirect()
    {
        return $this->withCurlOption( 'FOLLOWLOCATION', true );
    }

    public function asJson($asArray = false)
    {
        return $this->asJsonRequest()
            ->asJsonResponse( $asArray );
    }

    public function asJsonRequest()
    {
        return $this->withPackageOption( 'asJsonRequest', true );
    }

    public function asJsonResponse($asArray = false)
    {
        return $this->withPackageOption( 'asJsonResponse', true )
            ->withPackageOption( 'returnAsArray', $asArray );
    }

    public function withOption($key, $value)
    {
        return $this->withCurlOption( $key, $value );
    }

    protected function withCurlOption($key, $value)
    {
        $this->curlOptions[ $key ] = $value;
        return $this;
    }

    protected function withPackageOption($key, $value)
    {
        $this->packageOptions[ $key ] = $value;
        return $this;
    }

    public function withHeader($header)
    {
        $this->curlOptions[ 'HTTPHEADER' ][] = $header;
        return $this;
    }

    public function withHeaders(array $headers)
    {
        $this->curlOptions[ 'HTTPHEADER' ] = array_merge(
            $this->curlOptions[ 'HTTPHEADER' ], $headers
        );
        return $this;
    }

    public function withContentType($contentType)
    {
        return $this->withHeader( 'Content-Type: '. $contentType )
            ->withHeader( 'Connection: Keep-Alive' );
    }

    public function returnResponseObject()
    {
        return $this->withPackageOption( 'responseObject', true );
    }

    public function enableDebug($logFile)
    {
        return $this->withPackageOption( 'enableDebug', true )
            ->withPackageOption( 'debugFile', $logFile )
            ->withOption('VERBOSE', true);
    }

    public function containsFile()
    {
        return $this->withPackageOption( 'containsFile', true );
    }

    public function get()
    {
        $this->appendDataToURL();
        return $this->send();
    }

    public function post()
    {
        $this->setPostParameters();
        return $this->send();
    }

    public function download($fileName)
    {
        $this->packageOptions[ 'saveFile' ] = $fileName;
        return $this->send();
    }

    protected function setPostParameters()
    {
        $this->curlOptions[ 'POST' ] = true;
        $parameters = $this->packageOptions[ 'data' ];
        if( $this->packageOptions[ 'asJsonRequest' ] ) {
            $parameters = json_encode($parameters);
        }
        $this->curlOptions[ 'POSTFIELDS' ] = $parameters;
    }

    public function put()
    {
        $this->setPostParameters();
        return $this->withOption('CUSTOMREQUEST', 'PUT')
            ->send();
    }

    public function patch()
    {
        $this->setPostParameters();
        return $this->withOption('CUSTOMREQUEST', 'PATCH')
            ->send();
    }

    public function delete()
    {
        $this->appendDataToURL();
        return $this->withOption('CUSTOMREQUEST', 'DELETE')
            ->send();
    }

    protected function send()
    {
        // Add JSON header if necessary
        if( $this->packageOptions[ 'asJsonRequest' ] ) {
            $this->withHeader( 'Content-Type: application/json' );
        }
        if( $this->packageOptions[ 'enableDebug' ] ) {
            $debugFile = fopen( $this->packageOptions[ 'debugFile' ], 'w');
            $this->withOption('STDERR', $debugFile);
        }
        // Create the request with all specified options
        $this->curlObject = curl_init();
        $options = $this->forgeOptions();
        curl_setopt_array( $this->curlObject, $options );
        // Send the request
        $response = curl_exec( $this->curlObject );
        // Capture additional request information if needed
        $responseData = array();
        if( $this->packageOptions[ 'responseObject' ] ) {
            $responseData = curl_getinfo( $this->curlObject );
            if( curl_errno($this->curlObject) ) {
                $responseData[ 'errorMessage' ] = curl_error($this->curlObject);
            }
        }
        curl_close( $this->curlObject );
        if( $this->packageOptions[ 'saveFile' ] ) {
            // Save to file if a filename was specified
            $file = fopen($this->packageOptions[ 'saveFile' ], 'w');
            fwrite($file, $response);
            fclose($file);
        } else if( $this->packageOptions[ 'asJsonResponse' ] ) {
            // Decode the request if necessary
            $response = json_decode($response, $this->packageOptions[ 'returnAsArray' ]);
        }
        if( $this->packageOptions[ 'enableDebug' ] ) {
            fclose( $debugFile );
        }
        // Return the result
        return $this->returnResponse( $response, $responseData );
    }
    protected function returnResponse($content, $responseData = array())
    {
        if( !$this->packageOptions[ 'responseObject' ] ) {
            return $content;
        }
        $object = new stdClass();
        $object->content = $content;
        $object->status = $responseData[ 'http_code' ];
        if( array_key_exists('errorMessage', $responseData) ) {
            $object->error = $responseData[ 'errorMessage' ];
        }
        return $object;
    }

    protected function forgeOptions()
    {
        $results = array();
        foreach( $this->curlOptions as $key => $value ) {
            $arrayKey = constant( 'CURLOPT_' . $key );
            if( !$this->packageOptions[ 'containsFile' ] && $key == 'POSTFIELDS' && is_array( $value ) ) {
                $results[ $arrayKey ] = http_build_query( $value, null, '&' );
            } else {
                $results[ $arrayKey ] = $value;
            }
        }
        return $results;
    }

    protected function appendDataToURL()
    {
        $parameterString = '';
        if( is_array($this->packageOptions[ 'data' ]) && count($this->packageOptions[ 'data' ]) != 0 ) {
            $parameterString = '?'. http_build_query( $this->packageOptions[ 'data' ], null, '&' );
        }
        return $this->curlOptions[ 'URL' ] .= $parameterString;
    }
}