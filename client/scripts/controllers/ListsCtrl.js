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

            var moveCardSettings = {};
            moveCardSettings.moveToHead = false;
            for(var i=0; i<$scope.sortableLists.after.length; i++) {
                var beforeList = $scope.sortableLists.before[i].list;
                var afterList = $scope.sortableLists.after[i].list;
                var toCardIndex = ui.item.sortable.dropindex;

                // if the afterList has less cards than the beforeList, we found the fromList
                if(afterList.cards.length < beforeList.cards.length) {
                    moveCardSettings.fromList = (JSON.parse(JSON.stringify(afterList)));
                }
                // if the afterList has more cards than the beforeList, we found the toList
                if(beforeList.cards.length < afterList.cards.length) {
                    moveCardSettings.toList = (JSON.parse(JSON.stringify(afterList)));
                    moveCardSettings.theCard = (JSON.parse(JSON.stringify(afterList.cards[toCardIndex].card)));
                    if(toCardIndex > 0) {
                        moveCardSettings.prevCard = (JSON.parse(JSON.stringify(afterList.cards[toCardIndex-1].card)));
                    }
                    else {
                        moveCardSettings.moveToHead = true;
                    }
                }
            } 
            if(!moveCardSettings.moveToHead) {
                LogSvc.write("Move card [" + moveCardSettings.theCard.id + 
                    "] from list [" + moveCardSettings.fromList.id + 
                    "] to list [" + moveCardSettings.toList.id + 
                    "] after card [" + moveCardSettings.prevCard.id + "]");           
            }
            else {
                LogSvc.write("Move card [" + moveCardSettings.theCard.id + 
                    "] from list [" + moveCardSettings.fromList.id + 
                    "] to list [" + moveCardSettings.toList.id + "] at the head");           
            }
            CardsSvc.moveCard(moveCardSettings, function() {
                $scope.socket.emit("movedCardMessage", { projectId: $scope.currentProjectId });
                loadCards($scope.currentProjectId);
            });
        },
    };

    $scope.socket = io.connect("http://localhost:3000");
    $scope.socket.on("welcome", function (data) {
        LogSvc.write(data.message);
    });
    $scope.socket.on("reloadProject", function (data) {
        if($scope.currentProjectId == data.projectId) {
            LogSvc.write("Received reloadProject message for projectId [" + data.projectId + "]");
            loadCards($scope.currentProjectId);
        }
    });

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
            $scope.socket.emit("newCardMessage", { projectId: $scope.currentProjectId });
            loadCards($scope.currentProjectId);
        });
    };

    $scope.archiveCard = function (currentCard) {
        LogSvc.write("archiveCard [" + currentCard.card.id + "]");
        CardsSvc.archiveCard(currentCard, function() {
            $scope.socket.emit("archivedCardMessage", { projectId: $scope.currentProjectId });
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
