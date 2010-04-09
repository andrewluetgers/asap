
var updateBodyBg = function(color) {
	var body = document.getElementsByTagName("body")[0];
	body.style.background = color;
}

asap.domReady(function() {
	console.log("asap onReady fired at " + getLoadTime());
	console.log("there are " + document.links.length + " links in this document");
	updateBodyBg("red");
});

asap.codeReady(function() {
	console.log("asap - codeReady callback fired at " + getLoadTime());
	updateBodyBg("green");
});



console.log("myCode evaluated at " + getLoadTime());