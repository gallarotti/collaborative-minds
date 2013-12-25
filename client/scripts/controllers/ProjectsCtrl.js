collaborativeMindsApp.controller("ProjectsCtrl", function (ProjectsSvc, ListsSvc, LogSvc, $routeParams) {    
    if($routeParams.id) {
    	// we have a project ID, let's load that project with its lists
		this.currentProjectId = $routeParams.id;
		this.currentProject = ProjectsSvc.get({projectId: this.currentProjectId});
    }
    else {
    	// we don't have a project ID, let's load them all...
	    this.projects = ProjectsSvc.query();
    }
});
