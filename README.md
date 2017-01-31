# 5dmatweb-streamlab
RealTime messages services streamlab.io

#installation

run this command form composer
`composer require 5dmatweb/streamlab:dev-master`
  
  
 #add service provider 
 open config/app add this line to provider array
 
```php
StreamLab\StreamLabProvider\StreamLabServiceProvider::class,
```

#and then publish this vendor

`php artisan vendor:publish`
    
this command will add to files
1-stream-lab.php on config file
2-StreamLab-soket.js on public/StreamLab/StreamLab-soket.js

#How to Use
1-add account to https://streamlab.io

get app_id and key then add to config/stream-lab.php

2- add this to your blade 


```html
<html>
    <head>
        <title>Some page</title>
        <!-- bootstrap -->
        <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css" integrity="sha384-BVYiiSIFeK1dGmJRAkycuHAHRg32OmUcww7on3RYdg4Va+PmSTsz/K68vbdEjh4u" crossorigin="anonymous">
    </head>
        <body>
            <div class="container">
                <div class="row">
                    <div class="col-lg-12">
                        <h1>
                            StreamLab.io Chat App
                        </h1>

                        <div class="well" id="msg" style="height: 300px;overflow: auto"></div>
                        <div id="online" class="well" ></div>


                        <div class="form-group">
                            <input type="text" name="name" id="name" v-model="" class="form-control"/>
                        </div>

                         <div class="form-group">
                            <input type="submit" onclick="SendData()" name="submit" value="Submit" class="btn btn-default" />
                         </div>

                    </div>
                </div>
            </div>

            <!--jquery -->
            <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.1.0/jquery.min.js"></script>
            <!-- Latest compiled and minified JavaScript -->
            <script src="StreamLab\StreamLab-soket.js"></script>
            <script>
                    function SendData(){
                        var msg = $('#name').val();
                        var _token = "{{ csrf_token()  }}";
                        $.post('str' , {msg:msg , _token:_token} , function(){
                            $('#name').val(' ');
                        });
                    }
                    var sock = StreamLabSocket;
                    sock.init("{{ config('stream_lab.app_id')  }}" , 'test');
                    sock.message(function(event){
                       sock.showOnlineAndMessages(event , 'msg' , 'online');
                    });
            </script>
        </body>
</html>
```

this part send ajax request to route str with post method

```javascript
  function SendData(){
        var msg = $('#name').val();
        var _token = "{{ csrf_token()  }}";
        $.post('str' , {msg:msg , _token:_token} , function(){
             $('#name').val(' ');
       });
  }         
 ```        
 
 this part will connect to api and wating on channel test and show messages on #msg and who online on #online
 
```javascript
  var sock = StreamLabSocket;
           sock.init("{{ config('stream_lab.app_id')  }}" , 'test');
           sock.message(function(event){
           sock.showOnlineAndMessages(event , 'msg' , 'online');
 });
```

3- add this to your route

```php
  Route::post('str' , function(\Illuminate\Http\Request $request){
      StreamLab::CreateChannel('test');
      StreamLab::pushMessage('test' , 'SendMessage' , $request->msg);
  });
```

this will get the message that user send and create testChannel push the mesages to all connect user on this channel

#Disable web browser notification 

```javascript
soc.browserNotification = false 
```

#Set web browser notification title 

```javascript
soc.title = "your title" 
```

#Change browser notification Image 

just replace the /public/StreamLab/fb-pro.png with your image

#Get the message only 

 
```javascript
  var sock = StreamLabSocket;
           sock.init("{{ config('stream_lab.app_id')  }}" , 'test');
           sock.message(function(event){
               sock.getMessage();
            });
```


#Get Who is online on this channel  

 
```javascript
  var sock = StreamLabSocket;
           sock.init("{{ config('stream_lab.app_id')  }}" , 'test');
           sock.message(function(event){
               sock.Online();
            });
```

#Add Template to messages show

imagine that you want to show the messages in <li> tag and add come class or id 

```javascript
  var sock = StreamLabSocket;
           sock.init("{{ config('stream_lab.app_id')  }}" , 'test');
           sock.msgtemplate = ['li' , 'className'   , 'idName']
           sock.message(function(event){
           sock.showOnlineAndMessages(event , 'msg' , 'online');
 });
```
