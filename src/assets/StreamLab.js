!function(e,t){"use strict";"function"==typeof define&&define.amd?define("ajax",t):"object"==typeof exports?exports=module.exports=t():e.ajax=t()}(this,function(){"use strict";function e(e){var r=["get","post","put","delete"];return e=e||{},e.baseUrl=e.baseUrl||"",e.method&&e.url?n(e.method,e.baseUrl+e.url,t(e.data),e):r.reduce(function(r,u){return r[u]=function(r,o){return n(u,e.baseUrl+r,t(o),e)},r},{})}function t(e){return e||null}function n(e,t,n,u){var c=["then","catch","always"],s=c.reduce(function(e,t){return e[t]=function(n){return e[t]=n,e},e},{}),i=new XMLHttpRequest;return i.open(e,t,!0),r(i,u.headers),i.addEventListener("readystatechange",o(s,i),!1),i.send(a(n)),s.abort=function(){return i.abort()},s}function r(e,t){t=t||{},u(t)||(t["Content-Type"]="application/x-www-form-urlencoded"),Object.keys(t).forEach(function(n){t[n]&&e.setRequestHeader(n,t[n])})}function u(e){return Object.keys(e).some(function(e){return"content-type"===e.toLowerCase()})}function o(e,t){return function n(){t.readyState===t.DONE&&(t.removeEventListener("readystatechange",n,!1),e.always.apply(e,c(t)),t.status>=200&&t.status<300?e.then.apply(e,c(t)):e["catch"].apply(e,c(t)))}}function c(e){var t;try{t=JSON.parse(e.responseText)}catch(n){t=e.responseText}return[t,e]}function a(e){return s(e)?i(e):e}function s(e){return"[object Object]"===Object.prototype.toString.call(e)}function i(e){return Object.keys(e).reduce(function(t,n){var r=t?t+"&":"";return r+f(n)+"="+f(e[n])},"")}function f(e){return encodeURIComponent(e)}return e});

/*
   socket
    Written by Abdel Aziz hassan
    5damt-web team
    https://5dmat-web.com/
    https://streamlab.io/
*/

var StreamLabSocket = (function() {
    function StreamLabSocket(SubscripeOption) {
        this.appId = SubscripeOption.appId, this.channelName = SubscripeOption.channelName, this.event = SubscripeOption.event, this.channelSecret = SubscripeOption.channelSecret , this.user_id = SubscripeOption.user_id , this.user_secret = SubscripeOption.user_secret;
        this.id = this.appId;
        this.secret = this.channelSecret;
        this.channel = this.channelName;
        this.events = this.event;
        this.userId = this.user_id;
        this.userSecret = this.user_secret;
        this.init();
    }
    StreamLabSocket.prototype.userId = null;
    StreamLabSocket.prototype.userSecret = null;
    StreamLabSocket.prototype.ssl = true;
    StreamLabSocket.prototype.events = null;
    StreamLabSocket.prototype.secret = null;
    StreamLabSocket.prototype.id = "";
    StreamLabSocket.prototype.socket = null;
    StreamLabSocket.prototype.channel = null;
    StreamLabSocket.prototype.timeOut = 10000;
    StreamLabSocket.prototype.url = "://api.streamlab.io/apps/";
    StreamLabSocket.prototype.init = function(){
        this.openNewSocket();
    };
    StreamLabSocket.prototype.openNewSocket = function() {
        try {
            this.socket = new WebSocket(this.buildUrl());
            this.errorConnection();
            this.openConnection();
            return this.resumeConnection(this);
        }catch(e){
            console.log("Stream Lab Have error on open socket check your connection or check your prams ..")
            return false;
        }

    };
    StreamLabSocket.prototype.buildUrl = function() {
        return  this.sslAppend() + this.url + this.id + "/channels/" + this.channel + "/messages?events=" + this.checkIfEventExists() + this.checkIfChannelPrivate() + this.checkIfUserSubscribe();
    };
    StreamLabSocket.prototype.sslAppend = function() {
        if (this.ssl === true) {
            return "wss";
        } else {
            return "ws";
        }
    };
    StreamLabSocket.prototype.checkIfEventExists = function() {
        if (this.events === undefined) {
            return "*";
        } else {
            return this.events;
        }
    };
    StreamLabSocket.prototype.checkIfChannelPrivate = function() {
        if (this.secret === undefined) {
            return "";
        } else {
            return "&channel_secret=" + this.secret;
        }
    };
    StreamLabSocket.prototype.checkIfUserSubscribe = function() {
        return this.userId != null && this.userSecret != null ? '&user_id='+this.userId+'&user_secret='+this.userSecret : "";
    };
    StreamLabSocket.prototype.errorConnection = function() {
        return this.socket.onerror = function(e) {
            return console.log("StreamLab Connection error ...");
        };
    };
    StreamLabSocket.prototype.openConnection = function() {
        return this.socket.onopen = function() {
            return console.log("StreamLab Connected Now ...");
        };
    };
    StreamLabSocket.prototype.resumeConnection = function(soc) {
        return this.socket.onclose = function() {
            setTimeout((function() {
                console.log("Stream lab Connection is lost reconnect in " + (soc.timeOut / 1000) + " second ..");
                soc.init();
            }), soc.timeOut);
        };
    };
    StreamLabSocket.prototype.sendMessage = function(url , message , callback){
        ajax().post(url , message).then(function(response){
            return callback(response);
        });
    };
    return StreamLabSocket;
})();

