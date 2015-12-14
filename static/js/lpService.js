/**
 * Created by Kahla on 12/11/2015.
 */

////////////Mahmoud
(function(){
    var $lpService = function($http){

        var addLP = function(LPObj){
            return $http.post("/addLP",LPObj).then(function(res){
                return res.data;
            });
        };

        var getLP = function(id){
            return $http.get("/GetLP/" + id).then(function(res){
                return res.data;
            })
        };

        var editLP = function(id,LPObj){
            return $http.post("/EditLP/" + id,LPObj).then(function(res){
                return res.data;
            })
        }

        var addBlog = function(BlogObj){
            return $http.post("/AddBlog",BlogObj).then(function(res){
                return res.data;
            })
        }

        var addCourse = function(CourseObj){
            return $http.post("/AddCourse",CourseObj).then(function(res){
                return res.data;
            })
        }
        var addVideo = function(VideoObj){
            return $http.post("/AddVideo",VideoObj).then(function(res){
                return res.data;
            })
        }
        var addBook = function(BookObj){
            return $http.post("/AddBook",BookObj).then(function(res){
                return res.data;
            })
        }

/*        var editResource = function(Step){
            return $http.post("/GetStep",Step).then(function(res){
                return res.data;
            })
        }*/


        var Swap = function(StepsObj){
            return $http.post("/SwapSteps",StepsObj).then(function(res){
                return res.data;
            })
        };

        var Delete = function(DelObj){
            return $http.post("/DeleteStep",DelObj).then(function(res){
                return res.data;
            })
        };

        var StpsNo = function(id){
            return $http.get("/NoOfSteps/" + id).then(function(res){
                return res.data;
            })
        };

        var getSteps = function(id){
            return $http.get("/getSteps/" + id).then(function(res){
                return res.data;
            })
        };

        var getLPUsers = function(id){
            return $http.get("/GetLPUsers/" + id).then(function(res){
                return res.data;
            })
        };
        var getComments = function(id){
            return $http.get("/GetLpComments/" + id).then(function(res){
                return res.data;
            })
        };

        var getVotes= function (id) {
            return $http.get("/GetLpVotes/" + id).then(function(res){
                return res.data;
            })
        };

        var getChallenges= function (id) {
            return $http.get("/GetLpChallenges/" + id).then(function(res){
                return res.data;
            })
        };

        var register = function(username,lpid){
            var obj = {
                username:username,
                lpid:lpid
            }
            return $http.post("/registerLP",obj).then(function(res){
                return res.data;
            });
        };

        var unregister = function(username,lpid){
            var obj = {
                username:username,
                lpid:lpid
            }
            return $http.post("/unregisterLP",obj).then(function(res){
                return res.data;
            });
        };

        var addComment = function(NewComment,id) {
            return $http.post("/addComment/"+id,{Text:NewComment}).then(function(res){
                return res.data;
            });
        };

        return {
            addLP: addLP,
            getLP: getLP,
            editLP: editLP,
            addBlog: addBlog,
            addCourse: addCourse,
            addVideo: addVideo,
            addBook: addBook,
            Swap:Swap,
            Delete:Delete,
            StpsNo:StpsNo,
            //editResource: editResource

            getSteps: getSteps,
            getLPUsers: getLPUsers,
            getComments: getComments,
            getVotes: getVotes,
            getChallenges: getChallenges,
            addComment:addComment,

            //////Hamada
            register:register,
            unregister:unregister
        };
    };

    var app = angular.module("Advance");
    app.factory("$lpService",$lpService);
}());