var collaborativeMindsApp = angular.module("collaborativeMindsApp", [
	"ngRoute",
	"ui.bootstrap"
]);

collaborativeMindsApp.config(["$routeProvider",
	function($routeProvider) {
		$routeProvider.
			when("/project/:id", {
				templateUrl: "views/project.html",
				controller: "ProjectController"
			}).
			when("/projects", {
				templateUrl: "views/projects.html",
				controller: "ProjectController"
			}).
			otherwise({
				redirectTo: "/index.html"
			});
	}]);

