asap script loading library
MIT License: 	http://en.wikipedia.org/wiki/MIT_License
version:		0.4.1 - 4/13/2010
author: 		andrew dot luetgers at gmail

Changes in version 0.4.1:
	* added css file importing support
	* refactored require function into separate functions to ensure proper order of code execution
	* been messing with the jquery domready code (may be a bad idea)
	* lazyloaded jquery plugin now chokes ie for some reason

Changes in version 0.4:
	* fixed a bug breaking script order in debug mode
	* fixed a bug causing failure of lazy-loading after initial page load
	* added document.readyState fix by Andrea Giammarchi detailed here -> http://webreflection.blogspot.com/2009/11/195-chars-to-help-lazy-loading.html
	* added some comparative performance tests showing load times for asap, LABjs, requireJS and a sans-preloader baseline.
	* added test index.html and some complex page type tests with baselines for comparison
	* added api example of lazy loading to the simple-asap.html and to the readme.txt
	

Code Interview: 

Here at readme.txt we love finding out just who it is were reporting on, in that vein we sat down with asap.js on the 1st of April 2010 to delve deep into his unique predilection for loading javascript early and fast. Lets cut right the transcript.

RM: 	So is this a joke or what, it is April 1st?
ASAP: 	No. I really am a new js loader! I know its stupid right? We already have two great loaders in LABjs and RequireJS I would not be surprised if there are a ton more.

RM: 	Interesting, both of those js loaders were profiled on the hugely popular Ajaxian.com blog. Is this just a pathetic attempt to get on Ajaxian?
ASAP: 	YES! Well actually I only learned of LABjs after I was initially written as a little helper for my creator, furthermore I was birthed into a more functional version 0.2 on March 17th one day before the Ajaxian post on RequireJS. You can imagine how deflated I was in both instances... but alas here I am :-) Don't hate me cus I'm beautiful. 

RM: 	There, there... nobody hates you asap. Tell me more about yourself. What really turns you on?
ASAP: 	Well you need to include me in your page, in the head or the bottom of the page. I like being at the bottom personally. Then I'll do all the rest of the work to load all your code and fire off the required init functions when the page and the code are ready.

RM: 	I'm looking at your source code here and it looks like you've implemented a cute little ajax get method, and your domReady event is basically the exact same thing jQuery uses?
ASAP: 	Well it may sound ironic but I didn't want to reinvent the wheel. Heh, well it is nice to use my get method to load code in an asynchronous way. I'll load it via AJAX if I can and build a script tag with it, otherwise I'll load the js in a slower synchronous manner (setting the src on a dynamic script tag) for compatibility sake. Either way I'll prevent the js from blocking other page resources from loading. Loading code as soon as possible while maintaining script eval order is what I do!
		One last thing, the domReady event can be used but it is recommended that users pass thier callbacks into my codeReady method, that will fire after both domReady AND all the code is eval'd. 

RM: 	Isnt it true that RequireJS can actually load code faster than you?
ASAP: 	Yes they have a good system but it I think you're thinking of the feature that requires you to package your code ahead of time so that it doesn't eval out of order, usually that code will be on your own server and in that case you can just use AJAX to load it anyway. So in that case I don't think its any faster.

RM: 	I see you weigh in at a measly 5k when minified.
ASAP: 	Roughly, yes I'm a few bytes larger than LABjs and a few k smaller than RequireJS, but when I talk k's I'm only talking AFAIK k's. OK?

RM: 	Cool, whats next? Give us a taste of the real asap at work.
ASAP: 	OK here's a couple code samples :-)
		
		//simple array notation syntax...
		
		asap.require([
			"js/libs/jquery-1.4.2.min.js",
			"js/simple.js"
		]).codeReady(function(){
			simple.init();
		});
		
		
		// object notation providing a local root
		
		asap.require({
			root: "http://www.mysite.com/",
			files: [
				"http://ajax.googleapis.com/ajax/libs/jquery/1.4.2/jquery.min.js",
				"js/simple.js"
			]
		}).codeReady(function(){
			simple.init();
		});
		
		
		// lazy load js after page load (a string can be passed instead of an array if only one file is required)
		
		asap.require("myFile").codeReady(function() {
			...run code that requires "myFile"....
		});
		


RM:		Aren't there problems with debugging code when its loaded with ajax, no line numbers?
ASAP:	Good point, that's why there are three ways you can force asap to use the slower dynamic script attachment method when you want to debug and get nice line numbers in your debug console.
		
			The first two require you to edit the file, you can:
				* pass a true boolian into the require call as the second parameter using any syntax or,
				* you can add a debug property with a value of true in the object notation form
				
			but my favorite way to jump into debug mode:
				* add the param asap=debug to your url
				

RM: 	Looks good asap! Now if only Dion and Ben would would give you the time of day you might be forced to create some serious tests.
ASAP: 	Its true I need some more robust tests to verify my code correctness and functionality across all platforms.... there is a reason I'm version 0.4


Aaaaand that wraps it up for this edition of readme.txt check back again when we review yet another random piece of code.
