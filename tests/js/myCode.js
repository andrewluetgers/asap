var updateBodyBg = function(color) {
	var body = document.getElementsByTagName("body")[0];
	body.style.background = color;
}

if(window.asap) {
	asap.domReady(function() {
		console.log("--> asap onReady fired at " + getLoadTime());
		console.log("there are " + document.links.length + " links in this document");
		updateBodyBg("red");
	}).codeReady(function() {
		console.log("--> asap - codeReady callback fired at " + getLoadTime());
		updateBodyBg("green");
		//throw "This is an intentional error to test debugability!";
	});
} 

if(jQuery) {
	$(document).ready(function() {
		console.log("--> jQuery - ready callback fired at " + getLoadTime());
		$("body").css("background", "green");
		//throw "This is an intentional error to test debugability!";
	});
	
}


