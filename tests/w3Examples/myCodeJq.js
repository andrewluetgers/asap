$(document).ready(function() {
	console.log("jQuery - ready callback fired at " + getLoadTime());
	
	$("body").css("background", "green");
	
});

console.log("myCode evaluated at " + getLoadTime());