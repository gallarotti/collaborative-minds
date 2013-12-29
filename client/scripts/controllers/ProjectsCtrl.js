collaborativeMindsApp.controller("ProjectsCtrl", function ($scope, ProjectsSvc, ListsSvc, LogSvc, $routeParams) {    
    if($routeParams.id) {
    	// we have a project ID, let's load that project with its lists
		$scope.currentProjectId = $routeParams.id;
		$scope.currentProject = ProjectsSvc.get({projectId: $scope.currentProjectId});
    }
    else {
    	// we don't have a project ID, let's load them all...
	    $scope.projects = ProjectsSvc.query();
    }
});
