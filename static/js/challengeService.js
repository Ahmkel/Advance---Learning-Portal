/**
 * Created by Mahmoud on 12/11/2015.
 */

/**
 * Created by Ahmkel on 12/4/2015.
 */
//////// Mahmoud
(function(){
    var $challengeService = function($http){

        var AddChallenge = function(chObj){
            return $http.post("/AddChallenge",chObj).then(function(res){
                return res.data;
            });
        };

        ////////////Kahla
        var getChallenge = function(ChObj){
            return $http.post("/GetChallenge",ChObj).then(function(res){
                return res.data;
            });
        };

        var getChLP = function(ChObj){
            return $http.post("/GetChLP",ChObj).then(function(res){
                return res.data;
            });
        };

        var getChUsers = function(ChObj){
            return $http.post("/GetChUsers",ChObj).then(function(res){
                return res.data;
            });
        };

        var getAllChallenges = function(){
            return $http.get("/getAllChallenges").then(function(res){
                return res.data;
            });
        };

        var register = function(username,challengeTitle){
            var obj = {
                username:username,
                challengeTitle:challengeTitle
            }
            return $http.post("/registerChallenge",obj).then(function(res){
                return res.data;
            });
        };

        var unregister = function(username,challengeTitle){
            var obj = {
                username:username,
                challengeTitle:challengeTitle
            }
            return $http.post("/unregisterChallenge",obj).then(function(res){
                return res.data;
            });
        };

        var remove = function(challengeTitle){
            return $http.delete("/removeChallenge/"+challengeTitle).then(function(res){
                return res.data;
            });
        };

        return {
            AddChallenge:AddChallenge,
            getChallenge: getChallenge,
            getChLP: getChLP,
            getChUsers: getChUsers,
            getAllChallenges:getAllChallenges,
            register:register,
            unregister:unregister,
            remove:remove
        };
    };

    var app = angular.module("Advance");
    app.factory("$challengeService",$challengeService);
}())