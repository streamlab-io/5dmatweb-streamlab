# 5dmatweb-streamlab
RealTime messages services streamlab.io

# installation

run this command form composer
`composer require 5dmatweb/streamlab:dev-master`
  
  
 # add service provider 
 open config/app add this line to provider array
 
```php
StreamLab\StreamLabProvider\StreamLabServiceProvider::class,
```

# and then publish this vendor

`php artisan vendor:publish`
    
this command will add to files <br>
1-stream-lab.php on config file <br>
2-StreamLab.js on public/StreamLab/StreamLab-soket.js<br>
3-test.blade.php on resources/views/test.blade.php<br>



# How to Use
1-add account to https://streamlab.io<br>

get app_id and key then add to config/stream-lab.php<br>

2- go to this route<br>

  ```
  yourserver /sl
  127.0.0.1:8000/sl
  ```
this will load test view in your first thing you must <br>
create user go to this link in our web site <a href="https://streamlab.io/en/dashboard/apps">Apps</a> <br>
choose your app then go to users tab add new user then add this id in your link<br>


# connect to socket
you can listen to channels by this way frist make new object form our lib StreamLabSocket<br>
the add this objec to this class<br>
```javascript
  var sls = new StreamLabSocket({
   appId:"",
   channelName:"",
   channelSecret:"",
   event:"*",
   user_id:"",
   user_secret:""
 });
```
appId = the app you connect we get htis value from config file<br>
channelName = the name of channel you want to listen <br>
channelSecret = if the channel is secret you must add the secret code here<br>
event = if you want to listn on specific evnet you can * for listen to all event or just add event name 'event'or<br>
you can listen to more than one like this event1,event2,event3<br>
user_id = you make user add user id here<br>
user_secret = if you make user add user_seceret here<br>
look to user section from here <a href="https://github.com/streamlab-io/5dmatweb-streamlab#user-controll">user section</a><br>

example
```javascript
  var sls = new StreamLabSocket({
   appId:"{{ config('stream_lab.app_id') }}",
   channelName:"test",
   channelSecret:"",
   event:"*",
   user_id:1000,
   user_secret:"asdasdlkkjkleke040e_sdsdklekj"
 });
```

if you want to allow to any one to subscribe this channel just add the id and the channel name
```javascript
  var sls = new StreamLabSocket({
   appId:"{{ config('stream_lab.app_id') }}",
   channelName:"test",
 });
```

# get data
after this step to connect to soket now you can recive data from our api <br>
now you must get this data with this funciton<br>
```javascript
var slh = new StreamLabHtml()
sls.socket.onmessage = function(res){
  ///res is data send from our api
  ///set this data to our class so you can use our helper function 
  slh.setData(res);
}
```
after you get data from our api now you must make new object from our html handel class this <br>
class will allow you to make alot of things easy<br>

# get messages
you can get message now from our class StreamLabHtml by this function
```javascript
slh.getMessage()
```

# get online 
you can get number of online on this channel from StreamLabHtml by this function
```javascript
slh.getOnline()
```

# show data to user
ther are two ways to show data to user frist one <br>
by this funcitons from StreamLabHtml class<br>
first way
```javascript
  slh.setMessages(id);
  slh.setOnline(id);
```
this functions take the id of the tag that you will show the messages or the online number<br>
second way
```javascript
  slh.setOnlineAndMessages(onlineID , messagesID);
```
onlineID = the online number will show in this id<br>
messagesID = the message will show in this id<br>

you can make tamplate to show message 
```javascript
  slh.msgTemplate = ['li' , 'id' , 'calss']
```
li = the tag we will put the message in this tag each message will push inside this tag<br>
id = id attribute<br>
calss = class attribute<br>


# send message to channel
now you must know how you can push message to channel we make function to make it easy to you
```javascript
  sls.sendMessage(url,data,callback);
```
url  = the url will get all users do not worry we set this routes for you<br>
data = it must be object contain _token , message property<br>
callback = the function will call when you get users<br>

example
```javascript
 sls.sendMessage("{{ url('streamLab/post/message') }}",
 {
   _token:"{{ csrf_token()}}"
   ,message:slh.getVal('messageText'),
   channelName:"public",
   eventName:"SendMessages"
 }
 ,function(){
  slh.setVal('messageText' , ' ');
 });
```
the <a href="https://github.com/streamlab-io/5dmatweb-streamlab/#set-data-to-input-by-id">slh.setVal</a> and the <a href="https://github.com/streamlab-io/5dmatweb-streamlab/#get-data-from-html-tag">slh.getVal</a> functions are helper function we build to make easy access to data <br>
and we can make it more usable by add listner function like this
```javascript
  slh.addEventListener('sendMessage' , 'click' , function(){
        sls.sendMessage("{{ url('streamLab/post/message') }}",
          {
            _token:"{{ csrf_token()}}",
            message:slh.getVal('messageText')
          },
          function(){
           slh.setVal('messageText' , ' ');
        });
  });

```
<a href="https://github.com/streamlab-io/5dmatweb-streamlab#addeventlistener">addEventListener</a> is helper function we bulid for you see how to use

