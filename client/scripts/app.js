var collaborativeMindsApp = angular.module("collaborativeMindsApp", [
	"ngRoute",
	"ngResource"
]);

collaborativeMindsApp.config(["$routeProvider",
	function($routeProvider) {
		$routeProvider.
			when("/project/:id", {
				templateUrl: "views/lists.html"
			}).
			when("/projects", {
				templateUrl: "views/projects.html"
			}).
			otherwise({
				redirectTo: "/projects"
			});
	}
]);

