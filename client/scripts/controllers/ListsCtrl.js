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
            moveCardSettings.toCardIndex = ui.item.sortable.dropindex;
            moveCardSettings.moveToHead = false;
            moveCardSettings.moveToTail = false;
            for(var i=0; i<$scope.sortableLists.after.length; i++) {
                var beforeList = $scope.sortableLists.before[i].list;
                var afterList = $scope.sortableLists.after[i].list;
                moveCardSettings.toCardIndex = ui.item.sortable.dropindex;

                // if the afterList has less cards than the beforeList, we found the fromList
                if(afterList.cards.length < beforeList.cards.length) {
                    moveCardSettings.fromList = (JSON.parse(JSON.stringify(afterList)));
                }
                // if the afterList has more cards than the beforeList, we found the toList
                if(beforeList.cards.length < afterList.cards.length) {
                    moveCardSettings.toList = (JSON.parse(JSON.stringify(afterList)));
                    moveCardSettings.theCard = (JSON.parse(JSON.stringify(afterList.cards[moveCardSettings.toCardIndex].card)));
                    if(moveCardSettings.toCardIndex == afterList.cards.length-1) {
                        moveCardSettings.moveToTail = true;
                    }                    
                    if(moveCardSettings.toCardIndex > 0) {
                        moveCardSettings.prevCard = (JSON.parse(JSON.stringify(afterList.cards[moveCardSettings.toCardIndex-1].card)));
                    }
                    else {
                        moveCardSettings.moveToHead = true;
                    }
                }
            } 
            if(!moveCardSettings.moveToHead) {
                LogSvc.write("Move card [" + moveCardSettings.theCard.id + 
                    "] from " + moveCardSettings.fromList.id + 
                    "] to " + moveCardSettings.toList.id + 
                    "] at pos [" + moveCardSettings.toCardIndex + 
                    "] after [" + moveCardSettings.prevCard.id +
                    "] at tail: [" + moveCardSettings.moveToTail + "]");  
            }
            else {
                LogSvc.write("Move card [" + moveCardSettings.theCard.id + 
                    "] from [" + moveCardSettings.fromList.id + 
                    "] to [" + moveCardSettings.toList.id + 
                    "] at pos [" + moveCardSettings.toCardIndex + 
                    "] at the head");           
            }
            CardsSvc.moveCard(moveCardSettings, function() {
                $scope.socket.emit("movedCardMessage", { 
                    projectId: $scope.currentProjectId,
                    moveCardSettings: moveCardSettings   
                });
            });
        },
    };

    $scope.socket = io.connect("http://localhost:3000");
    $scope.socket.on("welcome", function (data) {
        LogSvc.write(data.message);
    });
    $scope.socket.on("appendCardMessage", function (data) {
        if($scope.currentProjectId == data.projectId) {
            LogSvc.write("Received appendCardMessage message [" + data.projectId + "] [" + data.listId + "] [" + data.newCard.card.id + "]");
            // find the correct list and add
            for(var listIndex = 0; listIndex < $scope.lists.length; listIndex++) {
                if($scope.lists[listIndex].list.id == data.listId) {
                    $scope.lists[listIndex].list.cards.push(data.newCard);
                    $scope.$apply();
                }
            }
        }
    });
    $scope.socket.on("insertCardMessage", function (data) {
        if($scope.currentProjectId == data.projectId) {
            LogSvc.write("Received insertCardMessage message [" + data.projectId + "] [" + data.listId + 
                "] [" + data.newCard.card.id + "] at [" + data.position + "]");
            // find the correct list and add
            for(var listIndex = 0; listIndex < $scope.lists.length; listIndex++) {
                if($scope.lists[listIndex].list.id == data.listId) {
                    $scope.lists[listIndex].list.cards.splice(data.position, 0, data.newCard);
                    $scope.$apply();
                }
            }
        }
    });
    $scope.socket.on("removeCardMessage", function (data) {
        if($scope.currentProjectId == data.projectId) {
            LogSvc.write("Received removeCardMessage message [" + data.projectId + "] [" + data.listId + "] [" + data.cardId + "]");
            // find the correct list 
            for(var listIndex = 0; listIndex < $scope.lists.length; listIndex++) {
                if($scope.lists[listIndex].list.id == data.listId) {
                    // find the card to remove
                    for(var cardIndex = 0; cardIndex < $scope.lists[listIndex].list.cards.length; cardIndex++) {
                        if($scope.lists[listIndex].list.cards[cardIndex].card.id == data.cardId) {
                            $scope.lists[listIndex].list.cards.splice(cardIndex, 1);
                            $scope.$apply();
                        }
                    }
                }
            }   
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
        CardsSvc.create(newCard, function(data) {
            LogSvc.append(" [" + data[0].newCard.id + "]");
            // clear the input text field
            currentList.newCardTitle = "";
            // prepare the card object to append to the list
            var cardToAppend = {
                card: {
                    id: data[0].newCard.id,
                    data: data[0].newCard.data
                }
            };
            // find the correct list and add
            for(var listIndex = 0; listIndex < $scope.lists.length; listIndex++) {
                if($scope.lists[listIndex].list.id == currentList.list.id) {
                    $scope.lists[listIndex].list.cards.push(cardToAppend);
                }
            }
            // let everybody know about this change
            $scope.socket.emit("newCardMessage", { 
                projectId: $scope.currentProjectId,
                listId: currentList.list.id,
                newCard: cardToAppend
            });
        });
    };

    $scope.archiveCard = function (currentCard, currentList) {
        LogSvc.write("archiveCard [" + currentCard.card.id + "] in list [" + currentList.list.id + "]");
        CardsSvc.archiveCard(currentCard, function() {
            // find the correct list 
            for(var listIndex = 0; listIndex < $scope.lists.length; listIndex++) {
                if($scope.lists[listIndex].list.id == currentList.list.id) {
                    // find the card to remove
                    for(var cardIndex = 0; cardIndex < $scope.lists[listIndex].list.cards.length; cardIndex++) {
                        if($scope.lists[listIndex].list.cards[cardIndex].card.id == currentCard.card.id) {
                            $scope.lists[listIndex].list.cards.splice(cardIndex, 1);
                        }
                    }
                }
            }            
            // let everybody know about this change
            $scope.socket.emit("archivedCardMessage", { 
                projectId: $scope.currentProjectId,
                listId: currentList.list.id,
                cardId: currentCard.card.id
            });
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
