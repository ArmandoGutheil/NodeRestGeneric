var url = "http://localhost:8080/";

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
        $http.get(url + 'login')
        .then(
            function(response) {
                Service.setAuthentication(response.data);
            },
            function(error) {
                alert(error)
            }
        );
        
    };
    
    Service.logout = function()
    {
        var req = {
            method: 'GET',
            url: url + 'logout'
        }

        $http(req)
        .then(
            function(response) {
                Service.setAuthentication(response.data);
            },
            function(error) {
                alert(error)
            }
        );
    };    
    
    Service.login = function(username, password)
    {
        var req = {
            method: 'POST',
            url: url + 'login',
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
        .then(
            function(response) {
                Service.setAuthentication(response.data);
            
                if(Service.authenticated)
                    $location.path("/");
            },
            function(error) {
                alert(error)
            }
        );
        
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
    
    this.delete = function(index)
    {
        var req = {
            method: 'DELETE',
            url: url + 'api/pessoas/' + $scope.pessoas[index]._id,
            headers: {
                'Content-Type': 'application/json'
            },
            crossDomain: true, 
            dataType: 'jsonp'
        }
        
        $http(req)
        .then(
            function(response) {
                $scope.pessoas.splice(index, 1);
                
                alert(response.data.message)
            },
            function(error) {
                console.log(error)
            }
        );
    };
    
    this.returnPessoas = function()
    {
         var req = {
            method: 'GET',
            url: url + 'api/pessoas',
            headers: {
                'Content-Type': 'application/json'
            },
            crossDomain: true, 
            dataType: 'jsonp'
        }

        $http(req)
        .then(
            function(response) {
                $scope.pessoas = response.data;
            },
            function(error) {
                console.log(error)
            }
        );
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