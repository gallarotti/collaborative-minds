collaborativeMindsApp.controller("ListsCtrl", function ($scope, ListsSvc, CardsSvc, LogSvc, $routeParams) {
	if($routeParams.id) {
    	// we have a project ID, let's load that project with its lists
		this.currentProjectId = $routeParams.id;
		this.lists = ListsSvc.getProjectLists({projectId: this.currentProjectId}, function(data) {
			for (var i = 0; i < data.length; i++) {
				data[i].list.cards = CardsSvc.getListCards({listId:data[i].list.id})
			}		
		});
    }

    this.addCard = function (currentList) {
    	LogSvc.write("addCard to list [" + currentList.list.id + "]: [" + currentList.newCardTitle + "]");
    	var newCard = {
	        title: currentList.newCardTitle,
	        listId: currentList.list.id
	    };
		CardsSvc.save(newCard, function() {
			currentList.cards = CardsSvc.getListCards({listId:currentList.list.id});	
		});
    };
});
