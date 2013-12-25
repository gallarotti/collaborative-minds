collaborativeMindsApp.controller("ListsCtrl", function (ListsSvc, CardsSvc, LogSvc, $modal, $routeParams) {
    if($routeParams.id) {
    	// we have a project ID, let's load that project with its lists
		this.currentProjectId = $routeParams.id;
		this.lists = ListsSvc.getProjectLists({projectId: this.currentProjectId}, function(data) {
			for (var i = 0; i < data.length; i++) {
				data[i].list.cards = CardsSvc.getListCards({listId:data[i].list.id})
			}		
		},
		function() {

		});
    }

    this.addCard = function (listId) {
    	LogSvc.write("addCard to list [" + listId + "]");
        var modalInstance = $modal.open({
            templateUrl: 'views/modal/editCard.html'
        });

        modalInstance.result.then(function (editedCard) {
            // editedCard.$save(function() {
            //     //loadCards($scope.currentProject._id);
            // });
        }, function () {
            //console.log('Modal dismissed at: ' + new Date());
        });
    };
});
