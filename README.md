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
2-StreamLab.js on public/StreamLab/StreamLab-soket.js
3-test.blade.php on resources/views/test.blade.php



#How to Use
1-add account to https://streamlab.io

get app_id and key then add to config/stream-lab.php

2- go to this route

  ```
  yourserver /sl
  127.0.0.1:8000/sl
  ```
this will load test view in your first thing you must <br>
create user go to this link in our web site <a href="https://streamlab.io/en/dashboard/apps">Apps</a> <br>
choose your app then go to users tab add new user then add this id in your link<br>

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




