/* asap script loading library
 * MIT License: http://en.wikipedia.org/wiki/MIT_License
 * version:	0.4 - 4/10/2010
 * author: andrew dot luetgers at gmail
 */ 
if(!_now){var _now=function(){return new Date().getTime();};var _startTime=_now();var getLoadTime=function(){return _now()-_startTime;};}asap=(function(){DOMContentLoaded=null,bindReady=function(){if(API.readyBound){return;}API.readyBound=true;if(document.readyState==="complete"){return ready();}if(document.addEventListener){DOMContentLoaded=function(){document.removeEventListener("DOMContentLoaded",DOMContentLoaded,false);API.ready();};document.addEventListener("DOMContentLoaded",DOMContentLoaded,false);window.addEventListener("load",API.ready,false);}else{if(document.attachEvent){DOMContentLoaded=function(){if(document.readyState==="complete"){document.detachEvent("onreadystatechange",DOMContentLoaded);API.ready();}};document.attachEvent("onreadystatechange",DOMContentLoaded);window.attachEvent("onload",API.ready);}}var z=false;try{z=window.frameElement===null;}catch(A){}if((window.scrollTo||document.documentElement.doScroll)&&z){API.doScrollCheck();}},API={isReady:false,readyBound:false,readyList:[],getVersion:function(){return version;},doScrollCheck:function(){if(API.isReady){return;}try{if(window.scrollTo){window.scrollTo(0,0);}else{if(document.documentElement){document.documentElement.doScroll("left");}}}catch(z){setTimeout(API.doScrollCheck,1);return;}API.ready();},ready:function(){if(!API.isReady){if(!document.body){return setTimeout(API.ready,13);}API.isReady=true;var z;while(z=API.readyList.shift()){z();}if(this.codeReadyList.length){this.codeReady();}}},domReady:function(z){bindReady();if(z){if(this.isReady){z();if(this.codeReadyList.length){this.codeReady();}}else{this.readyList.push(z);}}return this;},codeReadyList:[],isCodeReady:false,codeReadyQued:false,codeReady:function(A){if(typeof A=="function"){this.codeReadyList.push(A);}if(this.require.reqQue.length===0){if(!this.isReady&&!this.codeReadyQued){this.codeReadyQued=true;this.domReady(function(){API.codeReady();});}else{if(this.readyList.length){API.domReady();}this.isCodeReady=true;if(this.codeReadyList.length){var z;while(z=this.codeReadyList.shift()){z();}}}}return this;}};var t,u;if(window.XMLHttpRequest&&(window.location.protocol!=="file:"||!window.ActiveXObject)){t=function(){return new window.XMLHttpRequest();};}else{t=function(){try{return new window.ActiveXObject("Microsoft.XMLHTTP");}catch(z){}};}API.get=function(A){var E=t(),z=A.url||false,D=A.onSuccess||false,B=A.onError||false;if(!E||!z||!D||!B){return;}E.open("GET",z,true);E.onreadystatechange=function(){if(E.readyState==4){if((window.location.protocol=="file:"||E.status==200)&&(E.responseText&&D)){D(E.responseText);}else{if(B){B(E.status);}}}};try{E.send("");}catch(C){if(B){B(C);}}return E;};var p=[],d={},f=/[a-z0-9\-\.]+\.[a-z]{2,3}$/i,j=/^http:/i,l=/^http:|file:/i,r=/.css$/,x=f.exec(window.location.host),q="",h=document.getElementsByTagName("head")[0]||document.documentElement,s=0,y=0,g=0,b=function(A){var z=j.exec(A);var B=window.location.protocol;if(z===null){return true;}if(B=="file:"){return false;}if(z[0]==B){if(A.match(x)){return true;}}return false;},o=function(z){var B,A;if((B=p[0])&&(A=d[B])){if(A.status=="loaded"){A.status="parsing";e(A.response+" ; (asap.require.evalComplete('"+B+"'));");}else{if(A.forceAttatch&&A.status!="loading"){A.status="loading";w(B);}}}},m=function(A){var z;if(p[0]==A&&(z=d[A])&&(z.status=="parsing"||z.status=="loaded")){y++;p.splice(0,1);delete d[A];if(p.length){o();}else{if(y==s){API.codeReady();}}}else{}},w=function(A){var z;if(z=d[A]){z.status="loading";k(A,function(){d[A].status="loaded";asap.require.evalComplete(A);},function(){throw new Error("asap.loadScript ERROR unable to load "+A);});}},k=function(A,C,B){var z=document.createElement("script");z.type="text/javascript";z.charset="utf-8";if(z.readyState){z.onreadystatechange=function(){if(z.readyState=="loaded"||z.readyState=="complete"){z.onreadystatechange=null;C();}};}else{z.onload=function(){C();};}z.onerror=function(){B();};z.src=A;h.appendChild(z);},v=(function(){var z=document.createElement("script"),C="script"+new Date().getTime(),A=false;z.type="text/javascript";try{z.appendChild(document.createTextNode("window."+C+"=1;"));}catch(B){}h.insertBefore(z,h.firstChild);if(window[C]){delete window[C];A=true;}h.removeChild(z);return A;}()),e=function(A){var z=document.createElement("script");z.type="text/javascript";if(v){z.appendChild(document.createTextNode(A));}else{z.text=A;}h.insertBefore(z,h.firstChild);h.removeChild(z);},n=function(z){var A=document.createElement("link");A.rel="stylesheet";A.type="text/css";A.href=z;h.appendChild(A);},i=function(D,A){var C,B,z;q=D.root||"";A=A||D.debug||window.location.href.match("asap=debug");if(typeof D=="object"){C=D.files||D;z=C.length||0;for(B=0;B<z;B++){a(C[B],A);}}else{a(D,A);}for(file in d){if(d.hasOwnProperty(file)){c(file);}}return this;},a=function(A,z){if(A.match(r)){n(A);return;}theFile=(l.exec(A))?A:q+A;if(!d[theFile]){API.isCodeReady=false;d[theFile]={status:"qued",xhr:false,response:false,forceAttatch:z||false};p.push(theFile);s++;}},c=function(z){var A=d[z];if(!b(z)||A.forceAttatch){g++;A.forceAttatch=true;o(z);}else{g++;A.xhr=asap.get({url:z,onSuccess:function(B){var C=d[z];if(B){C.status="loaded";}C.response=B;C.xhr=false;if(p[0]==z){o();}},onError:function(B){var C=d[z];if(typeof B=="object"&&"message" in B){C.status="ERROR";throw new Error("asap.get ERROR: "+B.message+" on "+z);}else{if(B!==404){w(z);}else{C.status="ERROR";throw new Error("asap.get ERROR: loading external resource: status code: "+B+" on "+z);}}}});}};API.domReady(o);API.require=i;API.require.evalComplete=m;API.require.reqQue=p;return API;}());(function(A,s,a,p){if(A[s]==null&&A[a]){A[s]="loading";A[a](p,a=function(){A[s]="complete";A.removeEventListener(p,a,false)},false)}})(document,"readyState","addEventListener","DOMContentLoaded");
