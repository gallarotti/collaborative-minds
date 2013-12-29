collaborativeMindsApp.controller("ListsCtrl", function ($scope, ListsSvc, CardsSvc, LogSvc, $routeParams) {
	if($routeParams.id) {
    	// we have a project ID, let's load that project with its lists
		$scope.currentProjectId = $routeParams.id;
		loadCards($scope.currentProjectId);
    }

    $scope.addCard = function (currentList) {
    	LogSvc.write("addCard to list [" + currentList.list.id + "]: [" + currentList.newCardTitle + "]");
    	var newCard = {
	        title: currentList.newCardTitle,
	        listId: currentList.list.id
	    };
		CardsSvc.create(newCard, function() {
			currentList.cards = CardsSvc.getListCards({listId:currentList.list.id}, function() {
				loadCards($scope.currentProjectId);
			});	
		});
    };

    $scope.archiveCard = function (currentCard) {
    	LogSvc.write("archiveCard [" + currentCard.card.id + "]");
    	CardsSvc.archiveCard(currentCard);
    };

    function loadCards(projectId) {
    	$scope.lists = ListsSvc.getProjectLists({projectId: projectId}, function(data) {
			for (var i = 0; i < data.length; i++) {
				data[i].list.cards = CardsSvc.getListCards({listId:data[i].list.id})
			}		
		});
    }
});
