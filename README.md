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
    
this command will add to files <br>
1-stream-lab.php on config file <br>
2-StreamLab.js on public/StreamLab/StreamLab-soket.js<br>
3-test.blade.php on resources/views/test.blade.php<br>



#How to Use
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


#connect to socket
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

#get data
after this step to connect to soket now you can recive data from our api <br>
now you must get this data with this funciton<br>
```
var slh = new StreamLabHtml()
sls.socket.onmessage = function(res){
  ///res is data send from our api
  ///set this data to our class so you can use our helper function 
  slh.setData(res);
}
```
after you get data from our api now you must make new object from our html handel class this <br>
class will allow you to make alot of things easy<br>

#get messages
you can get message now from our class StreamLabHtml by this function
```
slh.getMessage()
```

#get online 
you can get number of online on this channel from StreamLabHtml by this function
```
slh.getOnline()
```

#show data to user
ther are two ways to show data to user frist one <br>
by this funcitons from StreamLabHtml class<br>
first way
```
  slh.setMessages(id);
  slh.setOnline(id);
```
this functions take the id of the tag that you will show the messages or the online number<br>
second way
```
  slh.setOnlineAndMessages(onlineID , messagesID);
```
onlineID = the online number will show in this id<br>
messagesID = the message will show in this id<br>

you can make tamplate to show message 
```
  slh.msgTemplate = ['li' , 'id' , 'calss']
```
li = the tag we will put the message in this tag each message will push inside this tag<br>
id = id attribute<br>
calss = class attribute<br>








#user controll

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

#update user
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
#delete users
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
#check if user exist
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




