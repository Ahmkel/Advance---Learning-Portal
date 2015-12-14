/**
 * Created by Ahmkel on 12/4/2015.
 */
(function(){
    var $usersService = function($http){
        //////////Hamada
        var getUsers = function(){
            return $http.get("/GetUsers").then(function(res){
                return res.data;
            });
        };
        var registerUser = function(userObj){
            return $http.post("/RegisterUser",userObj).then(function(res){
                return res.data;
            });
        };
        var getUserData = function(userObj){
            return $http.get("/GetUserData/"+userObj.username).then(function(res){
                return res.data;
            });
        };
        var getUserLearningPaths = function(userObj){
            return $http.get("/GetUserLearningPaths/"+userObj.username).then(function(res){
                return res.data;
            });
        };
        var getRegisteredLearningPaths = function(userObj){
            return $http.get("/GetRegisteredLearningPaths/"+userObj.username).then(function(res){
                return res.data;
            });
        };
        var getUserFollowers = function(userObj){
            return $http.get("/GetUserFollowers/"+userObj.username).then(function(res){
                return res.data;
            });
        };
        var getUserFollowed = function(userObj){
            return $http.get("/GetUserFollowed/"+userObj.username).then(function(res){
                return res.data;
            });
        };

        var authenticate = function(){
            return $http.get("/authenticate").then(function (res) {
                return res.data;
            })
        };

        /////////////////Mahmoud
        var Login = function(userObj){
            return $http.post("/Login",userObj).then(function(res){
                return res.data;
            });
        };

        var Logout = function(){
            return $http.get("/Logout").then(function(res){
                return res.data;
            });
        };

        /////////Assem
        var Follow = function(username){
            return $http.get("/Follow/"+username).then(function(res){
                return res.data;
            });
        };
        var UnFollow = function(username){
            return $http.get("/UnFollow/"+username).then(function(res){
                return res.data;
            });
        }

        return {
            getUsers:getUsers,
            registerUser:registerUser,
            getUserData:getUserData,
            getUserLearningPaths:getUserLearningPaths,
            getRegisteredLearningPaths:getRegisteredLearningPaths,
            getUserFollowers:getUserFollowers,
            getUserFollowed:getUserFollowed,
            Login:Login,
            Logout:Logout,
            authenticate:authenticate,
            Follow:Follow,
            UnFollow:UnFollow
        };
    };
    var app = angular.module("Advance");
    app.factory("$usersService",$usersService);
}());