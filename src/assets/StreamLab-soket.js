/*
 *
 *   Stream Lab socket
 *   develop with 5dmat-web team
 *   https://streamlab.io
 *   https://5dmat-web.com/
 *   
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
    token:"",
    laravel:true,
    /// return data will store here
    data:"",
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
    checkIfInArray:function(array , key){
        if(this.checkIfArray(array)){
            for(var i = 0; i < array.length;i++){
                if(array[i].trim() == key.trim())
                    return [{"event":key , "status": true}];
            }
            return false;
        }
        return false;
    },
    checkIfArray:function(array){
        return array instanceof Array ? true : false;
    },
    getType:function(data){
        return typeof data;
    },
    checkIfEventArrayExists:function(data , eventname){
        var array = [];
        for(var i = 0 ; i < eventname.length ; i++){
            if(this.checkIfInArray(data , eventname[i]))
                array.push({"event":eventname[i] , "status" : true});
            else
                array.push({"event":eventname[i] , "status" : false});
        }
        return array;
    },
    checkIfEventExists:function(eventname){
        var events = this.getEvent();
        if(events) {
            if (this.checkIfArray(events)) {
                if (this.getType(eventname) === "string")
                    return this.checkIfInArray(events, eventname);
                else if (this.checkIfArray(eventname))
                    return this.checkIfEventArrayExists(events, eventname);
            }
        }
        else
             return false;
    },
    getEvent:function(){
        var e =  JSON.parse(this.data.data).data.data.hasOwnProperty('events');
        if(e)
            return JSON.parse(this.data.data).data.data.events;
        else
            return false;
    },
    getSource:function(){
        ///return with channel source
        return JSON.parse(this.data.data).data.source;
    },
    getMessage:function(){
        /// return with message
        return JSON.parse(this.data.data).data.data.data;
    },
    appendMessage:function(id){
        this.makeNotification(this.title , this.getMessage());
        ///append message to id
        if(this.checkProperty(id))
            if(this.msgtemplate.length > 0){
                this.addTemplate(this.getMessage());
                $('#'+id).append(this.tag);
            } else{
                $('#'+id).append(this.getMessage()+'<br>');
            }
        else
            this.addTag('div' , this.getMessage());
    },
    Online:function(){
        ///get online
        return JSON.parse(this.data.data).data.data.users;
    },
    appendOnline:function(id){
        ///append online to id
        if(this.checkProperty(id))
            $('#'+id).html(this.Online());
        else
            this.addTag('div' , this.Online());
    },
    showOnlineAndMessages:function( idMsg , idOnline){
        ///append online to id
        ///append message to id
        if(this.getSource() == 'channels') {
            if (this.checkProperty(idOnline))
                this.appendOnline(idOnline);
        }else{
            if (this.checkProperty(idMsg))
                this.appendMessage(idMsg);
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
            icon: "/StreamLab/fb-pro.png",
            timeout: 5000
        };
    },
    inArray:function(array , key){
        if(this.checkIfArray(array)){
            for(var i = 0; i < array.length;i++){
                if(array[i].trim() == key.trim())
                    return true;
            }
            return false;
        }
        return false;
    },
    doIfEventExists:function(eventname, callback){
        this.inArray(this.getEvent(), eventname) ? callback(this.data.data) : this.console("we can not find this event");
    },
    /////ajax requests
    postData:function(btn_id , url , id , callback  ){
        var url = this.getUrl(url);
        var obj = this;
        $('#'+btn_id).on('click' , function(){
            $.post(url , obj.BuildData(id) , callback);
        });
    },
    getUrl:function(url){
        return this.checkProperty(url) ? url : window.location.href;
    },
    getFieldValue:function(id){
        return this.checkProperty(id) ? $('#'+id).val() : false;
    },
    BuildData:function(id){
        if(!this.checkIfArray(id))
            id = [id];
        return this.getDataFromArray(id);
    },
    getDataFromArray:function(id){
        var data = {};
        if(this.laravel)
            data['_token'] = this.token;
        for(var i = 0 ; i < id.length ; i++){
            data[id[i]] = this.getFieldValue(id[i]);
        }
        return data;
    }
};