/*
    Html Handel
     Written by Abdel Aziz hassan
     5damt-web team
     https://5dmat-web.com/
     https://streamlab.io/
*/

var StreamLabHtml = (function () {
    function StreamLabHtml() {

    }
    StreamLabHtml.prototype.data = null;
    StreamLabHtml.prototype.msgTemplate = [];
    StreamLabHtml.prototype.onlineTemplate = [];
    StreamLabHtml.prototype.channelTemplate = [];
    StreamLabHtml.prototype.onlineNow = 0;
    StreamLabHtml.prototype.setData = function(response) {
        this.data = JSON.parse(response.data);
        return this.onlineNow = this.getOnline();
    };
    StreamLabHtml.prototype.getSource = function() {
        if(this.data != null)
            return this.data.data.source;
        else
            return "StreamLabHtml lib cannot find any data";
    };
    StreamLabHtml.prototype.getOnline = function() {
        if (this.getSource() === "channels") {
            return this.data.data.data.online;
        } else {
            return false;
        }
    };
    StreamLabHtml.prototype.getMessage = function() {
        if (this.getSource() === "messages") {
            return this.data.data.data.data;
        } else {
            return false;
        }
    };
    StreamLabHtml.prototype.getById = function(id){
        return document.getElementById(id)
    };
    StreamLabHtml.prototype.getVal = function(id){
        return this.getById(id).value;
    };
    StreamLabHtml.prototype.setVal = function(id , data){
        return this.getById(id).value = data;
    };
    StreamLabHtml.prototype.html = function(id , data){
        return this.getById(id).innerHTML = data;
    };
    StreamLabHtml.prototype.append = function(id , data){
        var html;
        html = this.getById(id);
        return html.innerHTML = html.innerHTML + data;
    };
    StreamLabHtml.prototype.setOnlineAndMessages = function(onlineId, msgId) {
        this.setMessages(msgId);
        return this.setOnline(onlineId);
    };
    StreamLabHtml.prototype.setMessages = function(id) {
        var messages;
        messages = this.getMessage();
        if (messages !== false) {
            if (this.msgTemplate.length === 0) {
                return this.append(id, messages + "<br>");
            } else {
                return this.extractTemplate(id , this.msgTemplate , messages);
            }
        }
    };
    StreamLabHtml.prototype.extractTemplate = function(id , template , data , customAttr) {
        customAttr = customAttr === undefined ? "" : customAttr;
        var tag;
        tag = "";
        for(var i = 0 ; i <= template.length ;i++){
            if (i == 0)
                tag += "<"+template[i];
            else if  (i == 1)
                tag += " id='"+template[i]+"'";
            else if  (i == 2)
                tag += "  class='"+template[i]+"'";
            else
                tag += customAttr+">"+data+"</"+template[0]+">";
        }
        return this.append(id, tag);
    };
    StreamLabHtml.prototype.setOnline = function(id) {
        var online;
        online = this.getOnline();
        if (online !== false) {
            this.html(id, online);
        }
    };
    StreamLabHtml.prototype.showOnlineUsers = function(id , data , property){
        try{
            var z = '';
            var json = data.data;
            json = json.length === undefined ? [json] : json;
            for(var i = 0 ; i < json.length ; i++){
                if(this.userInList(json[i].id)){
                    z = '';
                    var online = json[i].online == false ? "offline" : "Online";
                    for(var j = 0 ; j < property.length ; j++){
                        if(json[i].data[property[j]] !== undefined){
                            z += property[j]+' : '+json[i].data[property[j]];
                            z += '<br>';
                        }
                    }
                    z +='<span data-status="'+json[i].id+'"> status : '+online+'</span>';
                    if(this.onlineTemplate.length > 0){
                        this.extractTemplate(id , this.onlineTemplate , z , 'data-id="'+json[i].id+'"');
                    }else{
                        z += '<hr>';
                        this.extractTemplate(id , ['span' , '' , ''] , z , 'data-id="'+json[i].id+'"');
                    }
                }
            }
        }catch (e){
            console.log('There are error on user info')
        }

    };
    StreamLabHtml.prototype.addEventListener = function(id  , action , callback){
        return this.getById(id).addEventListener(action , function(event){
            event.preventDefault();
            callback();
        });
    };
    StreamLabHtml.prototype.hide = function(id){
        return this.setAttr(id , 'style' , 'display:none');
    };
    StreamLabHtml.prototype.show = function(id){
        return this.removeAttr(id  , 'style');
    };
    StreamLabHtml.prototype.setAttr = function(id , attr , value){
        return this.getById(id).setAttribute(attr , value);
    };
    StreamLabHtml.prototype.getAttr = function(id , attr){
        return this.getById(id).getAttribute(attr);
    };
    StreamLabHtml.prototype.removeAttr = function(id , attr){
        return this.getById(id).removeAttribute(attr);
    };
    StreamLabHtml.prototype.updateUserList = function(online , offline){
        if(this.getSource() == 'user.online'){
            this.updateList('online');
            online === undefined ? "" : online(this.data.data.data.userID);
        }
        if(this.getSource() == 'user.offline'){
            this.updateList('offline');
            offline === undefined ? "" : offline(this.data.data.data.userID);
        }

    };
    StreamLabHtml.prototype.updateList = function(status){
        var html = document.querySelectorAll('[data-status="'+this.data.data.data.userID+'"]');
        if(html[0] !== undefined)
            html[0].innerHTML = "status : "+status;
    };
    StreamLabHtml.prototype.userInList = function(id){
        var html = document.querySelectorAll('[data-id="'+id+'"]');
        if(html[0] !== undefined){
            return false;
        }
        return true;
    };
    StreamLabHtml.prototype.updateChannelOnline = function(id , callback){
        if(this.getSource() == 'channels')
            return callback === undefined ? this.updateNumber(this.data.data.data.id) : callback;
    };
    StreamLabHtml.prototype.updateNumber = function(id){
        var html = document.querySelectorAll('[data-channel-online="'+id+'"]');
        if(html[0] !== undefined){
            html[0].innerHTML = this.getOnline();
        }
    };
    StreamLabHtml.prototype.getAllChannel = function(id , callback , url){
        url = url === undefined ? 'streamLab/app/getAllChannels' : url;
        var thisClass = this;
        ajax().get(url).then(function(response){
            callback = callback === undefined ? thisClass.extractChannel(id , response)  : callback(response);
         });
    };
    StreamLabHtml.prototype.extractChannel = function(id , response){
        var json = response.data;
        var z = "";
        for(var i = 0 ;i < json.length ; i++){
            if(this.channelTemplate.length > 0){
                this.extractTemplate(id , this.channelTemplate , "name : " +json[i].name+" <br> online : <span data-channel-online='"+json[i].id+"'>" + json[i].online + "</span>" , "data-channel='"+json[i].id +"'");
            }else{
               z = "";
               z += "<span data-channel='"+json[i].id+"'>name : " +json[i].name+" <br> online : <span data-channel-online='"+json[i].id+"'>" + json[i].online + "</span></span><hr>" ;
               this.append(id , z);
            }
        }
    };

    return StreamLabHtml;
})();

