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
                            <input type="submit" id="send" name="submit" value="Submit" class="btn btn-default" />
                         </div>

                    </div>
                </div>
            </div>

            <!--jquery -->
            <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.1.0/jquery.min.js"></script>
            <!-- Latest compiled and minified JavaScript -->
            <script src="StreamLab\StreamLab-soket.js"></script>
            <script>
                var sock = StreamLabSocket;
                ///send ajax request
                sock.token = "{{ csrf_token() }}";
                sock.postData('send', 'str' , 'name'  , function(){});
                ///connect to channel
                sock.init("{{ config('stream_lab.app_id') }}" , 'test');
                sock.message(function(e){
                    sock.data = e;
                    sock.showOnlineAndMessages('msg' , 'online');
                });
            </script>
        </body>
</html>
```

this part send ajax request to route str with post method
prams 1 the id of the btn ,
prams 2 the url to send the ajax request,
prams 3 array of fields of data [name , pass , email]
prams 4 call back function

```javascript
  var sock = StreamLabSocket;
  ///send ajax request
  sock.token = "{{ csrf_token() }}";
  sock.postData('send', 'str' , 'name'  , function(){});        
 ```        
 
 this part will connect to api and wating on channel test and show messages on #msg and who online on #online
 
```javascript
  var sock = StreamLabSocket;
           sock.init("{{ config('stream_lab.app_id')  }}" , 'test');
           sock.message(function(event){
           sock.data = event;
           sock.showOnlineAndMessages('msg' , 'online');
 });
```

3- add this to your route

```php
  Route::post('str' , function(\Illuminate\Http\Request $request){
      StreamLab::CreateChannel('test');
      StreamLab::pushMessage('test' , 'SendMessage' , $request->msg);
  });
```

this will get the message that user send and create testChannel push the messages to all connected user on this channel

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
               sock.data = event;
               sock.getMessage();
            });
```


#Get Who is online on this channel  

 
```javascript
  var sock = StreamLabSocket;
           sock.init("{{ config('stream_lab.app_id')  }}" , 'test');
           sock.message(function(event){
               sock.data = event;
               sock.Online();
            });
```

#Add Template to messages show

imagine that you want to show  messages in < li > tag and add class or id 

```javascript
  var sock = StreamLabSocket;
           sock.init("{{ config('stream_lab.app_id')  }}" , 'test');
           sock.msgtemplate = ['li' , 'className'   , 'idName']
           sock.message(function(event){
           sock.data = event;
           sock.showOnlineAndMessages( 'msg' , 'online');
 });
```

#Get events from data 

 
```javascript
  var sock = StreamLabSocket;
           sock.init("{{ config('stream_lab.app_id')  }}" , 'test');
           sock.message(function(event){
               sock.data = event;
               sock.getEvent();
            });
```

#check if event or events exists

 
```javascript
  var sock = StreamLabSocket;
           sock.init("{{ config('stream_lab.app_id')  }}" , 'test');
           sock.message(function(event){
               sock.data = event;
               sock.checkIfEventExists(['SendMessage' , 'HomeMessage' , 'home' , 'test']))
            });
```

#if event come do something

 
```javascript
  var sock = StreamLabSocket;
           sock.init("{{ config('stream_lab.app_id')  }}" , 'test');
           sock.message(function(event){
               sock.data = event;
               sock.doIfEventExists('home' , function(d){
                   console.log(d)
               });            
        });
```
