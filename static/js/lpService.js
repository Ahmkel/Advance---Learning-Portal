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
        };

        var AddCourse = function(CourseObj){
            return $http.post("/AddCourse",CourseObj).then(function(res){
                return res.data;
            })
        };

        var AddBook = function(BookObj){
            return $http.post("/AddBook",BookObj).then(function(res){
                return res.data;
            })
        };

        var AddVideo = function(VideoObj){
            return $http.post("/AddVideo",VideoObj).then(function(res){
                return res.data;
            })
        };

        var AddBlog = function(BlogObj){
            return $http.post("/AddBlog",BlogObj).then(function(res){
                return res.data;
            })
        };

/*        var editResource = function(Step){
            return $http.post("/GetStep",Step).then(function(res){
                return res.data;
            })
        }*/


        var SwapSteps = function(SwapObj){
            return $http.post("/swapSteps",SwapObj).then(function(res){
                return res.data;
            })
        };

        var DeleteStep = function(DelObj){
            return $http.post("/deleteStep",DelObj).then(function(res){
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

        var remove = function(id){
            return $http.delete("/removeLP/"+id).then(function(res){
                return res.data;
            });
        };

        return {
            addLP: addLP,
            getLP: getLP,
            editLP: editLP,
            AddCourse: AddCourse,
            AddBook: AddBook,
            AddVideo: AddVideo,
            AddBlog: AddBlog,
            SwapSteps:SwapSteps,
            DeleteStep:DeleteStep,
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
            unregister:unregister,
            remove:remove
        };
    };

    var app = angular.module("Advance");
    app.factory("$lpService",$lpService);
}());