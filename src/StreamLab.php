<?php

namespace StreamLab\StreamLabProvider;

use StreamLab\StreamLabProvider\Curl;

class StreamLab{
    public $appKey;
    protected $url = "https://api.streamlab.io/";
    public $token;
    protected $curl ;
    public  function __construct($key = null , $token = null)
    {
        $this->token = $token;
        $this->appKey = $key;
        $this->curl =  $curlService = new Curl();
    }
    protected function CheckifArray($data){
        return is_array($data) ? $data : [$data];
    }
    /*
    * channel control
    */
    public function CreateChannel($channelName){
        $fullUrlApi = $this->url.'apps/'.$this->appKey.'/channels/'.$channelName.'?token='.$this->token;
        try{
            return $this->curl->to($fullUrlApi)->asJson()->post();
        }catch(Exception $ex){
            exit();
        }
    }
    public function DeleteChannel($channelName){
        $fullUrlApi = $this->url.'apps/'.$this->appKey.'/channels/'.$channelName.'?token='.$this->token;
        try{
            return $this->curl->to($fullUrlApi)->asJson()->delete();
        }catch(Exception $ex){
            exit();
        }
    }
    public function GetChannel($channelName){
        $fullUrlApi = $this->url.'apps/'.$this->appKey.'/channels/'.$channelName.'?token='.$this->token;
        try{
            return $this->curl->to($fullUrlApi)->asJson()->get();
        }catch(Exception $ex){
            exit();
        }
    }
    public function GetAllChannels(){
        $fullUrlApi = $this->url.'apps/'.$this->appKey.'/channels?token='.$this->token;
        try{
            return $this->curl->to($fullUrlApi)->asJson()->get();
        }catch(Exception $ex){
            exit();
        }
    }
    /*
    * Other control
    */
    public function pushMessage($channelName , $eventName , $data){
        $data = [
            "data" => $data,
            "events" => $this->CheckifArray($eventName)
        ];
        $fullUrlApi = $this->url.'apps/'.$this->appKey.'/channels/'.$channelName.'/events/publish?token='.$this->token;
        try{
            return $this->curl->to($fullUrlApi)->withData($data)->asJson()->post();
        }catch(Exception $ex){
            exit();
        }
    }
    public function StreamLabDump($data){
        echo "<pre>";
        var_dump($data);
        echo "</pre>";
    }
    public function ListenWithJavaScript($channelName , $eventName = null , $id = "output"){
        if($eventName == null ){
            $eventName = "*";
        }
        $out =  "<script> \n";
        $out .= "uri = 'wss://api.streamlab.io/apps/$this->appKey/channels/$channelName/events/subscribe?events=$eventName' \n";
        $out .= "var cntr = 1 ; \n";
        $out .= "ws = new WebSocket(uri) ;\n";
        $out .= "ws.onopen = function() { \n";
        $out .= "console.log('StreamLab Connect') ;\n";
        $out .= "} \n";
        $out .= "ws.onmessage = function(evt) {\n";
        $out .= "var JsonResponse = JSON.parse(evt.data).data; \n";
        $out .= "if(JsonResponse.source == 'messages'){\n ";
        $out .= "$('#msg').append(JsonResponse.data.data+'<br>'); \n";
        $out .= "}else if(JsonResponse.source == 'channels'){\n";
        $out .="$('#online').html(JsonResponse.data.users); \n";
        $out .="}";
        $out .= "}\n";
        $out .= "</script> \n";
        return $out;
    }
}