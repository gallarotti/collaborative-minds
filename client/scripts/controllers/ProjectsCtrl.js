collaborativeMindsApp.controller("ProjectsCtrl", function (ProjectsSvc, ListsSvc, $routeParams) {    
    if($routeParams.id) {
    	// we have a project ID, let's load that project with its lists
		this.currentProjectId = $routeParams.id;
		this.currentProject = ProjectsSvc.get({projectId: this.currentProjectId}, function() {
			console.log("loaded project {id:" + this.currentProjectId + "}... ");
        });
    }
    else {
    	// we don't have a project ID, let's load them all...
	    this.projects = ProjectsSvc.query();
    }
});
