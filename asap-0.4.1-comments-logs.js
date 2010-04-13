/* asap script loading library
 * MIT License: http://en.wikipedia.org/wiki/MIT_License
 * version:	0.4.1 - 4/10/2010
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
	
	DOMContentLoaded = null, // the ready event handler
	
	bindReady = function() {
		if ( API.readyBound ) {
			return;
		}

		API.readyBound = true;

		// Catch cases where asap.ready() is called after the
		// browser event has already occurred.
		if (document.readyState === "complete") {
			return ready();
		}

		// Mozilla, Opera and webkit nightlies currently support this event
		if (document.addEventListener) {
			
			// define the callback
			DOMContentLoaded = function() {
				document.removeEventListener("DOMContentLoaded", DOMContentLoaded, false); // cleanup
				API.ready();
			};
			
			// Use the handy event callback
			document.addEventListener("DOMContentLoaded", DOMContentLoaded, false);
			
			// A fallback to window.onload, that will always work
			window.addEventListener("load", API.ready, false);

		// If IE event model is used
		} else if ( document.attachEvent ) {
			
			// define the callback
			DOMContentLoaded = function() {
				// Make sure body exists, at least, in case IE gets a little overzealous (ticket #5443).
				if (document.readyState === "complete") {
					document.detachEvent("onreadystatechange", DOMContentLoaded); // cleanup
					API.ready();
				}
			};
			
			// ensure firing before onload,
			// maybe late but safe also for iframes
			document.attachEvent("onreadystatechange", DOMContentLoaded);
			
			// A fallback to window.onload, that will always work
			window.attachEvent( "onload", API.ready );
		}
		
		// If not a frame
		// continually check to see if the document is ready
		var toplevel = false;

		try {
			toplevel = window.frameElement === null;
		} catch(e) {}

		if ( (window.scrollTo || document.documentElement.doScroll) && toplevel ) {
			API.doScrollCheck();
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
		
		getVersion: function() { // this will never be used why even have it?
			return version;
		},
		
		// The DOM ready check for Internet Explorer
		doScrollCheck: function() {
			console.log("scrollcheck");
			if ( API.isReady ) {
				return;
			}
		
			try {
				// If IE is used, use the trick by Diego Perini
				// http://javascript.nwbox.com/IEContentLoaded/
				if(window.scrollTo) {
					window.scrollTo(0,0);
				} else if(document.documentElement) {
					 document.documentElement.doScroll("left");
				}
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
			if ( !API.isReady) {
				// Make sure body exists, at least, in case IE gets a little overzealous (ticket #5443).
				if ( !document.body ) {
					return setTimeout( API.ready, 13 );
				}
	
				// Remember that the DOM is ready
				API.isReady = true;

				// Execute all of them
				console.log("dom ready at " + getLoadTime());
				var fn;
				while (fn = API.readyList.shift()) {
					fn();
				}
				
				console.log("isCodeReady: "+this.isCodeReady);
				
				if (this.codeReadyList.length) {
					this.codeReady();
				}
			}
		},
		
		domReady: function(fn) {
			console.log("domReady----");
			// Attach the listeners
			bindReady();
			
			// Add the function to the wait list or call it if ready
			if (fn) {
				if(this.isReady) {
					fn();
					if (this.codeReadyList.length) {
						this.codeReady();
					}
				} else {
					this.readyList.push(fn);
				}
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
			
			if(this.require.reqQue.length === 0) {
				
				// if nothing in the que and dom is ready fire any codeReady callbacks
				if(!this.isReady && !this.codeReadyQued) {
					console.log("dom and/or code not ready at: "+ getLoadTime());
					this.codeReadyQued = true;
					this.domReady(function() {
						console.log("dom ready calling code ready");
						API.codeReady();
					});
					
				} else {
					
					if(this.readyList.length) {
						API.domReady(); // make sure all domReady code runs before codeReady
					}
					
					console.log("code is ready at: "+ getLoadTime());
					
					// Remember that the DOM is ready and code was loaded
					this.isCodeReady = true;
		
					// If there are functions bound, to execute
					if (this.codeReadyList.length) {
						// Execute all of them
						var cb;
						while (cb = this.codeReadyList.shift()) {
							cb();
						}
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
	 
	var getXhr, get;

	
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

	var reqQue = [],
		reqStatus = {},
		rurl = /[a-z0-9\-\.]+\.[a-z]{2,3}$/i,
		rprotocol = /^http:/i,
		rprotocols = /^http:|file:/i,
		rcssFile = /.css$/,
		domain = rurl.exec(window.location.host),
		root = "",
		head = document.getElementsByTagName("head")[0] || document.documentElement,
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
			if( (scriptFile = reqQue[0]) && (scriptObj = reqStatus[scriptFile]) ) {
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

			if(reqQue[0] == scriptFile && (scriptObj = reqStatus[scriptFile]) && (scriptObj.status == "parsing" || scriptObj.status == "loaded") ) {
				//scriptObj.status = "loaded";
				loadedCount++;
				
				//console.log("removing loaded: " + reqQue[0]);
				
				// remove this item from the que since its has been parsed
				reqQue.splice(0,1);
				delete reqStatus[scriptFile];
				//scriptObj.response = "already evaled";
				
				 // start parsing the next item in the que
				if(reqQue.length) {
					//console.log("parse next: " + reqQue[0]);
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
			if(scriptObj = reqStatus[scriptFile]) {
				console.log("loadScriptNow: adding script tag for " + scriptFile +" at " + getLoadTime());
				scriptObj.status = "loading";
				loadScript(scriptFile, function() {
					console.log("loadScriptNow: success at "+ getLoadTime());
					reqStatus[scriptFile].status = "loaded";
					asap.require.evalComplete(scriptFile);
				}, function() {
					throw new Error("asap.loadScript ERROR unable to load "+scriptFile);
				});
			}
		},
		
		// append a script tag to the head with a url and an onload callback
		loadScript = function(url, onSuccess, onEerror) {
			var script = document.createElement("script");
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
			console.log("meehhheeerrrr  "+getLoadTime());
			var script = document.createElement("script"),
				id = "script" + new Date().getTime(),
				suppport = false;
				
			script.type = "text/javascript";
			
			try {
				script.appendChild(document.createTextNode("window." + id + "=1;"));
			} catch(e) {}
		
			head.insertBefore(script, head.firstChild);
		
			// Make sure that the execution of code works by injecting a script tag with appendChild/createTextNode
			// (IE doesn't support this, fails, and uses .text instead)
			if (window[id]) {
				delete window[id];
				suppport = true;
			}
			head.removeChild(script);
			console.log("meehhheeerrrr  "+getLoadTime());
			return suppport;
		}()),
		
		// the jQuery globalScriptEval function
		globalScriptEval = function(scriptText) {
			// Inspired by code by Andrea Giammarchi
			// http://webreflection.blogspot.com/2007/08/global-scope-evaluation-and-dom.html
			var script = document.createElement("script");
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
		
		loadCss = function(url) {
			console.log("Loading CSS: "+url);
			var stylesheet = document.createElement('link');
			stylesheet.rel = 'stylesheet';
			stylesheet.type = 'text/css';
			stylesheet.href = url;
			head.appendChild(stylesheet);
		},
		
		require = function(required, forceAttatch) {
			var files, i, len;
			root = required.root || "";
			forceAttatch = forceAttatch || required.debug || window.location.href.match("asap=debug");
			
			if(typeof required == "object") {
				files = required.files || required;
				len = files.length || 0;
				for(i=0; i<len; i++) {
					enqueFile(files[i], forceAttatch);
				}	
			} else {
				enqueFile(required, forceAttatch);
			}
		
			for(file in reqStatus) {
				if(reqStatus.hasOwnProperty(file)) {
					processFile(file);
				 }
			}
			return this;
		},
		
		enqueFile = function(file, forceAttatch) {
			
			if(file.match(rcssFile)) {
				loadCss(file);
				return; // dont que and track css files just load them right away
			}
		
			// if no protocol on script, prepend the current root
			theFile = (rprotocols.exec(file)) ? file : root+file;

			if(!reqStatus[theFile]) {
				API.isCodeReady = false;
				
				reqStatus[theFile] = {
					status: "qued", 
					xhr: false, 
					response: false,
					forceAttatch: forceAttatch || false
				};
				
				reqQue.push(theFile);
				
				requiredCount++;
				console.log("enqued: " + theFile + " at " + getLoadTime());
			}
		},
		
		processFile = function(file) {
			var reqObj = reqStatus[file];
				
			console.log(file);
			if(!sameDomain(file) || reqObj.forceAttatch) {
				// creates a script tag with src == file
				requestedCount++;
				reqObj.forceAttatch = true;
				next(file);
			} else {
				// load script text via ajax and inject text into a new script tag
				requestedCount++;
				reqObj.xhr = asap.get({
					url: file,
					onSuccess: function(response) {
						console.log("ajax success on " + file +" at:" + getLoadTime());
						var theReqStatus = reqStatus[file];
						
						if(response) {
							theReqStatus.status = "loaded";
						}
						theReqStatus.response = response;
						theReqStatus.xhr = false;
						
						if(reqQue[0] == file) {
							next();
						}
					},
					onError: function(status) {
						var theReqStatus = reqStatus[file];
						if(typeof status == "object" && "message" in status) {
							theReqStatus.status = "ERROR";
							throw new Error("asap.get ERROR: "+status["message"] + " on " + file);
						} else if(status !== 404) {
							loadScriptNow(file);
						} else {
							theReqStatus.status = "ERROR";
							throw new Error("asap.get ERROR: loading external resource: status code: " + status +" on "+ file);
						}
					}
				});
			}
		};
		
		

	// register next with domReady
	API.domReady(next);
	
	// add require methods to the api
	API.require = require;
	API.require.evalComplete = evalComplete;
	API.require.reqQue = reqQue;
	
	///////////////  all module sections done setup and the public api ///////////////////
	
	return API;
	
}());

// fix one "little detail": Firefox < 3.6 does not support  document.readyState 
// see http://webreflection.blogspot.com/2009/11/195-chars-to-help-lazy-loading.html for Andrea Giammarchi's explaiation
(function(A,s,a,p){if(A[s]==null&&A[a]){A[s]="loading";A[a](p,a=function(){A[s]="complete";A.removeEventListener(p,a,false)},false)}})(document,"readyState","addEventListener","DOMContentLoaded");
