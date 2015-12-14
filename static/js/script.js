/**
 * Created by Ahmkel on 12/4/2015.
 */

(function(){
    ////////////////Hamada
    var App = angular.module("Advance",['ngRoute','ngAnimate']);
    App.config(function($routeProvider){
        $routeProvider
            .when('/',{
                templateUrl:'partials/main.html'
            })
            .when('/Register',{
                templateUrl:'partials/register.html'
            })
            .when('/AllUsers',{
                templateUrl:'partials/allusers.html'
            })
            .when('/User/:username',{
                templateUrl:'partials/profile.html'
            })
            .when('/Login',{
                templateUrl:'partials/login.html'
            })
            .when('/Logout',{
                templateUrl:'partials/logout.html'
            })
            .when('/AddChallenge',{
                templateUrl:'partials/addChallenge.html'
            })
            .when('/ModifyLP/:id',{
                templateUrl:'partials/modifylp.html'
            })
            .when('/AddLP', {
                templateUrl: 'partials/addLP.html'
            })
            .when('/ViewLP/:id', {
                templateUrl: 'partials/viewLP.html'
            })
            .when('/ViewChallenge/:title',{
                templateUrl: 'partials/viewCh.html'
            });
    });
    App.run(function($rootScope,$usersService){
        $rootScope.header="header";
        $rootScope.lastwindowlocation = "/";
        $rootScope.UserTypeauth= function () {
            return ($rootScope.UserType=="1"||$rootScope.UserType=="2");
        }
    });



    var MainController = function ($scope,$rootScope,$usersService) {
        $rootScope.header="header";
        $usersService.authenticate().then(function(User){
            $rootScope.UserState = User.username;
            $rootScope.UserType = User.type;
        });
    };

    var AllUsersController = function ($scope,$rootScope,$usersService,$window) {
        $rootScope.header="";
        $usersService.authenticate().then(function(User){
            $rootScope.UserState = User.username;
            $rootScope.UserType = User.type;
            $rootScope.lastwindowlocation = $window.location.href;
            if(!$rootScope.UserState){
                $window.location.href="/#/Login";
            }
        });
        $usersService.getUsers().then(function(AllUsers){
            $scope.AllUsers = AllUsers;
        });
    };

    var RegisterUserController = function ($scope,$rootScope,$usersService,$window) {
        $rootScope.header="";
        $usersService.authenticate().then(function(User){
            $rootScope.UserState = User.username;
            $rootScope.UserType = User.type;
        });
        $scope.submitUserData = function(){
            $usersService.registerUser($scope.userObj).then(function (res) {
                if(!res.Error)
                {
                    $scope.message = "New User Registered!";
                    $window.location.href="/#/";
                }
                else if(res.Error="ER_DUP_ENTRY")
                {
                    $scope.message = "This username is already registered";
                }
                else
                {
                    $scope.message = res.Error;
                }
            });
        };
    };

    var UserProfileController = function ($scope,$rootScope,$routeParams,$usersService) {
        $rootScope.header="";
        $usersService.authenticate().then(function(User){
            $rootScope.UserState = User.username;
            $rootScope.UserType = User.type;
        });
        var userObj={username:$routeParams.username};
        $usersService.getUserData(userObj).then(function(res){
            if(res.Error){
                $scope.message=res.Error.code;
            }else {
                $scope.User = res.User;
            }
        });
        $usersService.getUserLearningPaths(userObj).then(function(res){
            if(res.Error){
                $scope.ULPmessage=res.Error;
                $scope.LearningPaths=[];
            }else {
                $scope.LearningPaths = res.lp;
            }


            $usersService.getRegisteredLearningPaths(userObj).then(function(res){
                if(res.Error){
                    $scope.FLPmessage=res.Error;
                    $scope.RegisteredLearningPaths=[];
                }else {
                    $scope.RegisteredLearningPaths = res.lp;
                }

                $usersService.getUserFollowers(userObj).then(function(res){
                    if(res.Error){
                        $scope.Followersmessage=res.Error;
                        $scope.Followers = [];
                    }else {
                        $scope.Followers = res.followers;
                    }

                    $usersService.getUserFollowed(userObj).then(function(res){
                        if(res.Error){
                            $scope.Followedmessage=res.Error;
                            $scope.Followed = [];
                        }else {
                            $scope.Followed = res.followed;
                        }
                    });

                });

            });
        });
    };



    ////////////Mahmoud

    var LoginController = function ($scope,$rootScope,$usersService,$window) {
        $rootScope.header = "";
        $scope.Login = function () {
            $usersService.Login($scope.userObj).then(function (res) {
                if (!res.Error) {
                    $rootScope.UserState = res.User.Username;
                    $scope.message1 = "";
                    $window.location.href=$rootScope.lastwindowlocation;
                }
                else {
                    $rootScope.UserState=false;
                    $scope.message1 = "Wrong Username or Password";
                    $scope.userObj.username = $scope.userObj.password = "";
                }
            });
        };
    }
    var LogoutController = function ($scope, $rootScope, $usersService,$window) {
        $rootScope.header = "";
        $usersService.Logout().then(function (res) {
            if (!res.Error) {
                $rootScope.UserState = false;
                $scope.message2 = "Logged out";
            }
            else {
                $rootScope.UserState = true;
                $scope.message2 = res.Error;
            }
            $window.location.href= "/#/";
        });
    };
    var AddChallengeController = function ($scope, $rootScope, $challengeService,$usersService,$window) {
        $rootScope.header = "";
        $usersService.authenticate().then(function(User){
            $rootScope.UserState = User.username;
            $rootScope.UserType = User.type;
            $rootScope.lastwindowlocation = $window.location.href;
            if(!$rootScope.UserState){
                $window.location.href="/#/Login";
            }
        });
        $scope.AddChallenge = function () {
            $challengeService.AddChallenge($scope.chObj).then(function (res) {
                if (!res.Error) {
                    $scope.message = "Challenge added";
                }
                else {
                    $scope.message = res.Error;
                }
            })
        }
    }

    var ModifyLPController = function ($scope, $rootScope, $routeParams, $lpService) {
        $rootScope.header = "";
        $usersService.authenticate().then(function(User){
            $rootScope.UserState = User.username;
            $rootScope.UserType = User.type;
        });
        //  $rootScope.AddBlog = false;
        // $scope.AddCourse = false;
        //$scope.AddVideo = false;
        //$scope.AddBlog = false;
        $lpService.getLP($routeParams.id).then(function (res) {
            $scope.LPObj = res.LP;
        });
        $scope.EditLP = function () {
            $lpService.editLP($routeParams.id, $scope.LPObj).then(function (res) {
                if (!res.Error) {
                    $scope.message = "Learning Path modified";
                }
                else {
                    $scope.message = res.Error;
                }
            })
        };
        $scope.AddResource = function () {
            $lpService.AddResource($scope.Type).then(function (res) {
                if (!res.Error) {
                    if (Type == "Blog") {
                        //$scope.AddBlog=true;
                    }
                }
            })
        };
        $scope.addBlog = function () {
            $lpService.StpsNo($routeParams.id).then(function (res) {
                $scope.BlogObj.StepNo = res.NO;
                $scope.BlogObj.lp = $routeParams.id;
                $lpService.addBlog($scope.BlogObj).then(function (res) {
                    if (!res.Error) {
                        $scope.blogmessage = "Blog added";
                        $scope.AddBlog = false;
                        $scope.AddCourse = false;
                        $scope.AddVideo = false;
                        $scope.AddBlog = false;
                    }
                })
            });
        };
        $scope.addCourse = function () {
            $scope.CourseObj.lpid = $routeParams.id;
            $lpService.addBlog($scope.CourseObj).then(function (res) {
                if (!res.Error) {
                    $scope.coursemessage = "Course added";
                    $rootScope.head = false;
                    $scope.AddBlog = false;
                    $scope.AddCourse = false;
                    $scope.AddVideo = false;
                    $scope.AddBlog = false;
                }
            })
        };
        $scope.addVideo = function () {
            $scope.VideoObj.lpid = $routeParams.id;
            $lpService.addBlog($scope.VideoObj).then(function (res) {
                if (!res.Error) {
                    $scope.videomessage = "Video added";
                    $rootScope.head = false;
                    $scope.AddBlog = false;
                    $scope.AddCourse = false;
                    $scope.AddVideo = false;
                    $scope.AddBlog = false;
                }
            })
        };
        $scope.addBook = function () {
            $scope.BookObj.lpid = $routeParams.id;
            $lpService.addBook($scope.BookObj).then(function (res) {
                if (!res.Error) {
                    $scope.bookmessage = "Book added";
                    $rootScope.head = false;
                    $scope.AddBlog = false;
                    $scope.AddCourse = false;
                    $scope.AddVideo = false;
                    $scope.AddBlog = false;
                }
            })
        };
        /*
         $scope.EditResource = function(){
         $lpService.editResource($scope.Step).then(function(res){

         })
         }*/

        $scope.Swap = function () {
            var SwapObj = {};
            SwapObj.step1 = $scope.Step1;
            SwapObj.step2 = $scope.Step2;
            SwapObj.lpid = $routeParams.id;
            $lpService.Swap(SwapObj).then(function (res) {
                if (!res.Error) {

                }
            })
        };
        $scope.DeleteStep = function () {
            var DelObj = {};
            DelObj.lp = $routeParams.id;
            DelObj.stepno = StepD;
            $lpService.Delete(DelObj).then(function (res) {
                if (!res.Error) {

                }
            })
        };
    };


    ////////////Kahla
    var viewLPController = function ($scope,$rootScope,$lpService,$routeParams,$usersService,$window) {
        $rootScope.header = false;
        $scope.RegisterShow = false;
        $scope.unRegisterShow = false;
        $usersService.authenticate().then(function(User){
            $rootScope.UserState = User.username;
            $rootScope.UserType = User.type;
            $rootScope.lastwindowlocation = $window.location.href;
        });
        $lpService.getLP($routeParams.id).then(function(res){
            $scope.LPObj = res.LP;

            $lpService.getLPUsers($routeParams.id).then(function(res){
                $scope.LPUsers = res.Users;
                for(var i =0;i<$scope.LPUsers.length;i++)
                {
                    if($scope.LPUsers[i].Username == $rootScope.UserState){
                        $scope.unRegisterShow = true;
                        break;
                    }
                }
                if(!$scope.unRegisterShow) $scope.RegisterShow=true;
                $lpService.getComments($routeParams.id).then(function(res){
                    $scope.LPComments = res.Comments;

                    $lpService.getSteps($routeParams.id).then(function(res){
                        $scope.AllSteps = res.Steps;

                        $lpService.getVotes($routeParams.id).then(function(res){
                            $scope.LPVotes = res.Votes;

                            $lpService.getChallenges($routeParams.id).then(function(res){
                                $scope.LPChallenges = res.Challenges;
                            });
                        });
                    });
                });
            });
        });

        $scope.Comment = function (){
            $lpService.addComment($scope.CommentText,$routeParams.id).then(function(res){
                if(!res.Error){
                    $lpService.getComments($routeParams.id).then(function(res){
                        if(!res.Error){
                            $scope.LPComments = res.Comments;
                            $scope.CommentText="";
                        }
                    })
                }
            });
        };

        $scope.Register = function(){
            $lpService.register($rootScope.UserState,$scope.LPObj.ID).then(function(res){
                $lpService.getLPUsers($routeParams.id).then(function(res) {
                    $scope.LPUsers = res.Users;
                    $scope.RegisterShow=false;
                    $scope.unRegisterShow=true;
                });
            });
        };
        $scope.unRegister = function(){
            $lpService.unregister($rootScope.UserState,$scope.LPObj.ID).then(function(res){
                $lpService.getLPUsers($routeParams.id).then(function(res) {
                    $scope.LPUsers = res.Users;
                    $scope.RegisterShow=true;
                    $scope.unRegisterShow=false;
                });
            })
        };
    };
    var addLPController = function ($scope,$rootScope,$lpService,$usersService,$window) {
        $rootScope.header = false;
        $usersService.authenticate().then(function(User){
            $rootScope.UserState = User.username;
            $rootScope.UserType = User.type;
            $rootScope.lastwindowlocation = $window.location.href;
            if(!$rootScope.UserState){
                $window.location.href="/#/Login";
            }
        });
        $scope.submitLPData = function() {
            $scope.LPObj.CreatorUser = $rootScope.UserState;
            $lpService.addLP($scope.LPObj).then(function(res) {
                if(!res.Error)
                {
                    $scope.message = "Learning Path added";
                    $window.location.href="/#/User/"+$rootScope.UserState;
                }
                else
                {
                    $scope.messages = res.Error;
                }
            })
        };
    };



    var viewChallengeController = function ($scope,$rootScope,$routeParams,$usersService,$challengeService,$window) {
        $rootScope.header = false;
        $scope.RegisterShow = false;
        $scope.unRegisterShow = false;
        $usersService.authenticate().then(function(User){
            $rootScope.UserState = User.username;
            $rootScope.UserType = User.type;
            $rootScope.lastwindowlocation = $window.location.href;
        });

        $scope.ChObj = {
            Title:$routeParams.title
        };

        $challengeService.getChallenge($scope.ChObj).then(function (res) {
            $scope.ChObj = res.Challenge;
            $challengeService.getChLP($scope.ChObj).then(function (res) {
                $scope.ChallengeLP = res.ChLP;
                $challengeService.getChUsers($scope.ChObj).then(function (res){
                    $scope.ChallengeUsers = res.ChUsers;
                })

            })
        });
    };


    //////////Hamada
    App.controller("MainController", MainController);
    App.controller("AllUsersController", AllUsersController);
    App.controller("RegisterUserController", RegisterUserController);
    App.controller("UserProfileController", UserProfileController);
    App.controller("LogoutController", LogoutController);

    ///////////////Mahmoud
    App.controller("LoginController", LoginController);
    App.controller("AddChallengeController", AddChallengeController);
    App.controller("ModifyLPController", ModifyLPController);

    //////////////Kahla
    App.controller("addLPController", addLPController);
    App.controller("viewLPController", viewLPController);
    App.controller("viewChallengeController", viewChallengeController);
}());