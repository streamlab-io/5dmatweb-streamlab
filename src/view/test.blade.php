<html>
    <head>
        <title>Some page</title>
        <!-- bootstrap -->
        <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css" integrity="sha384-BVYiiSIFeK1dGmJRAkycuHAHRg32OmUcww7on3RYdg4Va+PmSTsz/K68vbdEjh4u" crossorigin="anonymous">

    </head>
        <body>
            <div class="container">
                <div class="row">
                    <h1>Hi All</h1>
                    <div id="login">
                        <input type="number" id="UserId" class="form-control" ><br>
                        <input type="submit" class="btn btn-default" value="Login" id="loginBtn">
                    </div>
                    <div class="row" id="system" style="display: none">
                        <div class="col-lg-9">
                            <ul id="messages" class="well" style="height: 300px;overflow: auto"></ul>
                            <div class="form-inline">
                                <input type="text" id="messageText" class="form-control">
                                <input type="submit" class="btn btn-default" id="sendMessage">
                            </div>
                        </div>
                        <div  class="col-lg-3" >
                            <div class="well" style="height: 300px;overflow: auto">
                                <div> online : <span id="online"></span></div>
                                <hr>
                                <div id="onlineusers"></div>
                            </div>
                            <div class="well" id="channels"></div>
                        </div>

                    </div>
                </div>
            </div>
            
            <script src="/StreamLab/StreamLab.js"></script>
            <script>
                var slh = new StreamLabHtml();
                var sln = new StreamLabNotification();
                slh.addEventListener('loginBtn' , 'click' , function(){
                    slu = new StreamLabUser();
                    slu.userExist("{{ url('streamLab/app/checkuser') }}" , slh.getVal('UserId') , function(response){

                        if(response.status){
                            slh.show('system');
                            slh.hide('login');
                            var json = slu.json(response).data;
                            var sls = new StreamLabSocket({
                                appId:"{{ config('stream_lab.app_id') }}",
                                //channelName:"",
                                //channelSecret:"",
                                channelName:'test',
                                event:"*",
                                user_id:json.id,
                                user_secret:json.secret
                            });
                            //slh.msgTemplate = ['li' , 'id' , 'class'];
                            //slh.onlineTemplate = ['div' , 'id' , 'well'];
                            sls.socket.onmessage = function(res){
                                slh.setData(res);
                                //console.log(res);
                                //console.log(slh.getMessage());
                                //console.log(slh.getOnline());
                                //slh.setMessages('messages');
                                //slh.setOnline('online');
                                slh.updateChannelOnline();
                                slh.setOnlineAndMessages('online' , 'messages');
                                slh.updateUserList(function(id){
                                    slu.userExist("{{ url('streamLab/app/checkuser') }}" , id , function(response){
                                        if(response.status){
                                            slh.showOnlineUsers('onlineusers' , response , ['name']);
                                            sln.makeNotification('User ' , 'User Login');
                                        }
                                    })
                                } , function(id){
                                    sln.makeNotification('User ' , 'User Logout');
                                });
                                if(slh.getSource() == 'messages')
                                    sln.makeNotification("Message From Stream lab" , slh.getMessage());
                            };
                            slu.getAllUser("{{ url('streamLab/app/user') }}" ,function(online){
                                slh.showOnlineUsers('onlineusers' , online , ['name']);
                            }, 10 ,0);
                            slh.addEventListener('sendMessage' , 'click' , function(){
                                sls.sendMessage("{{ url('streamLab/post/message') }}",{_token:"{{ csrf_token() }}",message:slh.getVal('messageText')},function(){
                                    slh.setVal('messageText' , ' ');
                                });
                            });
                            //slh.channelTemplate = ['div' , 'id' , 'class'];
                            slh.getAllChannel('channels');
                            slh.getChannel('test' , null , function(response){
                                console.log(response);
                            });
                        }else{
                            slh.setVal('UserId' , '');
                            alert('Error login')
                        }
                    });
                });


                /*
                /////channel control
                 slh.createChannel('private', function(response){
                 alert(response.status);
                 } ,'true' );

                 slh.deleteChannel('private' , function(response){
                 alert(response.status);
                 });


                 ////user control method
                 slu = new StreamLabUser();
                 var data = {

                 id:100,
                 secret:123,
                 _token:"{{-- csrf_token() --}}",
                 name:"hassan",
                 age:20
                 };
                 slu.createUser("{{-- url('streamLab/create/user') --}}" , data , function(response){
                 console.log(response);
                 });
                 slu.updateUser("{{-- url('streamLab/update/user') --}}" , data , function(response){
                 console.log(response)
                 });
                 slu.getAllUser("{{-- url('streamLab/app/user') --}}" ,function(response){
                 console.log(response);
                 }, 10 ,1 , 'test');
                 slu.deleteUser("{{-- url('streamLab/app/user/delete') --}}" , 100 , function(response){
                 console.log(response)
                 });
                 slu.userExist("{{-- url('streamLab/app/checkuser')--}}" , 30 , function(response){
                 if(response.status){
                 var json = slu.json(response).data.data;
                 alert("Hi " + json.name);
                 }else{
                 alert('Error login')
                 }
                 });
                 */



            </script>

        </body>
</html>
