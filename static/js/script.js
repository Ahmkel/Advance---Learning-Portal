/**
 * Created by Ahmkel on 12/4/2015.
 */

(function(){
    ////////////////Hamada,Mahmoud,Kahla,Assem
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
            })
            .when('/Search',{
                templateUrl: 'partials/search.html'
            })
            .when('/AllChallenges',{
                templateUrl: 'partials/AllChallenges.html'
            })
            .when('/AllReports',{
                templateUrl: 'partials/Allreports.html'
            });
    });
    App.run(function($rootScope,$usersService){
        $rootScope.header="header";
        $rootScope.lastwindowlocation = "/";
        $rootScope.UserTypeauth= function () {
            return ($rootScope.UserType=="1"||$rootScope.UserType=="2");
        };
        $rootScope.UnreadMessagesCount = 0;
        $rootScope.UpdateUnreadMessagesCount = function(){
            if(!$rootScope.UserState) {
                $rootScope.UnreadMessagesCount = 0;
                return;
            }
            $rootScope.UnreadMessagesCount = $usersService.getUnreadMessagesCount($rootScope.UserState).then(function(res){
                $rootScope.UnreadMessagesCount = res.count;
            });
        };
    });



    var MainController = function ($scope,$rootScope,$usersService,$window) {
        $rootScope.header="header";
        $usersService.authenticate().then(function(User){
            $rootScope.UserState = User.username;
            $rootScope.UserType = User.type;
            $rootScope.UpdateUnreadMessagesCount();
        });
        $rootScope.lastwindowlocation = $window.location.href;
        $scope.Explore = function () {
            $window.location.href = "/#/Search";
        };
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
            $rootScope.UpdateUnreadMessagesCount();
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

        var validateEmail = function(email) {
            var re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            return re.test(email);
        };

        $scope.submitUserData = function(){
            if($scope.userObj.username=='' || !$scope.userObj.username){
                $scope.message = 'Please enter a username';
                return;
            }else if($scope.userObj.password=='' || !$scope.userObj.password){
                $scope.message = 'Please enter a password';
                return;
            }else if($scope.userObj.email=='' || !$scope.userObj.email){
                $scope.message = 'Please enter an email';
                return;
            }else if(!validateEmail($scope.userObj.email)){
                $scope.message = 'Please enter a valid email address';
                return;
            }else if($scope.userObj.name=='' || !$scope.userObj.name){
                $scope.message = 'Please enter a name';
                return;
            }else if($scope.userObj.image=='' || !$scope.userObj.image){
                $scope.message = 'Please enter an image';
                return;
            }
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
        };
    };

    var UserProfileController = function ($scope,$rootScope,$routeParams,$usersService,$window) {
        $rootScope.header="";
        $scope.FollowShow=false;
        $scope.unFollowShow=false;
        $scope.SendMessageShow = false;
        $scope.ShowControlPanel = true;
        $scope.ShowInbox = false;
        $scope.ShowMyLP = false;
        $scope.ShowRegLP = false;
        $scope.ShowEditInfo = false;

        $scope.PromoteShow = false;
        $scope.DemoteShow=false;
        $scope.RemoveBanShow=false;
        $scope.BanShow = false;

        var userObj = {username:$routeParams.username};
        var userObjTmp = {};
        $usersService.authenticate().then(function(User){
            $rootScope.UserState = User.username;
            $rootScope.UserType = User.type;
            $rootScope.lastwindowlocation = $window.location.href;
            if(!$rootScope.UserState){
                $window.location.href="/#/Login";
            }
            $rootScope.UpdateUnreadMessagesCount();
            if($rootScope.UserState == $routeParams.username){
                $scope.ShowControlPanel = false;
                $scope.ShowInbox = true;
                $scope.ShowMyLP = false;
                $scope.ShowRegLP = false;
                $scope.ShowEditInfo = false;
            }else{
                $scope.ShowMyLP = true;
                $scope.ShowRegLP = true;
            }
            $usersService.getUserData(userObj).then(function(res){
                if(res.Error){
                    $scope.message=res.Error.code;
                }else {
                    $scope.User = res.User;
                    if($rootScope.UserType == '2'){
                        if($scope.User.Type == '1'){
                            $scope.PromoteShow = false;
                            $scope.DemoteShow = true;
                            $scope.RemoveBanShow = false;
                            $scope.BanShow = false;
                        }else if($scope.User.Type == '0'){
                            $scope.PromoteShow = true;
                            $scope.DemoteShow = false;
                            $scope.RemoveBanShow = false;
                            $scope.BanShow = true;
                        }else if($scope.User.Type == '-1'){
                            $scope.PromoteShow = false;
                            $scope.DemoteShow = false;
                            $scope.RemoveBanShow = true;
                            $scope.BanShow = false;
                        }
                    }else if($rootScope.UserType == '1'){
                        if($scope.User.Type == '0'){
                            $scope.PromoteShow = true;
                            $scope.DemoteShow = false;
                            $scope.RemoveBanShow = false;
                            $scope.BanShow = true;
                        }else if($scope.User.Type == '-1'){
                            $scope.PromoteShow = false;
                            $scope.DemoteShow = false;
                            $scope.RemoveBanShow = true;
                            $scope.BanShow = false;
                        }
                    }
                }
            });
            $usersService.getUnreadMessages($routeParams.username).then(function(res){
                $scope.UnreadMessages=res.unreadMessages;
            });
            $usersService.getReadMessages($routeParams.username).then(function(res){
                $scope.ReadMessages=res.readMessages;
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
        $scope.ShowSendMessage = function(){
            $scope.SendMessageShow = true;
        };
        $scope.SendMessage = function(){
            $usersService.sendMessage($rootScope.UserState,$routeParams.username,$scope.MessageText);
            $scope.MessageText = "";
            $scope.SendMessageShow = false;
        };
        $scope.CancelSendMessage = function(){
            $scope.MessageText = "";
            $scope.SendMessageShow = false;
        };
        $scope.ShowInboxBtn = function(){
            $scope.ShowInbox = true;
            $scope.ShowMyLP = false;
            $scope.ShowRegLP = false;
            $scope.ShowRegLP = false;
        };
        $scope.ShowMyLPBtn = function(){
            $scope.ShowInbox = false;
            $scope.ShowMyLP = true;
            $scope.ShowRegLP = false;
            $scope.ShowRegLP = false;
        };
        $scope.ShowRegLPBtn = function(){
            $scope.ShowInbox = false;
            $scope.ShowMyLP = false;
            $scope.ShowRegLP = true;
            $scope.ShowEditInfo = false;
        };
        $scope.ShowEditInfoBtn = function(){
            $scope.ShowInbox = false;
            $scope.ShowMyLP = false;
            $scope.ShowRegLP = false;
            $scope.ShowEditInfo = true;
            userObjTmp.Email = $scope.User.Email;
            userObjTmp.Fullname = $scope.User.Fullname;
            userObjTmp.Image = $scope.User.Image;
        };

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

        var validateEmail = function(email) {
            var re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            return re.test(email);
        };

        $scope.submitUserData = function(){
            if($scope.User.Password=='' || !$scope.User.Password){
                $scope.message = 'Please enter a password';
                return;
            }else if($scope.User.Email=='' || !$scope.User.Email){
                $scope.message = 'Please enter an email';
                return;
            }else if(!validateEmail($scope.User.Email)){
                $scope.message = 'Please enter a valid email address';
                return;
            }else if($scope.User.Fullname=='' || !$scope.User.Fullname){
                $scope.message = 'Please enter a name';
                return;
            }else if($scope.User.Image=='' || !$scope.User.Image){
                $scope.message = 'Please enter an image';
                return;
            }
            $scope.User.Birthdate = $scope.birthYear+"-"+$scope.birthMonth+"-"+$scope.birthDay;
            $usersService.EditUserData($scope.User).then(function (res) {
                $scope.User.Password = null;
            });
            $scope.message = null;
            $scope.ShowInbox = true;
            $scope.ShowMyLP = false;
            $scope.ShowRegLP = false;
            $scope.ShowRegLP = false;
        };
        $scope.cancelsubmitUserData = function(){
            $scope.ShowInbox = true;
            $scope.ShowMyLP = false;
            $scope.ShowRegLP = false;
            $scope.ShowRegLP = false;
            $scope.User.Email = userObjTmp.Email;
            $scope.User.Fullname = userObjTmp.Fullname;
            $scope.User.Image = userObjTmp.Image;
            $scope.birthYear = "2000";
            $scope.birthMonth = "1";
            $scope.birthDay = "1";
            $scope.User.Password = null;
            $scope.message = null;
        };
        $scope.PromoteUser = function(){
            $usersService.PromoteUser($routeParams.username).then(function (res){
                if(!res.Error) {
                    $scope.PromoteShow = false;
                    $scope.DemoteShow = true;
                    $scope.RemoveBanShow = false;
                    $scope.BanShow = false;
                }
            });
        };

        $scope.DemoteUser = function(){
            $usersService.DemoteUser($routeParams.username).then(function (res){
                if(!res.Error) {
                    $scope.PromoteShow = true;
                    $scope.DemoteShow = false;
                    $scope.RemoveBanShow=false;
                    $scope.BanShow = true;
                }
            });
        };

        $scope.RemoveBanUser = function(){
            $usersService.DemoteUser($routeParams.username).then(function (res){
                if(!res.Error) {
                    $scope.PromoteShow = true;
                    $scope.DemoteShow = false;
                    $scope.RemoveBanShow=false;
                    $scope.BanShow = true;
                }
            });
        };

        $scope.BanUser = function(){
            $usersService.BanUser($routeParams.username).then(function (res){
                if(!res.Error) {
                    $scope.PromoteShow = false;
                    $scope.DemoteShow = false;
                    $scope.RemoveBanShow=true;
                    $scope.BanShow = false;
                }
            });
        };

    };



    ////////////Mahmoud

    var LoginController = function ($scope,$rootScope,$usersService,$window) {
        $rootScope.header = "";
        $scope.userObj = {};
        $scope.Login = function () {
            if($scope.userObj.username == '' || !$scope.userObj.username){
                $scope.message1 = 'Please enter a username';
                return;
            }else if($scope.userObj.password == '' || !$scope.userObj.password){
                $scope.message1 = 'Please enter a password';
                return;
            }
            $usersService.Login($scope.userObj).then(function (res) {
                if (!res.Error) {
                    if(res.User.Type == '-1'){
                        $window.location.href='/#/Logout';
                        return;
                    }
                    $rootScope.UserState = res.User.Username;
                    $rootScope.UserType = res.User.Type;
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
        $scope.chObj = {};
        $usersService.authenticate().then(function(User){
            $rootScope.UserState = User.username;
            $rootScope.UserType = User.type;
            $rootScope.lastwindowlocation = $window.location.href;
            if(!$rootScope.UserState){
                $window.location.href="/#/Login";
            }
            $rootScope.UpdateUnreadMessagesCount();
        });
        $scope.AddChallenge = function () {
            if($scope.chObj.title == '' || !$scope.chObj.title){
                $scope.message = 'Please enter a title';
                return;
            }else if($scope.chObj.desc == '' || !$scope.chObj.desc){
                $scope.message = 'Please enter a description';
                return;
            }else if($scope.chObj.price == '' || !$scope.chObj.price){
                $scope.message = 'Please enter a price';
                return;
            }else if($scope.chObj.diff == '' || !$scope.chObj.diff){
                $scope.message = 'Please enter a difficulty';
                return;
            }
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

    var AllChallengesController = function ($scope,$rootScope,$challengeService,$usersService,$window){
        $rootScope.header="";
        $usersService.authenticate().then(function(User){
            $rootScope.UserState = User.username;
            $rootScope.UserType = User.type;
            $rootScope.lastwindowlocation = $window.location.href;
            if(!$rootScope.UserState){
                $window.location.href="/#/Login";
            }
            $challengeService.getAllChallenges().then(function(Challenges){
                $scope.AllChallenges = Challenges;
            });
        });
    };

    var AllReportsController = function ($scope,$rootScope,$lpService,$usersService,$window){
        $rootScope.header="";
        $usersService.authenticate().then(function(User) {
            $rootScope.UserState = User.username;
            $rootScope.UserType = User.type;
            $rootScope.lastwindowlocation = $window.location.href;
            if (!$rootScope.UserState) {
                $window.location.href = "/#/Login";
            } else if(!$rootScope.UserTypeauth()){
                $window.location.href = "/#/";
            }
            $rootScope.UpdateUnreadMessagesCount();
            $lpService.GetAllReports().then(function(res){
                $scope.AllReports = res.Reports;
            });
        });
    };


    ////////////Kahla, Mahmoud, Hamada,Assem
    var viewLPController = function ($scope,$rootScope,$lpService,$routeParams,$usersService,$window) {
        $rootScope.header = false;
        $scope.RegisterShow = false;
        $scope.unRegisterShow = false;
        $scope.ModifyShow = false;
        $scope.RemoveShow = false;
        $scope.AddLPtoCh = false;

        $scope.ReportShowbtn = true;
        $scope.ReportShow= false;
        $scope.ReportModOnly = false;

        $scope.UpVoteShow = false;
        $scope.DownVoteShow = false;
        $scope.RemoveUpVoteShow = false;
        $scope.RemoveDownVoteShow = false;

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
            if(!$rootScope.UserState) {
                $window.location.href = "/#/Login";
            }else {
                $rootScope.UpdateUnreadMessagesCount();
                $lpService.checkUserVoteLP($rootScope.UserState, $routeParams.id).then(function (res) {
                    if (res.didVote === 1) {
                        $scope.UpVoteShow = false;
                        $scope.DownVoteShow = false;
                        $scope.RemoveUpVoteShow = true;
                        $scope.RemoveDownVoteShow = false;
                    } else if(res.didVote === -1){
                        $scope.UpVoteShow = false;
                        $scope.DownVoteShow = false;
                        $scope.RemoveUpVoteShow = false;
                        $scope.RemoveDownVoteShow = true;
                    }else{
                        $scope.UpVoteShow = true;
                        $scope.DownVoteShow = true;
                        $scope.RemoveUpVoteShow = false;
                        $scope.RemoveDownVoteShow = false;
                    }
                });
                $lpService.getLP($routeParams.id).then(function (res) {
                    $scope.LPObj = res.LP;

                    if ($rootScope.UserType == "1" || $rootScope.UserType == "2") {
                        $scope.RemoveShow = true;
                        $scope.AddLPtoCh = true;
                    }
                    if ($rootScope.UserState == $scope.LPObj.CreatorUser) {
                        $scope.ModifyShow = true;
                    }

                    $lpService.getLPUsers($routeParams.id).then(function (res) {
                        $scope.LPUsers = res.Users;
                        for (var i = 0; i < $scope.LPUsers.length; i++) {
                            if ($scope.LPUsers[i].Username == $rootScope.UserState) {
                                $scope.unRegisterShow = true;
                                break;
                            }
                        }
                        if (!$scope.unRegisterShow) $scope.RegisterShow = true;
                        $lpService.getComments($routeParams.id).then(function (res) {
                            $scope.LPComments = res.Comments;

                            $lpService.getSteps($routeParams.id).then(function (res) {
                                $scope.AllSteps = res.Steps;
                                $scope.UpdateRData();

                                $lpService.getVotes($routeParams.id).then(function (res) {
                                    $scope.LPVotes = res.Votes;

                                    $lpService.getChallenges($routeParams.id).then(function (res) {
                                        $scope.LPChallenges = res.Challenges;
                                    });
                                });
                            });
                        });
                    });
                });
                if($rootScope.UserType == '1' || $rootScope.UserType == '2'){
                    $scope.ReportModOnly = true;
                    $lpService.getReports($routeParams.id).then(function(res){
                        if(!res.Error){
                            $scope.LPReports = res.Reports;
                            $scope.ReportText="";
                        }
                    });
                };
            }
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
                $scope.RegisterShow=false;
                $scope.unRegisterShow=true;
                $lpService.getLPUsers($routeParams.id).then(function(res) {
                    $scope.LPUsers = res.Users;
                });
            });
        };
        $scope.unRegister = function(){
            $lpService.unregister($rootScope.UserState,$scope.LPObj.ID).then(function(res){
                $scope.RegisterShow=true;
                $scope.unRegisterShow=false;
                $lpService.getLPUsers($routeParams.id).then(function(res) {
                    $scope.LPUsers = res.Users;
                });
            });
        };
        $scope.Remove = function(){
            $lpService.remove($scope.LPObj.ID).then(function(res){
                $window.location.href = "/#/User/" + $scope.UserState;
            });
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
                    $scope.UpdateRData();
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
                    $scope.UpdateRData();
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
                    $scope.UpdateRData();
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
                    $scope.UpdateRData();
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
                    $scope.UpdateRData();
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
                    $scope.UpdateRData();
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
                    $scope.UpdateRData();
                });
            });
        };





        $scope.UpVote = function(){
            $lpService.voteLP($rootScope.UserState,$routeParams.id,1).then(function(res){
                $lpService.getVotes($routeParams.id).then(function(res){
                    $scope.LPVotes = res.Votes;
                    $lpService.checkUserVoteLP($rootScope.UserState, $routeParams.id).then(function (res) {
                        if (res.didVote === 1) {
                            $scope.UpVoteShow = false;
                            $scope.DownVoteShow = false;
                            $scope.RemoveUpVoteShow = true;
                            $scope.RemoveDownVoteShow = false;
                        } else if(res.didVote === -1){
                            $scope.UpVoteShow = false;
                            $scope.DownVoteShow = false;
                            $scope.RemoveUpVoteShow = false;
                            $scope.RemoveDownVoteShow = true;
                        }else{
                            $scope.UpVoteShow = true;
                            $scope.DownVoteShow = true;
                            $scope.RemoveUpVoteShow = false;
                            $scope.RemoveDownVoteShow = false;
                        }
                    });
                });
            });
        };

        $scope.DownVote = function(){
            $lpService.voteLP($rootScope.UserState,$routeParams.id,-1).then(function(res){
                $lpService.getVotes($routeParams.id).then(function(res){
                    $scope.LPVotes = res.Votes;
                    $lpService.checkUserVoteLP($rootScope.UserState, $routeParams.id).then(function (res) {
                        if (res.didVote === 1) {
                            $scope.UpVoteShow = false;
                            $scope.DownVoteShow = false;
                            $scope.RemoveUpVoteShow = true;
                            $scope.RemoveDownVoteShow = false;
                        } else if(res.didVote === -1){
                            $scope.UpVoteShow = false;
                            $scope.DownVoteShow = false;
                            $scope.RemoveUpVoteShow = false;
                            $scope.RemoveDownVoteShow = true;
                        }else{
                            $scope.UpVoteShow = true;
                            $scope.DownVoteShow = true;
                            $scope.RemoveUpVoteShow = false;
                            $scope.RemoveDownVoteShow = false;
                        }
                    });
                });
            });
        };


        $lpService.getCh().then(function(res){
            $scope.AllCh=res.AllCh;
        });

        $scope.addLPtoCh = function(){
            $lpService.addLPtoCh($routeParams.id,$scope.SelectedCh).then(function(){
                $lpService.getChallenges($routeParams.id).then(function(res){
                    $scope.LPChallenges = res.Challenges;
                    $scope.AddLPtoChList = false;
                    $scope.AddLPtoCh = true;
                });
            })
        };
        $scope.CanceladdLPtoCh = function(){
            $scope.AddLPtoChList = false;
            $scope.AddLPtoCh = true;
        };
        $scope.removeChLP = function(title){
            $lpService.removeCh($routeParams.id,title).then(function(){
                $lpService.getChallenges($routeParams.id).then(function(res){
                    $scope.LPChallenges = res.Challenges;
                });
            })
        };


        $scope.UpdateRData = function(){
            for(var i=0;i<$scope.AllSteps.length;i++) {

                $lpService.getResourceData($routeParams.id, $scope.AllSteps[i].Stepno, $scope.AllSteps[i].Type,i).then(function (res) {
                    if ($scope.AllSteps[res.i].Type == '4') {
                        $scope.AllSteps[res.i].Provider = res.Provider;
                        $scope.AllSteps[res.i].Duration = res.Duration;
                        $scope.AllSteps[res.i].Price = res.Price;
                    } else if ($scope.AllSteps[res.i].Type == '1') {
                        $scope.AllSteps[res.i].Author = res.Author;
                        $scope.AllSteps[res.i].Pagesno = res.Pagesno;
                        $scope.AllSteps[res.i].Price = res.Price;
                    } else if ($scope.AllSteps[res.i].Type == '2') {
                        $scope.AllSteps[res.i].Uploader = res.Uploader;
                        $scope.AllSteps[res.i].Duration = res.Duration;
                    } else {
                        $scope.AllSteps[res.i].Blogger = res.Blogger;
                    }
                });
            }
        }


        $scope.ShowReportLP = function (){
            $scope.ReportShow=true;

        };
        $scope.Cancelling = function (){
            $scope.ReportText = "";
            $scope.ReportShow=false;
        };

        $scope.ReportLP = function(){
            $lpService.reportLP($scope.ReportText,$routeParams.id).then(function (res) {
                if($rootScope.UserType == '1' || $rootScope.UserType == '2'){
                    $scope.ReportModOnly = true;
                    $lpService.getReports($routeParams.id).then(function(res){
                        if(!res.Error){
                            $scope.LPReports = res.Reports;
                            $scope.ReportText="";
                        }
                    });
                };
            });
            $scope.ReportText = "";
            $scope.ReportShow=false;
        };
    };

    var addLPController = function ($scope,$rootScope,$lpService,$usersService,$window) {
        $rootScope.header = false;
        $scope.LPObj = {};
        $usersService.authenticate().then(function(User){
            $rootScope.UserState = User.username;
            $rootScope.UserType = User.type;
            $rootScope.lastwindowlocation = $window.location.href;
            if(!$rootScope.UserState){
                $window.location.href="/#/Login";
            }
            $rootScope.UpdateUnreadMessagesCount();
        });
        $scope.submitLPData = function() {
            if($scope.LPObj.Title == '' || !$scope.LPObj.Title){
                $scope.message = 'Please enter a title';
                return;
            }else if($scope.LPObj.Description == '' || !$scope.LPObj.Description){
                $scope.message = 'Please enter a description';
                return;
            }else if($scope.LPObj.Duration == '' || !$scope.LPObj.Duration){
                $scope.message = 'Please enter a duration';
                return;
            }else if($scope.LPObj.Category == '' || !$scope.LPObj.Category){
                $scope.message = 'Please enter a category';
                return;
            }
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
        $scope.RemoveShow = false;
        $scope.ChObj = {
            Title:$routeParams.title
        };
        $usersService.authenticate().then(function(User){
            $rootScope.UserState = User.username;
            $rootScope.UserType = User.type;
            if(!$rootScope.UserState){
                $window.location.href = '/#/';
            }
            $rootScope.lastwindowlocation = $window.location.href;


            if($rootScope.UserTypeauth()){
                $scope.RemoveShow = true;
            }
            $challengeService.getChallenge($scope.ChObj).then(function (res) {
                $scope.ChObj = res.Challenge;
                $challengeService.getChLP($scope.ChObj).then(function (res) {
                    $scope.ChallengeLP = res.ChLP;
                    $challengeService.getChUsers($scope.ChObj).then(function (res){
                        $scope.ChallengeUsers = res.ChUsers;
                        for(var i=0; i<$scope.ChallengeUsers.length; i++){
                            if($scope.ChallengeUsers[i].Username==$rootScope.UserState) {
                                $scope.RegisterShow = false;
                                $scope.unRegisterShow = true;
                                break;
                            }
                        }
                        if(!$scope.unRegisterShow){
                            $scope.RegisterShow=true;
                        }
                    });
                });
            });
        });


        $scope.Register = function(){
            $challengeService.register($rootScope.UserState,$routeParams.title).then(function(res){
                $scope.RegisterShow=false;
                $scope.unRegisterShow=true;
                $challengeService.getChUsers($scope.ChObj).then(function (res){
                    $scope.ChallengeUsers = res.ChUsers;
                });
            });
        };
        $scope.unRegister = function(){
            $challengeService.unregister($rootScope.UserState,$routeParams.title).then(function(res){
                $scope.RegisterShow=true;
                $scope.unRegisterShow=false;
                $challengeService.getChUsers($scope.ChObj).then(function (res){
                    $scope.ChallengeUsers = res.ChUsers;
                });
            })
        };
        $scope.Remove = function(){
            $challengeService.remove($routeParams.title).then(function(res){
                $window.location.href = "/#/User/" + $scope.UserState;
            });
        };
    };

    var SearchController = function ($scope,$rootScope,$lpService,$window,$usersService) {
        $rootScope.header = false;
        $usersService.authenticate().then(function(User){
            $rootScope.UserState = User.username;
            $rootScope.UserType = User.type;

            if($rootScope.UserState){
                $rootScope.UpdateUnreadMessagesCount();
            }
        });
        $rootScope.lastwindowlocation = $window.location.href;
        $scope.LPSearch= function () {
            $lpService.SearchLPbyName($scope.LPObj).then(function (res) {
                $scope.SLP = res.LPs;
            });
        };
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

    /////////////////Assem
    App.controller("SearchController",SearchController);
    App.controller("AllChallengesController",AllChallengesController);
    App.controller("AllReportsController",AllReportsController);
}());