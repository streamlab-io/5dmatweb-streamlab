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
    public function CreateChannel($channelName , $private = null){
        $private = $private == null ? "" : "&private=true";
        $fullUrlApi = $this->url.'apps/'.$this->appKey.'/channels/'.$channelName.'?app_secret='.$this->token.$private;
        try{
            return $this->PostData($fullUrlApi , '' , 'POST');
        }catch(Exception $ex){
            exit();
        }
    }
    public function DeleteChannel($channelName){
        $fullUrlApi = $this->url.'apps/'.$this->appKey.'/channels/'.$channelName.'?app_secret='.$this->token;
        try{
            return $this->PostData($fullUrlApi , '' , 'DELETE');
        }catch(Exception $ex){
            exit();
        }
    }
    public function GetChannel($channelName , $channel_secret= null){
        $channel_secret = $channel_secret == null ? "" : '&channel_secret='.$channel_secret;
        $fullUrlApi = $this->url.'apps/'.$this->appKey.'/channels/'.$channelName.'?app_secret='.$this->token.$channel_secret;
        try{
            return $this->PostData($fullUrlApi , '' , 'GET');
        }catch(Exception $ex){
            exit();
        }
    }
    public function GetAllChannels($offset = null){
        $offset = $offset == null ? "" : "&offset=".$offset;
        $fullUrlApi = $this->url.'apps/'.$this->appKey.'/channels/?app_secret='.$this->token.$offset;
        try{
            return $this->PostData($fullUrlApi , '' , 'GET');
        }catch(Exception $ex){
            exit();
        }
    }
    /*
     * user control
     */
    public function  createUser($data){
        if(array_key_exists ('id' , $data) && array_key_exists ('secret' , $data)){
            $secret = md5($data['secret']);
            $sendData =  [
                "secret" => $secret ,
                "data" => $data
            ];
            unset($sendData['data']['_token']);
            unset($sendData['data']['id']);
            unset($sendData['data']['secret']);
            $fullUrlApi = $this->url.'apps/'.$this->appKey.'/users/'.$data['id'].'?app_secret='.$this->token;
            try{
                return $this->PostData($fullUrlApi , $sendData , 'POST');
            }catch(Exception $ex){
                exit();
            }
        }else{
            return "Please insert id property ..";
            exit();
        }

    }
    public function  getAppUser($appId ,$appSecret  , $limit = null , $offset = null , $channelName = null){
        $limit = $limit != null ? "&limit=$limit" : "";
        $offset = $offset != null ? "&offset=$offset" : "";
        $channelName = $channelName != null ? "&channel=".$channelName : "";
        $fullUrlApi = $this->url.'apps/'.$appId.'/users/?app_secret='.$appSecret.$limit.$offset.$channelName;
        try{
            return $this->PostData($fullUrlApi , '' , 'GET');
        }catch(Exception $ex){
            exit();
        }
    }
    public function  deleteUser($user_id){
        $fullUrlApi = $this->url.'apps/'.$this->appKey.'/users/'.$user_id.'?app_secret='.$this->token;
        try{
            return $this->PostData($fullUrlApi , '' , 'DELETE');
        }catch(Exception $ex){
            exit();
        }
    }
    public function  updateUser($data){
        if(array_key_exists ('id' , $data) && array_key_exists ('secret' , $data) ){
            $newdata =  [
                "secret" => md5($data['secret']),
                "data" => $data
            ];
            $fullUrlApi = $this->url.'apps/'.$this->appKey.'/users/'.$data['id'].'?app_secret='.$this->token;
            try{
                return $this->PostData($fullUrlApi , $newdata , 'PUT');
            }catch(Exception $ex){
                exit();
            }
        }
        return "Please insert id property ..";
        exit();
    }
    public function  getUser($user_id){
        $fullUrlApi = $this->url.'apps/'.$this->appKey.'/users/'.$user_id.'?app_secret='.$this->token;
        try{
            return $this->PostData($fullUrlApi , '' , 'GET');
        }catch(Exception $ex){
            exit();
        }
    }
    public function  getUsersStatus($channelName , $users){
        $users =  $this->CheckifArray($users);
        $fullUrlApi = $this->url.'apps/'.$this->appKey.'/channels/'.$channelName.'/users/status?app_secret='.$this->token;
        try{
            return $this->PostData($fullUrlApi , $users , 'POST');
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
        $fullUrlApi = $this->url.'apps/'.$this->appKey.'/channels/'.$channelName.'/messages?app_secret='.$this->token;
        try{
            return $this->PostData($fullUrlApi , $data , 'POST');
        }catch(Exception $ex){
            exit();
        }
    }
    public function StreamLabDump($data){
        echo "<pre>";
        var_dump($data);
        echo "</pre>";
    }
    public function ListenWithJavaScript($cahnnelName , $eventName = null , $user_id = null, $user_secret = null , $channel_secret = null ,  $id = "output"){
        if($eventName == null ){
            $eventName = "*";
        }
        $user_id = $user_id == null ? "" : "&user_id=".$user_id;
        $user_secret = $user_secret == null ? "" : "&user_secret=".$user_secret;
        $channel_secret = $channel_secret == null ? "" : "&channel_secret=".$channel_secret;
        $out =  "<script> \n";
        $out .= "uri = 'wss://api.streamlab.io/apps/$this->appKey/channels/$cahnnelName/messages?events=$eventName$user_id$user_secret$channel_secret' \n";
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
        $out .="$('#online').html(JsonResponse.data.online); \n";
        $out .="}";
        $out .= "$('#output').JSONView(evt.data); \n";
        $out .= "}\n";
        $out .= "</script> \n";
        return $out;
    }
    /*
     * send data
     */
    protected function PostData($url , $data , $method = "POST"){
        $response =  $this->curl->to($url)->withData($data)->asJson()->$method();
        if(!$response){
            $response =  $this->sendWithFileFunction($url , json_encode($data) , $method);
        }
        return json_encode($response);
    }
    protected function sendWithFileFunction($url , $data  , $method = "POST"){
        $result = file_get_contents($url, null, stream_context_create(array(
            'http' => array(
                'method' => $method,
                'header' => 'Content-Type: application/json' . "\r\n"
                    . 'Content-Length: ' . strlen($data) . "\r\n",
                'content' => $data,
            ),
        )));
        return $result;
    }
}