# source of data
when we send you data will have property that show you the type of data so you can get this source
by this fucntion<br>
```javascript
  slh.getSource()
```
this will return <br>
1- messages = this mean that someone on this channel send message<br>
2- user.offline = this mean that one user left your channel <br>
3- user.online = this mean that one user login your channel <br>
4- channels = this will come  if user or vistor subscribe or left the channel <br>


# show online users

you can use this <a href="https://github.com/streamlab-io/5dmatweb-streamlab#get-all-user"> function </a> to get all users we make it easy to extract this info for you you can use this function

```javascript
  slh.showOnlineUsers(id , data , [property]);
```
id = the tag id will show user inside it<br>
data = user online data for this <a href="https://github.com/streamlab-io/5dmatweb-streamlab#get-all-user"> function </a><br>
[property] = array of property that you want to show we will by default show users status<br>

example
```javascript
  slu.getAllUser("{{ url('streamLab/app/user') }}" ,function(online){
        slh.showOnlineUsers('onlineusers' , online , ['name']);
  }, 10 ,0 , 'test');
```
you can add users inside specific by this property
```javascript
slh.onlineTemplate = ['div' , 'id' , 'well']
```
li = the tag we will put the user in this tag each user will push inside this tag<br>
id = id attribute<br>
calss = class attribute<br>

# append login user
after you show online user you must update if user log out or another user login you must update <br>
user list with the new data so you can use this function in this <a href="https://github.com/streamlab-io/5dmatweb-streamlab#get-data">action</a> after user set data to our lib you can now updat the list of online user this function will<br> append new user to list and update if user logout this function will update his status

```javascript
  slh.updateUserList(online , offline)
```

online = function call if user come online
offline  = function call if user come offline

example

```javascript
slh.updateUserList(function(id){
    ///here where user online
    ///check if user exist 
    slu.userExist("{{ url('streamLab/app/checkuser') }}" , id , function(response){
        if(response.status){
        ///append user to user list
         slh.showOnlineUsers('onlineusers' , response , ['name']);
         sln.makeNotification('User ' , 'User Login');
       }
     })
     } , function(id){
    ///what you will do if user ofline here
      sln.makeNotification('User ' , 'User Logout');
  });
```
makeNotification is class that handel browser notfication look more form <a href="https://github.com/streamlab-io/5dmatweb-streamlab/#browser-notification">here</a>


# get all channel
we make this function to help you to get all channel you have on you app
```javascript
  slh.getAllChannel(id , callback , url);
```
id = the id we will show channel in <br>
callback = optional if you not set we will show the channel name and how many online on it<br>
url = do not worry abot that we set it for you but you can change if if you want<br>
example
 ```javascript
  //show channels on channels id
  slh.getAllChannel('channels');
 ```
 you can make this more usable bys set channelTemplate by this code
 ```javascript
  slh.channelTemplate = ['div' , 'id' , 'class'];
 ```
 now each channel you show in div this div will have data-channel attribute and we show online on span<br>
 this span will have attribute call data-channel-online that is aviable if you not set the callback function<br>
 
 # create new channel
 we make it easy to create channel you can use this funciton
 
  ```javascript
    slh.createChannel(channelName , callback , secret ,  url);

 ```
 
 channelName = Channe name must be unique in the same app<br>
 callback = is function return what the api say<br>
 type = ture you will make private channel do not add this if his channel will be public<br>
 url = the url to add channel do not worry about this we set it for you<br>
 Example for private channel
 ```javascript
    slh.createChannel('private'  , function(response){
                 alert(response.status);
    }, 'true');
 
 ```
  Example for public channel
 ```javascript
    slh.createChannel('public'  , function(response){
                 alert(response.status);
    });
 
 ```
 
  # delete channel
  
  you can delete exist channel like this
  
  ```javascript
    slh.deleteChannel(channelName , callback , url)
  ```

  
 channelName = Channe name must be unique in the same app<br>
 callback = is function return what the api say<br>
 url = the url to add channel do not worry about this we set it for you<br>
 
 Example
 ```javascript
    slh.deleteChannel('private' , function(response){
                 alert(response.status);
   });
 ```
 
 
 #update channel online user 
 now after you show all channel maybe you want to update online user <br>
 if user login or log out<br>
 use this function inside message <a href="https://github.com/streamlab-io/5dmatweb-streamlab#get-data">action </a>
 ```javascript
   slh.updateChannelOnline();
 ```
 this code will update the cahnnel test when user login or logout 
 
# get channel info
if you want to get channel info you can use this funciton
```javascript
  slh.getChannel(channelName , channelSecret , callback , url)
```
channelName = the channel name <br>
channelSecret = if it was private you must have secret <br>
callback = what happen when you have response this call back will have the return data <br>
url = the route do not worry about that we set it for you but you still can change it <br>

example 
```javascript
   slh.getChannel('test' , null , function(response){
      /// here will get the channel info you 
      /// can extract the channel info
      console.log(response);
  });
```
this will return with public channel info call test