/*
    users handel
    Written by Abdel Aziz hassan
    5damt-web team
    https://5dmat-web.com/
    https://streamlab.io/
 */
var StreamLabUser = (function() {
    function StreamLabUser() {
        ///data
    }
    StreamLabUser.prototype.deleteUser = function(url , id ,  callback){
        this.checkDeleteUser(url , id ,  callback);
    };
    StreamLabUser.prototype.userExist  = function(url , id ,  callback){
        this.checkDeleteUser(url , id ,  callback);
    };
    StreamLabUser.prototype.createUser  = function(url , data ,  callback){
        this.createUpdateUser(url , data ,  callback);
    };
    StreamLabUser.prototype.updateUser  = function(url , data ,  callback){
        this.createUpdateUser(url , data ,  callback);
    };
    StreamLabUser.prototype.getAllUser = function(url , callback , limit , offset , channel){
        limit  = limit === undefined ? "" : "?limit="+limit;
        offset  = offset === undefined ? "" : "&offset="+offset;
        channel  = channel === undefined ? "" : "&channel="+channel;
        ajax().get(url+limit+offset+channel).then(function(response){
            return callback(response);
        });
    };
    StreamLabUser.prototype.createUpdateUser  = function(url , data ,callback){
        ajax().post(url , data).then(function(response){
            return callback(response);
        });
    };
    StreamLabUser.prototype.checkDeleteUser = function(url , id ,  callback){
        if(id !== undefined){
            id = typeof id == 'integer' ? id :  parseInt(id);
            ajax().get(url+'?id='+id).then(function(response){
                return callback(response);
            });
        }else{
            return "You Must Select id ..";
        }
    };
    StreamLabUser.prototype.json = function(data){
        try{
            return JSON.parse(data);
        }catch (e){
            return data;
        }
    };
    return StreamLabUser;
})();

