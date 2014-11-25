var app = angular.module("APP", ['ngRoute']).

config(['$httpProvider', function($httpProvider) {

  $httpProvider.defaults.withCredentials = true;
  
}]).

config(function($routeProvider){
    $routeProvider.
    
    when('/login', {templateUrl: 'views/partials/login.html', controller: "loginController", controllerAs: "loginCtrl"}).
    
    when('/', {templateUrl: 'views/partials/pessoas.html', controller: "pessoasController", controllerAs: "pessoasCtrl"}).
    
    otherwise({redirectTo: '/'})
}).

factory('AuthenticationService',  ['$http', '$location', function($http, $location){
    
    var Service = {};
    
    Service.setAuthentication = function(value)
    {
        Service.authenticated = value;
        
        if(!Service.authenticated)
            $location.path('/login');
    };
    
    Service.checkStatus = function()
    {
        $http.get('http://localhost:8080/login').
        
        success(function(data, status, headers, config) {
                Service.setAuthentication(data);
        }).
        
        error(function(data, status, headers, config) {
        });
        
    };
    
    Service.logout = function()
    {
        var req = {
            method: 'GET',
            url: 'http://localhost:8080/logout'
        }

        $http(req)
        .success(function(data){
            Service.setAuthentication(data)
        })
        .error(function(){

        });
    };    
    
    Service.login = function(username, password)
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
                username: username, 
                password: password
            }
        }

        $http(req)
        
        .success(function(data){
            Service.setAuthentication(data);
            
            if(Service.authenticated)
                $location.path("/");
        })
        
        .error(function(){
            alert("error");
        });
    };
    
    return Service;
}]).

controller("menuController", ['$http', '$scope', '$location', 'AuthenticationService', function($http, $scope, $location, AuthenticationService){
    
    AuthenticationService.checkStatus();
    
    this.logout = function()
    {
        AuthenticationService.logout();
    }
}]).

controller("pessoasController", ['$http', '$scope', 'AuthenticationService', function($http, $scope, AuthenticationService){
    
    AuthenticationService.checkStatus();
    
    this.returnPessoas = function()
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
    
    this.returnPessoas();
}]).

controller("loginController", ['$http', '$scope', '$location', 'AuthenticationService', function($http, $scope, $location, AuthenticationService){
        
    this.username = "";
    this.password = "";

    this.login = function()
    {
       AuthenticationService.login(this.username, this.password);
    };
}])

.directive("menuDirective", function(){
    return{
        restrict: "E",
        templateUrl: "views/partials/menu.html",
        controller: "menuController",
        controllerAs: "menuCtrl"
    }
})