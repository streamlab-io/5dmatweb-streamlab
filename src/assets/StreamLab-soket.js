/*
 *
 *   Stream Lab socket
 *   develop with 5dmat-web team
 *   https://streamlab.io
 *   https://5dmat-web.com/
 *       *
 *       * How to Use
 *       *
 *           var soc =  StreamLabSocket;
 *           soc.init('a07374d3-ebd3-4952-95e8-555464cc873e' , 'test' , 'test,hassan,hassan' , 'ssl');
 *           soc.showOnlineAndMessages(event , 'msg' , 'online');
 *           soc.appendMessage(event , 'msg');
 *           soc.appendOnline(event , 'online');
 *           soc.appendMessage(event);
 *           soc.appendOnline(event);
 *           $('#msg').append(soc.getMessage(event));
 *           $('#online').html(soc.Online(event));
 *           soc.msgtemplate = ['tag' , 'class' , 'id'];
 *           soc.message(function(event){
 *             soc.showOnlineAndMessages(event , 'msg' , 'online');
 *           });
 *           });
 *
 */
var StreamLabSocket = {
    url:"://api.streamlab.io/apps/",
    socket:"",
    tag:"",
    /// the default title of browser notification
    title:"Stream Lab Notification Browser",
    ////enable ssl connection
    ssl:true,
    ////enable browser notification
    browserNotification:true,
    ////define template ['tag' , 'id' , 'class']
    msgtemplate:[],
    init:function(key , channel , event ){
        this.openSocket(key ,channel ,event);
        if(this.browserNotification)
            this.notificationsPermission();
    },
    notificationsPermission:function(){
        Notification.requestPermission().then(function(result) {
            if (result === 'denied') {
                this.browserNotification  = false;
            }
        });
    },
    sslCheck:function(){
        return this.ssl === true ? 'wss' : 'ws';
    },
    checkEvent:function(event){
        return event === undefined ? "*" : event;
    },
    checkProperty:function(property){
        return property === undefined ? false : true;
    },
    addTag:function(tagName , data){
        if(this.checkProperty(data))
            document.body.innerHTML += '<'+tagName+'>'+data+'</'+tagName+'>';
    },
    makeUrl: function(key ,channel , event ){
        return this.sslCheck()+this.url+key+'/channels/'+channel+'/events/subscribe?events='+this.checkEvent(event);
    },
    openSocket:function(key ,channel , event){
        this.socket = new WebSocket(this.makeUrl(key ,channel , event));
        this.openConnection();
    },
    message:function(callback){
        this.socket.addEventListener('message', callback);
    },
    openConnection: function(){
        try{
            this.socket.onopen = function(){
                console.log('Stream Lab Connect Success .');
            };
        }catch (e){
            console.log(e);
        }
    },
    getSource:function(event){
        ///return with channel source
        return JSON.parse(event.data).data.source;
    },
    getMessage:function(event){
        /// return with message
        return JSON.parse(event.data).data.data.data;
    },
    appendMessage:function(event , id){
        this.makeNotification(this.title , this.getMessage(event));
        ///append message to id
        if(this.checkProperty(id))
            if(this.msgtemplate.length > 0){
                this.addTemplate(this.getMessage(event));
                $('#'+id).append(this.tag);
            } else{
                $('#'+id).append(this.getMessage(event)+'<br>');
            }
        else
            this.addTag('div' , this.getMessage(event));
    },
    Online:function(event){
        ///get online
        return JSON.parse(event.data).data.data.users;
    },
    appendOnline:function(event , id){
        ///append online to id
        if(this.checkProperty(id))
            $('#'+id).html(this.Online(event));
        else
            this.addTag('div' , this.Online(event));
    },
    showOnlineAndMessages:function(event , idMsg , idOnline){
        ///append online to id
        ///append message to id
        if(this.getSource(event) == 'channels') {
            if (this.checkProperty(idOnline))
                this.appendOnline(event, idOnline);
        }else{
            if (this.checkProperty(idMsg))
                this.appendMessage(event , idMsg);
        }
    },
    addTemplate:function(data){
        if(this.msgtemplate.length > 0){
            this.tag = this.templateSwish(data);
            return;
        }
        this.console("You Must Define template like this ['div' , 'calssname'  , 'id']");
    },
    templateSwish:function(data){
        var className = this.checkProperty(this.msgtemplate[1]) ? 'class="'+this.msgtemplate[1]+'"' : "";
        var idName = this.checkProperty(this.msgtemplate[2]) ? 'id="'+this.msgtemplate[2]+'"' : "";
        return '<'+this.msgtemplate[0]+' '+className+' '+idName+'>'+data+'</'+this.msgtemplate[0]+'>';
    },
    console:function(msg){
        console.log(msg);
    },
    closeConnection: function(){
        this.socket.close();
    },
    makeNotification:function(title , message){
        if(this.browserNotification){
            var options = this.notificationOption(message);
            this.appendNotification(title , options);
        }
    },
    appendNotification:function(title , options){
        try{
            new Notification(title , options);
        }catch (e){
            console.log(e);
        }
    },
    notificationOption:function( message){
        return {
            body: message,
            sound: '/StreamLab/sound.mp3'
        };
    }
};