/*
    notification handel
     Written by Abdel Aziz hassan
     5damt-web team
     https://5dmat-web.com/
     https://streamlab.io/
 */

var StreamLabNotification = (function(){
    function StreamLabNotification(){
        this.init();
    }
    StreamLabNotification.prototype.browserNotification = true;
    StreamLabNotification.prototype.icon = "/StreamLab/fb-pro.png";
    StreamLabNotification.prototype.time = 500;
    StreamLabNotification.prototype.init = function(){
        if(this.browserNotification)
            return this.notificationsPermission(this);
    };
    StreamLabNotification.prototype.makeNotification =  function(title , message){
        if(this.browserNotification){
            var options = this.notificationOption(message);
            return this.appendNotification(title , options);
        }
    };
    StreamLabNotification.prototype.appendNotification = function(title , options){
        try{
            return new Notification(title , options);
        }catch (e){
            console.log(e);
        }
    };
    StreamLabNotification.prototype.notificationOption = function( message){
        return {
            body: message,
            icon: this.icon,
            timeout: this.time
        };
    };
    StreamLabNotification.prototype.notificationsPermission = function(thisClass){
        Notification.requestPermission().then(function(result) {
            if (result === 'denied') {
                return  thisClass.browserNotification  = false;
            }
        });
    };
    return StreamLabNotification;
})();