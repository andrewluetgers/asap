/* asap script loading library
 * MIT License: http://en.wikipedia.org/wiki/MIT_License
 * version:	0.4 - 4/10/2010
 * author: andrew dot luetgers at gmail
 */ 

// this is use for debug purposes, not included in the minified version 
if(!_now) {
	var _now = function() {return new Date().getTime();};
	var _startTime = _now();
	var getLoadTime = function() {return _now() - _startTime;};
}
 
asap = (function() {

	///////////////// implement the jQuery ready event///////////////////////////
	
	bindReady = function() {
		if ( API.readyBound ) {
			return;
		}

		API.readyBound = true;

		// Catch cases where asap.ready() is called after the
		// browser event has already occurred.
		if ( document.readyState === "complete" ) {
			return ready();
		}

		// Mozilla, Opera and webkit nightlies currently support this event
		if ( document.addEventListener ) {
			// Use the handy event callback
			document.addEventListener( "DOMContentLoaded", DOMContentLoaded, false );
			
			// A fallback to window.onload, that will always work
			window.addEventListener( "load", API.ready, false );

		// If IE event model is used
		} else if ( document.attachEvent ) {
			// ensure firing before onload,
			// maybe late but safe also for iframes
			document.attachEvent("onreadystatechange", DOMContentLoaded);
			
			// A fallback to window.onload, that will always work
			window.attachEvent( "onload", API.ready );

			// If IE and not a frame
			// continually check to see if the document is ready
			var toplevel = false;

			try {
				toplevel = window.frameElement === null;
			} catch(e) {}

			if ( document.documentElement.doScroll && toplevel ) {
				API.doScrollCheck();
			}
		}
	},
	
	// this is the return object
	API = {
		// Is the DOM ready to be used? Set to true once it occurs.
		isReady: false,
		
		// Has the ready events already been bound?
		readyBound: false,
		
		// The functions to execute on DOM ready
		readyList: [],
	
		// The ready event handler
		DOMContentLoaded: false,
		
		getVersion: function() { // this will never be used why even have it?
			return version;
		},
		
		// The DOM ready check for Internet Explorer
		doScrollCheck: function() {
			if ( API.isReady ) {
				return;
			}
		
			try {
				// If IE is used, use the trick by Diego Perini
				// http://javascript.nwbox.com/IEContentLoaded/
				document.documentElement.doScroll("left");
			} catch( error ) {
				setTimeout(API.doScrollCheck, 1 );
				return;
			}
		
			// and execute any waiting functions
			API.ready();
		},
		
		// Handle when the DOM is ready
		ready: function() {
			// Make sure that the DOM is not already loaded
			if ( !API.isReady ) {
				// Make sure body exists, at least, in case IE gets a little overzealous (ticket #5443).
				if ( !document.body ) {
					return setTimeout( API.ready, 13 );
				}
	
				// Remember that the DOM is ready
				API.isReady = true;
	
				// If there are functions bound, to execute
				if ( API.readyList ) {
					// Execute all of them
					var fn, i = 0;
					while ( (fn = API.readyList[ i++ ]) ) {
						fn();
					}
	
					// Reset the list of functions
					API.readyList = null;
				}
			}
		},
		
		domReady: function( fn ) {
			// Attach the listeners
			bindReady();
	
			// If the DOM is already ready
			if ( this.isReady ) {
				// Execute the function immediately
				fn();
	
			// Otherwise, remember the function for later
			} else if ( this.readyList ) {
				// Add the function to the wait list
				this.readyList.push( fn );
			}
			
			return this;
		},


		///////////////// codeReady section ///////////////////////////
		
		codeReadyList: [],
		
		isCodeReady: false,
		
		codeReadyQued: false,
		
		codeReady: function(fn) {
		
			if(typeof fn == "function") {
				this.codeReadyList.push(fn);
			}
			
			if(this.require.scriptQue.length === 0 && !this.isCodeReady) {
				
				// if nothing in the que and dom is ready fire any codeReady callbacks
				if(!this.isReady && !this.codeReadyQued) {
					console.log("dom and/or code not ready at: "+ getLoadTime());
					this.codeReadyQued = true;
					this.domReady(function() {
						API.codeReady();
					});
				} else {
					console.log("code is ready at: "+ getLoadTime());
					
					// Remember that the DOM is ready and code was loaded
					this.isCodeReady = true;
		
					// If there are functions bound, to execute
	
					if ( this.codeReadyList.length ) {
						// Execute all of them
						var cb, i = 0;
						while ( (cb = this.codeReadyList[ i++ ]) ) {
							cb();
						}
		
						// Reset the list of functions
						this.codeReadyList = [];
					}	
				}
			}
			
			return this;
		}
		
	}; // end initial var defs and public api definition
	

	
	/////////////////  ajax get  ////////////////////////

	/* get
	 * an overly simple ajax get method
	 * @param options Object defined below
	 *		options.url String = the complete url with get parameters (required)
	 * 		options.success Function = the success callback (required)
	 * 		options.error Function = the error callback (required)
	 */
	 
	var DOMContentLoaded, getXhr, get;

	// Cleanup functions for the document ready method
	if ( document.addEventListener ) {
		DOMContentLoaded = function() {
			document.removeEventListener( "DOMContentLoaded", DOMContentLoaded, false );
			API.ready();
		};
	} else if ( document.attachEvent ) {
		DOMContentLoaded = function() {
			// Make sure body exists, at least, in case IE gets a little overzealous (ticket #5443).
			if ( document.readyState === "complete" ) {
				document.detachEvent( "onreadystatechange", DOMContentLoaded );
				API.ready();
			}
		};
	}
	
	// uses jQuery xhr logic
	if(window.XMLHttpRequest && (window.location.protocol !== "file:" || !window.ActiveXObject)) {
		getXhr = function() {
			return new window.XMLHttpRequest();
		};
	} else {
		getXhr = function() {
			try {
				return new window.ActiveXObject("Microsoft.XMLHTTP");
			} catch(e) {}
		};
	}
	
	// the public get api function
	API.get = function(options) {
		var xhr = getXhr(),
			url = options.url || false,
			onSuccess = options.onSuccess || false,
			onError = options.onError || false;
		
		if(!xhr||!url||!onSuccess||!onError) {
			//console.log("ERROR: asap.get - missing params and/or no xhr to work with!");
			//console.log(xhr);
			//console.log(url);
			//console.log(success);
			//console.log(error);
			return;
		}
			
		xhr.open("GET", url, true);
		
		xhr.onreadystatechange = function () {
			if (xhr.readyState == 4) {
				if( (window.location.protocol == "file:" || xhr.status == 200) && (xhr.responseText && onSuccess) ) {
					onSuccess(xhr.responseText);
				} else if(onError) {
					onError(xhr.status);
				}
			}
		};
		
		try{
			xhr.send("");
		} catch (e) {
			console.log("ERROR attempting connection:" +e);
			if(onError) {
				console.log("AJAX threw an error");
				onError(e);
			}
		}
		return xhr;
	};


	/////////////////  require  ////////////////////////

	var scriptQue = [],
		scriptStatus = {},
		rurl = /[a-z0-9\-\.]+\.[a-z]{2,3}$/i,
		rprotocol = /^http:/i,
		rprotocols = /^http:|file:/i,
		domain = rurl.exec(window.location.host),
		localScriptRoot = "",
		requiredCount = 0,
		loadedCount = 0,
		requestedCount = 0,
		
		// does the domain of the given url match that of the window.location?
		sameDomain = function(url) {
			var urlProtocol = rprotocol.exec(url);
			var protocol = window.location.protocol;
			//console.log("is this the sameDomain...  url protocol = " + urlProtocol + " window.location.protocol = " + protocol);
			
			if(urlProtocol === null) {
				return true;
			}
			
			if(protocol == "file:") {
				return false;
			}

			if(urlProtocol[0] == protocol ) {
				if(url.match(domain)) {
					return true;
				}
			}
			return false;
		},
		
		// try to laod a given file from the que, if its next and loaded via xhr already it it will get parsed or the script tag will get generated
		next = function(requestedScriptFile) {
			var scriptFile, scriptObj;
			//console.log("next...");
			// intentionally doing assignment here!
			if( (scriptFile = scriptQue[0]) && (scriptObj = scriptStatus[scriptFile]) ) {
				// has the script been loaded via xhr but not parsed?
				if(scriptObj.status == "loaded") {
					//console.log("parse inject");
					scriptObj.status = "parsing";
					//append the parse complete call to the loaded script code and eval it
					globalScriptEval(scriptObj.response + " ; (asap.require.evalComplete('"+scriptFile+"'));");
					
				// this is here for debug support... ie true for second param in asap.require(), debug:true in object notions or asap=debug url param
				} else if(scriptObj.forceAttatch && scriptObj.status != "loading") {
					scriptObj.status = "loading";
					loadScriptNow(scriptFile);
				}
			}
		},
		
		// update the que and start loading the next thing
		evalComplete = function(scriptFile) {
			console.log("evalComplete "+scriptFile + " at " + getLoadTime());
			var scriptObj;

			if(scriptQue[0] == scriptFile && (scriptObj = scriptStatus[scriptFile]) && (scriptObj.status == "parsing" || scriptObj.status == "loaded") ) {
				scriptObj.status = "loaded";
				loadedCount++;
				
				//console.log("removing loaded: " + scriptQue[0]);
				
				// remove this item from the que since its has been parsed
				
				scriptQue.splice(0,1);
				scriptObj.response = "already evaled";
				
				 // start parsing the next item in the que
				if(scriptQue.length) {
					//console.log("parse next: " + scriptQue[0]);
					next();
				// que is empty no other files to load call codeReady
				} else if(loadedCount == requiredCount) {
					//console.log("call codeReady");
					API.codeReady();
				}
			} else {
				//console.log("evalComplete misfire at " + getLoadTime());
			}
		},
		
		// load a script tag with the given url, a callback is added to help keep things going in the right order
		loadScriptNow = function(scriptFile) {
			var scriptObj;
			if(scriptObj = scriptStatus[scriptFile]) {
				console.log("loadScriptNow: adding script tag for " + scriptFile +" at " + getLoadTime());
				scriptObj.status = "loading";
				loadScript(scriptFile, function() {
					console.log("loadScriptNow: success at "+ getLoadTime());
					scriptStatus[scriptFile].status = "loaded";
					asap.require.evalComplete(scriptFile);
				}, function() {
					throw new Error("asap.loadScript ERROR unable to load "+scriptFile);
				});
			}
		},
		
		// append a script tag to the head with a url and an onload callback
		loadScript = function(url, onSuccess, onEerror) {
			var head = document.getElementsByTagName("head")[0] || document.documentElement,
				script = document.createElement("script");
				
			script.type = "text/javascript";
			script.charset = "utf-8";
			
			if (script.readyState){  //IE
				script.onreadystatechange = function(){
					if (script.readyState == "loaded" || script.readyState == "complete") {
						script.onreadystatechange = null;
						onSuccess();
					}
				};
			} else {  //Others
				script.onload = function(){
					onSuccess();
				};
			}
			
			script.onerror = function() {
				onEerror();
			}
			
			script.src = url;
			head.appendChild(script);
		},
		
		// the jQuery scriptEval code 
		// determines if can we execute code by injecting a script tag with appendChild/createTextNode
		scriptEval = (function() {
			var root = document.getElementsByTagName("head")[0] || document.documentElement,
				script = document.createElement("script"),
				id = "script" + new Date().getTime(),
				suppport = false;
				
			script.type = "text/javascript";
			
			try {
				script.appendChild( document.createTextNode( "window." + id + "=1;" ) );
			} catch(e) {}
		
			root.insertBefore( script, root.firstChild );
		
			// Make sure that the execution of code works by injecting a script tag with appendChild/createTextNode
			// (IE doesn't support this, fails, and uses .text instead)
			if ( window[ id ] ) {
				delete window[ id ];
				suppport = true;
			}
			root.removeChild( script );
			return suppport;
		}()),
		
		// the jQuery globalScriptEval function
		globalScriptEval = function(scriptText) {
			// Inspired by code by Andrea Giammarchi
			// http://webreflection.blogspot.com/2007/08/global-scope-evaluation-and-dom.html
			var head = document.getElementsByTagName("head")[0] || document.documentElement,
				script = document.createElement("script");
				
			script.type = "text/javascript";
			
			if (scriptEval) {
				script.appendChild(document.createTextNode(scriptText));
			} else {
				script.text = scriptText;
			}

			// Use insertBefore instead of appendChild to circumvent an IE6 bug.
			// This arises when a base node is used (#2709).
			head.insertBefore(script, head.firstChild);
			head.removeChild(script);
		},
		
		addStylesheet = function(url) {
			var head = document.getElementsByTagName("head")[0] || document.documentElement,
				stylesheet = document.createElement('link');
				
			stylesheet.rel = 'stylesheet';
			stylesheet.type = 'text/css';
			stylesheet.href = url;
			head.appendChild(stylesheet);
		},
		
		// given a string of ", " separated urls or an object containing a (relative and absolute) load them all as soon as possible while maintaining execution order.
		require = function(required, forceAttatch) {
		
			var files, len, scriptFile, scriptObj;
			forceAttatch = forceAttatch || required.debug || window.location.href.match("asap=debug");
			
			// this function is overlaoded to handle multiple script requires via an array and individual script requires via string
			if(typeof required == "object") {
				files = required.files || required;
				len = files.length || 0;
				scriptFile = "";
				
				// if localScriptRoot is not provided relative urls will be scoped to the page
				// urls using ../ in their path will not work with a scriptRoot
				localScriptRoot = required.root || localScriptRoot;
				
				for(var i=0; i<len; i++) {
					asap.require(files[i], forceAttatch);
				}
				
				return this;
			}
	
			if(rprotocols.exec(required)) {
				// already has a protocol
				scriptFile = required;
			} else {
				// no protocol add the localScriptRoot
				scriptFile = localScriptRoot+required;
			}
			
			requiredCount++;
			
			// if the file has not already been requested add it the the que and fire off a request for it
			if(!scriptStatus[scriptFile]) {
				
				
				scriptQue.push(scriptFile);
				API.isCodeReady = false;
				console.log("enqued: " + scriptFile + " at " + getLoadTime());
				
				scriptObj = scriptStatus[scriptFile] = {
					status: "qued",
					xhr: false,
					response: false
				};
				
				requestedCount++;
				
				// avoid xhr injection when loading scripts from a different domain
				if(!sameDomain(scriptFile) || forceAttatch) {
					scriptObj.forceAttatch = true;
					next(scriptFile);
					return this;
				}
				
				scriptObj.xhr = asap.get({
					url: scriptFile,
					onSuccess: function(response) {
						console.log("ajax success on " + scriptFile +" at:" + getLoadTime());
						var theScriptStatus = scriptStatus[scriptFile];
						
						if(response) {
							theScriptStatus.status = "loaded";
						}
						theScriptStatus.response = response;
						theScriptStatus.xhr = false;
						
						if(scriptQue[0] == scriptFile) {
							next();
						}
					},
					onError: function(status) {
						var theScriptStatus = scriptStatus[scriptFile];
						if(typeof status == "object" && "message" in status) {
							theScriptStatus.status = "ERROR";
							throw new Error("asap.get ERROR: "+status["message"] + " on " + scriptFile);
						} else if(status !== 404) {
							loadScriptNow(scriptFile);
						} else {
							theScriptStatus.status = "ERROR";
							throw new Error("asap.get ERROR: loading external resource: status code: " + status +" on "+ scriptFile);
						}
					}
				});
				
	
			} else { 		
				throw new Error("ERROR asap.loadScript requires a string!");
			}
			
			return this;
		};

	// register next with domReady
	API.domReady(next);
	
	// add require methods to the api
	API.require = require;
	API.require.evalComplete = evalComplete;
	API.require.scriptQue = scriptQue;
	
	///////////////  all module sections done setup and the public api ///////////////////
	
	return API;
	
}());

// fix one "little detail": Firefox < 3.6 does not support  document.readyState 
// see http://webreflection.blogspot.com/2009/11/195-chars-to-help-lazy-loading.html for Andrea Giammarchi's explaiation
(function(A,s,a,p){if(A[s]==null&&A[a]){A[s]="loading";A[a](p,a=function(){A[s]="complete";A.removeEventListener(p,a,false)},false)}})(document,"readyState","addEventListener","DOMContentLoaded");
