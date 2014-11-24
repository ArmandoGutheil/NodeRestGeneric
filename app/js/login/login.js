var app = angular.module("login", []);

app.config(['$httpProvider', function($httpProvider) {

  $httpProvider.defaults.withCredentials = true;
  
}])


app.directive("loginDirective", ['$http', function($http, $scope) {
  return {
    restrict: 'E',
    
    templateUrl: "./js/login/login.html",

    controller: function($http, $scope)
    {
    	$scope.logged = false;
		this.username = "";
		this.password = "";

		this.isLogged = function()
		{
			$http.get('http://localhost:8080/login').
			  success(function(data, status, headers, config) {
			  	$scope.logged = data;
			  }).
			  error(function(data, status, headers, config) {
			  });
		};

		this.isLogged();

		this.logout = function()
		{
			var req = {
				method: 'GET',
				url: 'http://localhost:8080/logout'
			}

			$http(req)
			.success(function(data){
				$scope.logged = false;
			})
			.error(function(){

			});
		};

		this.Pessoas = function()
		{
			var req = {
				method: 'GET',
				url: 'http://localhost:8080/api/pessoas',
				headers: {
					'Content-Type': 'application/json'
				},
				crossDomain: true, 
				dataType: 'jsonp'
			}

			$http(req)
			.success(function(data){
				alert(data)
			})
			.error(function(){

			});
		}

		this.doLogin = function()
		{
			var req = {
				method: 'POST',
				url: 'http://localhost:8080/login',
				headers: {
					'Content-Type': 'application/json'
				},
				crossDomain: true, 
				dataType: 'jsonp',
				data: {
					username: this.username, 
					password: this.password
				}
			}

			$http(req)
			.success(function(data){
				$scope.logged = data;
			})
			.error(function(){
				alert("error");
			});
		};
    },
    
    controllerAs: "login"
  };
}]);