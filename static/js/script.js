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



    var MainController = function ($scope,$rootScope,$usersService,$window) {
        $rootScope.header="header";
        $usersService.authenticate().then(function(User){
            $rootScope.UserState = User.username;
            $rootScope.UserType = User.type;
        });
        $rootScope.lastwindowlocation = $window.location.href;
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
        $scope.userObj={};
        $scope.userObj.gender = "M";
        $scope.userObj.type = "0";
        $scope.birthYear = "2000";
        $scope.birthMonth = "1";
        $scope.birthDay = "1";
        $scope.Years = [];
        $scope.Months = [];
        $scope.Days = [];
        for(var i = (new Date()).getFullYear();i>=1960;i--) {
            $scope.Years.push(i);
        };
        for(var i = 1;i<=12;i++) {
            $scope.Months.push(i);
        }
        for(var i = 1;i<=31;i++) {
            $scope.Days.push(i);
        }
        $scope.submitUserData = function(){
            $scope.userObj.birthdate = $scope.birthYear+"-"+$scope.birthMonth+"-"+$scope.birthDay;
            $usersService.registerUser($scope.userObj).then(function (res) {
                if(!res.Error)
                {
                    $scope.message = "";
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
        $scope.validateGender = function(){
            if(userObj.gender.length>1){
                userObj.gender=userObj.gender[0];
            }
        }
    };

    var UserProfileController = function ($scope,$rootScope,$routeParams,$usersService,$window) {
        $rootScope.header="";
        $scope.FollowShow=false;
        $scope.unFollowShow=false;
        $usersService.authenticate().then(function(User){
            $rootScope.UserState = User.username;
            $rootScope.UserType = User.type;
            $rootScope.lastwindowlocation = $window.location.href;
            if(!$rootScope.UserState){
                $window.location.href="/#/Login";
            }
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
                    $scope.Followersmessage = res.Error;
                    if(res.Error){
                        $scope.Followers = [];
                    }else {
                        $scope.Followers = res.followers;
                    }

                    if($routeParams.username != $rootScope.UserState) {
                        if (res.followers != null) {
                            for (var i = 0; i < res.followers.length; i++) {
                                if (res.followers[i].Username == $rootScope.UserState) {
                                    $scope.unFollowShow = true;
                                    break;
                                }
                            }
                        }

                        if (!$scope.unFollowShow) $scope.FollowShow = true;
                    }

                    $scope.Followersmessage=res.Error;
                    if(res.Error){
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

        $scope.Follow = function(){
            $usersService.Follow($routeParams.username).then(function (res){
                if(!res.Error)
                {
                    $usersService.getUserFollowers(userObj).then(function(res) {
                        $scope.Followersmessage = res.Error;
                        if(res.Error){
                            $scope.Followers = [];
                        }else {
                            $scope.Followers = res.followers;
                        }
                    });

                    $scope.FollowShow = false;
                    $scope.unFollowShow = true;
                }

            })
        };
        $scope.UnFollow = function(){
            $usersService.UnFollow($routeParams.username).then(function (res){
                if(!res.Error)
                {
                    $usersService.getUserFollowers(userObj).then(function(res) {
                        $scope.Followersmessage = res.Error;
                        if(res.Error){
                            $scope.Followers = [];
                        }else {
                            $scope.Followers = res.followers;
                        }
                    });
                    $scope.FollowShow= true;
                    $scope.unFollowShow = false;
                }
            })
        };
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
                    $scope.message = "";
                    $window.location.href="/#/User/"+$rootScope.UserState;
                }
                else {
                    $scope.message = res.Error;
                }
            })
        }
    }



    ////////////Kahla, Mahmoud, Hamada
    var viewLPController = function ($scope,$rootScope,$lpService,$routeParams,$usersService,$window) {
        $rootScope.header = false;
        $scope.RegisterShow = false;
        $scope.unRegisterShow = false;
        $scope.ModifyShow = false;
        $scope.RemoveShow = false;


        $scope.ShowModifySection = false;
        $scope.ShowModifyStep = false;

        $scope.ShowModifyDetails = false;
        $scope.ShowAddCourse = false;
        $scope.ShowAddBook = false;
        $scope.ShowAddVideo = false;
        $scope.ShowAddBlog = false;


        $scope.CourseObj = {};
        $scope.BookObj = {};
        $scope.VideoObj = {};
        $scope.BlogObj = {};


        $usersService.authenticate().then(function(User){
            $rootScope.UserState = User.username;
            $rootScope.UserType = User.type;
            $rootScope.lastwindowlocation = $window.location.href;
        });
        $lpService.getLP($routeParams.id).then(function(res){
            $scope.LPObj = res.LP;

            if($rootScope.UserState==$scope.LPObj.CreatorUser || $rootScope.UserType=="1" || $rootScope.UserType=="2"){
                $scope.RemoveShow = true;
            }
            if($rootScope.UserState==$scope.LPObj.CreatorUser){
                $scope.ModifyShow = true;
            }

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
        $scope.Remove = function(){
            $lpService.remove($scope.LPObj.ID).then(function(res){
                $window.location.href = "/#/User/" + $scope.UserState;
            });
        };
        $scope.Modify = function(){
            $window.location.href = "/#/ModifyLP/" + $routeParams.id;
        };


        //////////Modifications
        //Show
        $scope.Modify = function(){
            $scope.ShowModifySection = true;
            $scope.ShowModifyStep = true;
            $scope.ModifyShow = false;
            $scope.StopModifyShow = true;
        }

        $scope.StopModify = function () {
            $scope.ShowModifySection = false;
            $scope.ShowModifyStep = false;
            $scope.StopModifyShow = false;
            $scope.ModifyShow = true;
        }

        $scope.ShowModifyDetailsForm = function() {
            $scope.ShowModifyDetails = true;
        };

        $scope.ShowAddCourseForm = function(){
            $scope.ShowAddCourse = true;
        };

        $scope.ShowAddBookForm = function(){
            $scope.ShowAddBook = true;
        };

        $scope.ShowAddVideoForm = function(){
            $scope.ShowAddVideo = true;
        };

        $scope.ShowAddBlogForm = function(){
            $scope.ShowAddBlog = true;
        };

        //Update
        $scope.ModifyDetails = function () {
            $lpService.editLP($routeParams.id, $scope.LPObj).then(function (res) {
                $scope.ShowModifyDetails=false;
            });
        };

        $scope.AddCourse = function () {
            $scope.CourseObj.lpid = $routeParams.id;
            $lpService.AddCourse($scope.CourseObj).then(function (res) {
                $scope.CourseObj.title="";
                $scope.CourseObj.desc="";
                $scope.CourseObj.link="";
                $scope.CourseObj.provider="";
                $scope.CourseObj.duration="";
                $scope.CourseObj.price="";
                $lpService.getSteps($routeParams.id).then(function(res) {
                    $scope.AllSteps = res.Steps;
                });
                $scope.ShowAddCourse = false;
            });
        };
        $scope.AddBook = function () {
            $scope.BookObj.lpid = $routeParams.id;
            $lpService.AddBook($scope.BookObj).then(function (res) {
                $scope.BookObj.title="";
                $scope.BookObj.desc="";
                $scope.BookObj.link="";
                $scope.BookObj.author="";
                $scope.BookObj.pno="";
                $scope.BookObj.price="";
                $lpService.getSteps($routeParams.id).then(function(res) {
                    $scope.AllSteps = res.Steps;
                });
                $scope.ShowAddBook = false;
            });
        };
        $scope.AddVideo = function () {
            $scope.VideoObj.lpid = $routeParams.id;
            $lpService.AddVideo($scope.VideoObj).then(function (res) {
                $scope.VideoObj.title="";
                $scope.VideoObj.desc="";
                $scope.VideoObj.link="";
                $scope.VideoObj.uploader="";
                $scope.VideoObj.duration="";
                $lpService.getSteps($routeParams.id).then(function(res) {
                    $scope.AllSteps = res.Steps;
                });
                $scope.ShowAddVideo = false;
            });
        };
        $scope.AddBlog = function () {
            $scope.BlogObj.lpid = $routeParams.id;
            $lpService.AddBlog($scope.BlogObj).then(function (res) {
                $scope.BlogObj.title="";
                $scope.BlogObj.desc="";
                $scope.BlogObj.link="";
                $scope.BlogObj.blogger="";
                $lpService.getSteps($routeParams.id).then(function(res) {
                    $scope.AllSteps = res.Steps;
                });
                $scope.ShowAddBlog = false;
            });
        };

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
        $scope.DeleteStep = function (Stepno) {
            var DelObj = {};
            DelObj.lpid = $routeParams.id;
            DelObj.stepno = Stepno;
            $lpService.DeleteStep(DelObj).then(function (res) {
                $lpService.getSteps($routeParams.id).then(function(res) {
                    $scope.AllSteps = res.Steps;
                });
            });
        };

        $scope.MoveStepUp = function (Stepno) {
            if(Stepno==1) return;
            var SwapObj = {
                lpid:$routeParams.id,
                stepno1:Stepno,
                stepno2:Stepno-1
            };
            $lpService.SwapSteps(SwapObj).then(function (res) {
                $lpService.getSteps($routeParams.id).then(function(res) {
                    $scope.AllSteps = res.Steps;
                });
            });
        };

        $scope.MoveStepDown = function (Stepno) {
            if(Stepno == $scope.AllSteps.length) return;
            var SwapObj = {
                lpid:$routeParams.id,
                stepno1:Stepno,
                stepno2:Stepno+1
            };
            $lpService.SwapSteps(SwapObj).then(function (res) {
                $lpService.getSteps($routeParams.id).then(function(res) {
                    $scope.AllSteps = res.Steps;
                });
            });
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

    //////////////Kahla
    App.controller("addLPController", addLPController);
    App.controller("viewLPController", viewLPController);
    App.controller("viewChallengeController", viewChallengeController);
}());