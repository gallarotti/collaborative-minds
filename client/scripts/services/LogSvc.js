collaborativeMindsApp.service("LogSvc", function() {
	var logger = {};
	logger.message = "";

	logger.write = function(m) {
		logger.message = m;  
	};

	logger.append = function(m) {
		logger.message += m;  
	};

  	return logger;
});