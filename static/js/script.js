/**
 * Created by Ahmkel on 12/4/2015.
 */

(function(){
    var App = angular.module("Advance",[]);

    var usersController = function ($scope,$usersService) {
        $scope.AllUsers;
        $scope.x=10;

        $usersService.getUsers().then(function(AllUsers){
            $scope.AllUsers = AllUsers;
        });
    };


    App.controller("usersController",usersController);
}())