collaborativeMindsApp.controller("ListsCtrl", function (ListsSvc, CardsSvc, $routeParams) {
    if($routeParams.id) {
    	// we have a project ID, let's load that project with its lists
		this.currentProjectId = $routeParams.id;
		this.lists = ListsSvc.getProjectLists({projectId: this.currentProjectId}, function(data) {
			console.log("got data: " + data);
		});
    }
});
