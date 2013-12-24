collaborativeMindsApp.service("ListsSvc", function($resource) {
    return $resource("http://localhost:3000/lists/:projectId", {projectId:"@projectId"},
        {
            query: {method: "GET", isArray:true},
            get: {method: "GET", isArray:true},
            getProjectLists: {
	            method: "GET", 
	            isArray:true, 
	            url:"http://localhost:3000/lists/:projectId", 
	            params:{projectId:"@projectId"}
	        }, 
            update: {method: "PUT"}
        }
    );
});