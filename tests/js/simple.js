var simple = {
	
	init: function() {
		var that =  this;
		console.log("_________ simple.js init called at "+getLoadTime());
		

	}
};

$(document).ready(function() {
	assert("jQuery.ready");
	$("body").prepend("<p>all js loaded!</p>");
});

console.log("_________ simple.js loaded at "+getLoadTime());
