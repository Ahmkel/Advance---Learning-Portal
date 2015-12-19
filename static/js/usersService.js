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

        var sendMessage = function(sender,receiver,msgtext){
            var msgObj = {
                sender:sender,
                receiver:receiver,
                msgtext:msgtext
            };
            return $http.post("/sendMessage",msgObj).then(function(res){
                return res.data;
            });
        };

        var getUnreadMessages = function(username){
            return $http.get("/getUnreadMessages/" + username).then(function(res){
                return res.data;
            });
        };

        var getReadMessages = function(username){
            return $http.get("/getReadMessages/" + username).then(function(res){
                return res.data;
            });
        };

        var getUnreadMessagesCount = function(username){
            return $http.get("/getUnreadMessagesCount/" + username).then(function(res){
                return res.data;
            });
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
        };

        var PromoteUser = function(username){
            return $http.get("/PromoteUser/"+username).then(function(res){
                return res.data;
            });
        };

        var DemoteUser = function(username){
            return $http.get("/DemoteUser/"+username).then(function(res){
                return res.data;
            });
        };

        var BanUser = function(username){
            return $http.get("/StopUser/"+username).then(function(res){
                return res.data;
            });
        };

        var EditUserData = function(userObj){
            return $http.post("/EditUserData",userObj).then(function(res){
                return res.data;
            });
        };

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
            sendMessage:sendMessage,
            getUnreadMessages:getUnreadMessages,
            getReadMessages:getReadMessages,
            getUnreadMessagesCount:getUnreadMessagesCount,
            Follow:Follow,
            UnFollow:UnFollow,
            PromoteUser:PromoteUser,
            DemoteUser:DemoteUser,
            BanUser:BanUser,
            EditUserData:EditUserData
        };
    };
    var app = angular.module("Advance");
    app.factory("$usersService",$usersService);
}());