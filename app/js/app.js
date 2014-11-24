var app = angular.module("APP", ['ngRoute']).

config(['$httpProvider', function($httpProvider) {

  $httpProvider.defaults.withCredentials = true;
  
}]).

config(function($routeProvider){
    $routeProvider.
    when('/', {templateUrl: 'views/menu.html', controller: "menuController", controllerAs: "menuCtrl"}).
    when('/login', {templateUrl: 'views/partials/login.html', controller: "loginController", controllerAs: "loginCtrl"}).
    when('/pessoas', {templateUrl: 'views/partials/pessoas.html', controller: "pessoasController", controllerAs: "pessoasCtrl"}).
    otherwise({redirectTo: '/'})
}).

controller("menuController", ['$http', '$scope', '$location', function($http, $scope, $location){
    this.initEvent = function()
    {
         $http.get('http://localhost:8080/login').
          success(function(data, status, headers, config) {
            $scope.logged = data;
            
            if(!$scope.logged)
                $location.path('/login');
          }).
          error(function(data, status, headers, config) {
          });
    }
    
    this.initEvent();
}]).

controller("pessoasController", ['$http', '$scope', function($http, $scope){
    
    this.initEvent = function()
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
            $scope.pessoas = data;
        })
        .error(function(){

        });
    };
    
    this.initEvent();
}]).

controller("loginController", ['$http', '$scope', '$location', function($http, $scope, $location){
        
    this.username = "";
    this.password = "";

    $scope.setLogged = function(value)
    {
        $scope.logged = value;
        
        $location.path($scope.logged ? '/' : '/login');
    };
    
    $scope.isLogged = function()
    {
        $http.get('http://localhost:8080/login').
        
        success(function(data, status, headers, config) {
                $scope.setLogged(data);
        }).
        
        error(function(data, status, headers, config) {
        });
        
    };

    $scope.isLogged();
    
    this.logout = function()
    {
        var req = {
            method: 'GET',
            url: 'http://localhost:8080/logout'
        }

        $http(req)
        .success(function(data){
            $scope.setLogged(data)
        })
        .error(function(){

        });
    };

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
            $scope.setLogged(data);
        })
        .error(function(){
            alert("error");
        });
    };
}]);
