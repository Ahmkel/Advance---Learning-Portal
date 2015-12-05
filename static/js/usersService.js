/**
 * Created by Ahmkel on 12/4/2015.
 */
(function(){
    var $usersService = function($http){
        var getUsers = function(){
            return $http.get("/GetUsers").then(function(res){
                return res.data;
            });
        };
        return {
            getUsers:getUsers
        };
    };

    var app = angular.module("Advance");
    app.factory("$usersService",$usersService);
}())