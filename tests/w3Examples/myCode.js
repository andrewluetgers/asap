var updateBodyBg = function(color) {
	var body = document.getElementsByTagName("body")[0];
	body.style.background = color;
}

var logStats = function() {
	//console.log("ajax stats");
	//console.log(perfLog);
	if(perfLog.onLoad) {
		putStatsLog();
	} else {
		$(window).load(function() {
			putStatsLog();
		});
	}
};

var putStatsLog = function() {
	$.ajax({
		url: "http://couchdb.andrewluetgers.com/asap_log/asap"+perfLog.startTime,
		type: "put",
		data: JSON.stringify(perfLog),
		success: function(data) {
			console.log("success");
			console.log(data);
		},
		error: function(xhr, status, error) {
			console.log("ERROR: "+status + ", " + error);
		}
	});		
};

if(asap) {
	asap.domReady(function() {
		perfLog.domReady = getLoadTime();
		console.log("--> asap onReady fired at " + getLoadTime());
		console.log("there are " + document.links.length + " links in this document");
		updateBodyBg("red");
	}).codeReady(function() {
		perfLog.codeReady = getLoadTime();
		console.log("--> asap - codeReady callback fired at " + getLoadTime());
		updateBodyBg("green");
		//logStats();
	});
} else if(jquery) {
	$(document).ready(function() {
		perfLog.codeReady = perfLog.domReady = getLoadTime();
		console.log("--> jQuery - ready callback fired at " + getLoadTime());
		$("body").css("background", "green");
		logStats();
	});
}


