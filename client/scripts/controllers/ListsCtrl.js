collaborativeMindsApp.controller("ListsCtrl", function ($scope, ListsSvc, CardsSvc, LogSvc, $routeParams) {
    $scope.sortableLists = {};
    $scope.sortableOptions = {
        placeholder: "well-ph",
        connectWith: ".connectedSortable",
        cursor: "move",
        start: function(e, ui) {
            // take a snapshot of the list BEFORE the move happens
            $scope.sortableLists.before = (JSON.parse(JSON.stringify($scope.lists)));

            // LogSvc.write("[start] card at [" + ui.item.sortable.index + "] dropped at [" + ui.item.sortable.dropindex + "] -> lists = " + 
            //     $scope.printList($scope.sortableLists.before));
        },
        stop: function(e, ui) {
            // take a snapshot of the list AFTER the move happens
            $scope.sortableLists.after = (JSON.parse(JSON.stringify($scope.lists)));

            // LogSvc.write("[stop]:[" + ui.item.sortable.index + "]->[" + ui.item.sortable.dropindex + 
            //     "] :: " + $scope.printList($scope.sortableLists.before) + " -> " + $scope.printList($scope.sortableLists.after));

            var fromList, toList, theCard;
            for(var i=0; i<$scope.sortableLists.after.length; i++) {
                var beforeList = $scope.sortableLists.before[i].list;
                var afterList = $scope.sortableLists.after[i].list;
                var fromCardIndex = ui.item.sortable.index;
                var toCardIndex = ui.item.sortable.dropindex;

                // if the afterList has less cards than the beforeList, we found the fromList
                if(afterList.cards.length < beforeList.cards.length) {
                    fromList = (JSON.parse(JSON.stringify(afterList)));
                }
                // if the afterList has more cards than the beforeList, we found the toList
                if(beforeList.cards.length < afterList.cards.length) {
                    toList = (JSON.parse(JSON.stringify(afterList)));
                    theCard = (JSON.parse(JSON.stringify(afterList.cards[toCardIndex].card)));
                }
            } 
            LogSvc.write("Moved card [" + theCard.id + "] from list [" + fromList.id + "] to list [" + toList.id + "]");           
        },
    };

    $scope.printList = function(listObject) {
        return (listObject.map(function (l) { 
            return l.list.id + "[" + l.list.cards.map(function (c) { return c.card.id }).join(',') + "]"
        }).join(','));
    }

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
            loadCards($scope.currentProjectId);
        });
    };

    $scope.archiveCard = function (currentCard) {
        LogSvc.write("archiveCard [" + currentCard.card.id + "]");
        CardsSvc.archiveCard(currentCard, function() {
            loadCards($scope.currentProjectId);
        });
    };

    function loadCards(projectId) {
        $scope.lists = ListsSvc.getProjectLists({projectId: projectId}, function(data) {
            for (var i = 0; i < data.length; i++) {
                data[i].list.cards = CardsSvc.getListCards({listId:data[i].list.id})
            }		
        });
    }
});
