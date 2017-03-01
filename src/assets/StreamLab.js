!function(a,b){"use strict";"function"==typeof define&&define.amd?define("ajax",b):"object"==typeof exports?exports=module.exports=b():a.ajax=b()}(this,function(){"use strict";function a(a){var d=["get","post","put","delete"];return a=a||{},a.baseUrl=a.baseUrl||"",a.method&&a.url?c(a.method,a.baseUrl+a.url,b(a.data),a):d.reduce(function(d,e){return d[e]=function(d,f){return c(e,a.baseUrl+d,b(f),a)},d},{})}function b(a){return a||null}function c(a,b,c,e){var g=["then","catch","always"],i=g.reduce(function(a,b){return a[b]=function(c){return a[b]=c,a},a},{}),j=new XMLHttpRequest;return j.open(a,b,!0),d(j,e.headers),j.addEventListener("readystatechange",f(i,j),!1),j.send(h(c)),i.abort=function(){return j.abort()},i}function d(a,b){b=b||{},e(b)||(b["Content-Type"]="application/x-www-form-urlencoded"),Object.keys(b).forEach(function(c){b[c]&&a.setRequestHeader(c,b[c])})}function e(a){return Object.keys(a).some(function(a){return"content-type"===a.toLowerCase()})}function f(a,b){return function c(){b.readyState===b.DONE&&(b.removeEventListener("readystatechange",c,!1),a.always.apply(a,g(b)),b.status>=200&&b.status<300?a.then.apply(a,g(b)):a.catch.apply(a,g(b)))}}function g(a){var b;try{b=JSON.parse(a.responseText)}catch(c){b=a.responseText}return[b,a]}function h(a){return i(a)?j(a):a}function i(a){return"[object Object]"===Object.prototype.toString.call(a)}function j(a){return Object.keys(a).reduce(function(b,c){var d=b?b+"&":"";return d+k(c)+"="+k(a[c])},"")}function k(a){return encodeURIComponent(a)}return a});var StreamLabSocket=function(){function a(a){this.appId=a.appId,this.channelName=a.channelName,this.event=a.event,this.channelSecret=a.channelSecret,this.user_id=a.user_id,this.user_secret=a.user_secret,this.id=this.appId,this.secret=this.channelSecret,this.channel=this.channelName,this.events=this.event,this.userId=this.user_id,this.userSecret=this.user_secret,this.init()}return a.prototype.userId=null,a.prototype.userSecret=null,a.prototype.ssl=!0,a.prototype.events=null,a.prototype.secret=null,a.prototype.id="",a.prototype.socket=null,a.prototype.channel=null,a.prototype.timeOut=1e4,a.prototype.url="://api.streamlab.io/apps/",a.prototype.init=function(){this.openNewSocket()},a.prototype.openNewSocket=function(){try{return this.socket=new WebSocket(this.buildUrl()),this.errorConnection(),this.openConnection(),this.resumeConnection(this)}catch(a){return console.log("Stream Lab Have error on open socket check your connection or check your prams .."),!1}},a.prototype.buildUrl=function(){return this.sslAppend()+this.url+this.id+"/channels/"+this.channel+"/messages?events="+this.checkIfEventExists()+this.checkIfChannelPrivate()+this.checkIfUserSubscribe()},a.prototype.sslAppend=function(){return this.ssl===!0?"wss":"ws"},a.prototype.checkIfEventExists=function(){return void 0===this.events?"*":this.events},a.prototype.checkIfChannelPrivate=function(){return void 0===this.secret?"":"&channel_secret="+this.secret},a.prototype.checkIfUserSubscribe=function(){return null!=this.userId&&null!=this.userSecret?"&user_id="+this.userId+"&user_secret="+this.userSecret:""},a.prototype.errorConnection=function(){return this.socket.onerror=function(a){return console.log("StreamLab Connection error ...")}},a.prototype.openConnection=function(){return this.socket.onopen=function(){return console.log("StreamLab Connected Now ...")}},a.prototype.resumeConnection=function(a){return this.socket.onclose=function(){setTimeout(function(){console.log("Stream lab Connection is lost reconnect in "+a.timeOut/1e3+" second .."),a.init()},a.timeOut)}},a.prototype.sendMessage=function(a,b,c){ajax().post(a,b).then(function(a){return c(a)})},a}(),StreamLabHtml=function(){function a(){}return a.prototype.data=null,a.prototype.msgTemplate=[],a.prototype.onlineTemplate=[],a.prototype.channelTemplate=[],a.prototype.onlineNow=0,a.prototype.json=function(a){try{return JSON.parse(a)}catch(b){return a}},a.prototype.setData=function(a){return this.data=this.json(a.data),this.onlineNow=this.getOnline()},a.prototype.getSource=function(){return null!=this.data?this.data.data.source:"StreamLabHtml lib cannot find any data"},a.prototype.getOnline=function(){return"channels"===this.getSource()&&this.data.data.data.online},a.prototype.getMessage=function(){return"messages"===this.getSource()&&this.data.data.data.data},a.prototype.getById=function(a){return document.getElementById(a)},a.prototype.getVal=function(a){return this.getById(a).value},a.prototype.setVal=function(a,b){return this.getById(a).value=b},a.prototype.html=function(a,b){return this.getById(a).innerHTML=b},a.prototype.append=function(a,b){var c;return c=this.getById(a),c.innerHTML=c.innerHTML+b},a.prototype.setOnlineAndMessages=function(a,b){return this.setMessages(b),this.setOnline(a)},a.prototype.setMessages=function(a){var b;if(b=this.getMessage(),b!==!1)return 0===this.msgTemplate.length?this.append(a,b+"<br>"):this.extractTemplate(a,this.msgTemplate,b)},a.prototype.extractTemplate=function(a,b,c,d){d=void 0===d?"":d;var e;e="";for(var f=0;f<=b.length;f++)e+=0==f?"<"+b[f]:1==f?" id='"+b[f]+"'":2==f?"  class='"+b[f]+"'":d+">"+c+"</"+b[0]+">";return this.append(a,e)},a.prototype.setOnline=function(a){var b;b=this.getOnline(),b!==!1&&this.html(a,b)},a.prototype.showOnlineUsers=function(a,b,c){try{var d="",e=b.data;e=void 0===e.length?[e]:e;for(var f=0;f<e.length;f++)if(this.userInList(e[f].id)){d="";for(var g=0==e[f].online?"offline":"Online",h=0;h<c.length;h++)void 0!==e[f].data[c[h]]&&(d+=c[h]+" : "+e[f].data[c[h]],d+="<br>");d+='<span data-status="'+e[f].id+'"> status : '+g+"</span>",this.onlineTemplate.length>0?this.extractTemplate(a,this.onlineTemplate,d,'data-id="'+e[f].id+'"'):(d+="<hr>",this.extractTemplate(a,["span","",""],d,'data-id="'+e[f].id+'"'))}}catch(a){console.log("There are error on user info")}},a.prototype.addEventListener=function(a,b,c){return this.getById(a).addEventListener(b,function(a){a.preventDefault(),c()})},a.prototype.hide=function(a){return this.setAttr(a,"style","display:none")},a.prototype.show=function(a){return this.removeAttr(a,"style")},a.prototype.setAttr=function(a,b,c){return this.getById(a).setAttribute(b,c)},a.prototype.getAttr=function(a,b){return this.getById(a).getAttribute(b)},a.prototype.removeAttr=function(a,b){return this.getById(a).removeAttribute(b)},a.prototype.updateUserList=function(a,b){"user.online"==this.getSource()&&(this.updateList("online"),void 0===a?"":a(this.data.data.data.userID)),"user.offline"==this.getSource()&&(this.updateList("offline"),void 0===b?"":b(this.data.data.data.userID))},a.prototype.updateList=function(a){var b=document.querySelectorAll('[data-status="'+this.data.data.data.userID+'"]');void 0!==b[0]&&(b[0].innerHTML="status : "+a)},a.prototype.userInList=function(a){var b=document.querySelectorAll('[data-id="'+a+'"]');return void 0===b[0]},a.prototype.updateChannelOnline=function(a){if("channels"==this.getSource())return void 0===a?this.updateNumber(this.data.data.data.id):a},a.prototype.updateNumber=function(a){var b=document.querySelectorAll('[data-channel-online="'+a+'"]');void 0!==b[0]&&(b[0].innerHTML=this.getOnline())},a.prototype.getAllChannel=function(a,b,c){c=void 0===c?"streamLab/app/getAllChannels":c;var d=this;ajax().get(c).then(function(c){b=void 0===b?d.extractChannel(a,c):b(c)})},a.prototype.extractChannel=function(a,b){for(var c=this.json(b).data,d="",e=0;e<c.length;e++)this.channelTemplate.length>0?this.extractTemplate(a,this.channelTemplate,"name : "+c[e].name+" <br> online : <span data-channel-online='"+c[e].id+"'>"+c[e].online+"</span>","data-channel='"+c[e].id+"'"):(d="",d+="<span data-channel='"+c[e].id+"'>name : "+c[e].name+" <br> online : <span data-channel-online='"+c[e].id+"'>"+c[e].online+"</span></span><hr>",this.append(a,d))},a.prototype.getChannel=function(a,b,c,d){b=void 0===b||null==b?"":"&secret="+b,d=void 0===d?"/streamLab/app/get/channel":d,ajax().get(d+"?channelName="+a+b).then(function(a){c(a)})},a.prototype.createChannel=function(a,b,c,d){d=void 0===d?"/StreamLab/create/Channel/":d,b=void 0===b?"":"&secret="+b;var e=this;ajax().get(d+"?channelName="+a+b).then(function(a){c=void 0===c?"":c(e.json(a))})},a.prototype.deleteChannel=function(a,b,c){c=void 0===c?"/StreamLab/delete/Channel/":c;var d=this;ajax().get(c+"?channelName="+a).then(function(a){b=void 0===b?"":b(d.json(a))})},a}(),StreamLabUser=function(){function a(){}return a.prototype.deleteUser=function(a,b,c){this.checkDeleteUser(a,b,c)},a.prototype.userExist=function(a,b,c){var d=this;this.checkDeleteUser(a,b,function(a){return c(d.json(a))})},a.prototype.createUser=function(a,b,c){this.createUpdateUser(a,b,c)},a.prototype.updateUser=function(a,b,c){this.createUpdateUser(a,b,c)},a.prototype.getAllUser=function(a,b,c,d,e){c=void 0===c?"":"?limit="+c,d=void 0===d?"":"&offset="+d,e=void 0===e?"":"&channel="+e;var f=this;ajax().get(a+c+d+e).then(function(a){return b(f.json(a))})},a.prototype.createUpdateUser=function(a,b,c){ajax().post(a,b).then(function(a){return c(a)})},a.prototype.checkDeleteUser=function(a,b,c){return void 0===b?"You Must Select id ..":(b="integer"==typeof b?b:parseInt(b),void ajax().get(a+"?id="+b).then(function(a){return c(a)}))},a.prototype.json=function(a){try{return JSON.parse(a)}catch(b){return a}},a}(),StreamLabNotification=function(){function a(){this.init()}return a.prototype.browserNotification=!0,a.prototype.icon="/StreamLab/fb-pro.png",a.prototype.time=500,a.prototype.init=function(){if(this.browserNotification)return this.notificationsPermission(this)},a.prototype.makeNotification=function(a,b){if(this.browserNotification){var c=this.notificationOption(b);return this.appendNotification(a,c)}},a.prototype.appendNotification=function(a,b){try{return new Notification(a,b)}catch(a){console.log(a)}},a.prototype.notificationOption=function(a){return{body:a,icon:this.icon,timeout:this.time}},a.prototype.notificationsPermission=function(a){Notification.requestPermission().then(function(b){if("denied"===b)return a.browserNotification=!1})},a}();
