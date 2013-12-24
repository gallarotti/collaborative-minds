collaborativeMindsApp.service("ProjectsSvc", function($resource) {
    return $resource("http://localhost:3000/projects/:projectId", {projectId:"@id"},
        {
            query: {method: "GET", isArray:true},
	        getProjectLists: {
	            method: "GET", 
	            isArray:true, 
	            url:"http://localhost:3000/lists/:projectId", 
	            params:{projectId:"@projectId"}
	        },            
	        get: {method: "GET", isArray:true},
            update: {method: "PUT"}
        }
    );
});