# user controll

we support to save your users info in our api this cool thing to check if users online or not <br>
and where are they connect or in any channel they subscribe<br>


#create user 
first make object form our lib call StreamLabUser<br>
then make data object data object must have id ,secret , _token properties<br>
then call createUser function<br>

```javascript
slu = new StreamLabUser();
    var data = {
          id:100,
          secret:123,
          _token:"{{ csrf_token() }}",
          name:"hassan",
          age:20
      };
      slu.createUser("{{ url('streamLab/create/user') }}" , data , function(response){
                 console.log(response);
      });
```
you can add any number of property to save in our api

# update user
first make object form our lib call StreamLabUser<br>
then make data object data object must have id ,secret , _token properties<br>
then call updateUser function<br>
```javascript
slu = new StreamLabUser();
    var data = {
          id:100,
          secret:123,
          _token:"{{ csrf_token() }}",
          name:"hassan",
          age:20
      };
      slu.updateUser("{{ url('streamLab/create/user') }}" , data , function(response){
                 console.log(response);
      });
```
#get all user
this option you can get all user register in your app with thier status if they online or offline,<br>
or you can get online users on channels<br>
```javascript
slu.getAllUser(url , callback , limit , offset , channel);
```
url  = the url will get all users do not worry we set this routes for you<br>
callback = the function will call when you get users<br>
limit =  the user limit<br>
offset =  get form recorecd number <br>
channel = if you put this prams this funciton will return with online user on this cahnnel if you leave it <br>
empty will return with all users on this app <br>
note  :: if you put channel name you will get the online users only put if leave it empty will return with online <br>
offline users<br>
example<br>
```javascript
slu.getAllUser("{{ url('streamLab/app/user') }}" ,function(response){
      /// online users on channel test
      console.log(response);
}, 10 ,1 , 'test');
```
another example
```javascript
slu.getAllUser("{{ url('streamLab/app/user') }}" ,function(response){
      /// all users on this app
      console.log(response);
}, 10 ,1);
```
# delete users
you can delete users from our service with this function 
```javascript
slu.userExist(url , userID ,callback)
```
url  = the url will get all users do not worry we set this routes for you<br>
userID = user id
callback = this will call when get response<br>
example
```javascript
slu.deleteUser("{{ url('streamLab/app/user/delete') }}" , userId , function(response){
      /// user deleted
      console.log(response)
});
```
# check if user exist
you can check if user exist in our api or not just call this function
```javascript
slu.userExist(url , userID ,callback)
```
url  = the url will get all users do not worry we set this routes for you<br>
userID = user id
callback = this will call when get response<br>
example

```javascript
 slu.userExist("{{ url('streamLab/app/checkuser') }}" , 30 , function(response){
     if(response.status){
        ///user found 
         var json = slu.json(response).data.data;
         alert("Hi " + json.name);
      }else{
      //user not found 
        alert('Error login')
       }
 });

```

# browser notification
we make class that handel browser notification 

#allow to use browser notification
when you make object form browser notification the browserNotification will be true that mean you can use it turn it to <br> false if you need to not use it
 ```
  sln = new StreamLabNotification();
  sln.browserNotification = false
 ```
 
 # icon 
 this lib allow to add icon to your notification so the default icon you will find it on public/streamlab/fb-pro.png<br>
you can replace it or you can add new path or new url like this
```javascript
  sln.icon = "/StreamLab/fb-pro.png";
  ///or
  icon = "https://streamlab.io/";
```

# time
you can add how many time you need to show this notification the default is 500
```javascript
  sln.time = 1000
```

# add notifiction 
now after this option you can add new notifiction by this fucntion
```javascript
  sln.makeNotification(title , message);
```
 
# helper function
we add a lot of helper function to make it easy to show or set or get data we use StreamLabHtml class for this

# get data form input by id
this function return with data form the id you set
```javascript
  slh.getVal(id)
```

# set data to input by id
this function set data to input by id
```javascript
  slh.setVal(id , value);
```

# get data from html tag
this function return with tag innerhtml
```javascript
  slh.html(id);
```

# append data to html tag
this function will append data to html tag
```javascript
  slh.append(id , data);
```
# hide html element by id
this function will hide html tag by add style display none
```javascript
  slh.hide(id);
```
# show html element by id
this function will show html tag by remove style display none
```javascript
  slh.show(id);
```

# set attribute to tag by id
this function will add custome  attribute to tag
```javascript
  slh.setAttr(id , attrName , attrValue);
```

# get attribute to tag by id
this function will get  attribute value
```javascript
  slh.getAttr(id , attrName);
```

# remove attribute to tag by id
this function will remove  attribute 
```javascript
  slh.removeAttr(id , attrName);
```
#addEventListener 
you can decet user behavior and add some action depend on this behaviorby this function
```javascript
  slh.addEventListener(id , action , callback)
```
example
```javascript
  slh.addEventListener('login' , 'submit' , function(){
      alert('Hi you press login btn');
  })
```


