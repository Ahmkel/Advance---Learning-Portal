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

        return {
            AddChallenge:AddChallenge,
            getChallenge: getChallenge,
            getChLP: getChLP,
            getChUsers: getChUsers,
            getAllChallenges:getAllChallenges
        };
    };

    var app = angular.module("Advance");
    app.factory("$challengeService",$challengeService);
}())