collaborativeMindsApp.controller("TestsCtrl", function ($scope, TestsSvc) {
	$scope.addCardsTestResults = [];
	$scope.archiveCardsTestResults = [];
	$scope.testSettings = {};

    $scope.addCards = function () {
    	$scope.addCardsTestResults = [];
    	$scope.addCardsTestResults.push("Adding " + $scope.testSettings.numOfCards + " to list [" + $scope.testSettings.listId + "]"); 
    	var newCard = {
	        title: "this is a test",
	        listId: $scope.testSettings.listId,
	        copies: $scope.testSettings.numOfCards
	    };
		TestsSvc.createMultiple(newCard, function(data) {
			$scope.addCardsTestResults.push(data.message);		
		});
    };

    $scope.archiveCards = function () {
    	$scope.archiveCardsTestResults = [];
    	$scope.archiveCardsTestResults.push("Archiving " + $scope.testSettings.numOfCards + " cards from list [" + $scope.testSettings.listId + "]"); 
    	var querySettings = {
	        listId: $scope.testSettings.listId,
	        copies: $scope.testSettings.numOfCards
	    };
		TestsSvc.archiveMultiple(querySettings, function(data) {
			$scope.archiveCardsTestResults.push(data.message);		
		});
    };

});