/**
 * Created by Ahmkel on 12/5/2015.
 */

//////////Hamada

//Get the sqlConnecor object
var sqlConnector = require('./sqlConnector.js');

//User based requests handlers

var getUsers = function(req,res){
    sqlConnector.getConnection(function(err,connection){
        connection.query("SELECT Username,Email,Fullname,Gender,Birthdate,Image,Type FROM User",function(err,rows){
            res.end(JSON.stringify({}.Users = rows)+"\n");
            connection.release();
        });
    });
};

var RegisterUser = function(req,res){
    sqlConnector.getConnection(function(err,connection) {
        connection.query("INSERT INTO User VALUES (?, ?, ?, ?, ?, ?, ?, ?)"
            , [req.body.username, req.body.password, req.body.email, req.body.name, req.body.gender, req.body.birthdate, req.body.image, req.body.type]
            , function (err, rows) {
                var O = {
                    Error: err
                }
                res.end(JSON.stringify(O) + "\n");
                connection.release();
            });
    });
};

var getUserData = function(req,res){
    //res.send(JSON.stringify(req.params));
    sqlConnector.getConnection(function(err,connection){
        //connection.query("SELECT * FROM User WHERE Username = ?",[req.params.username]
        connection.query("SELECT Username,Email,Fullname,Gender,Birthdate,Image,Type FROM User WHERE Username = ?",[req.params.username]
        ,function(err,rows){
                var resJSON={}
                if(rows.length==0){
                    resJSON.Error = "User not Found";
                    resJSON.User=null;
                }else{

                    resJSON.Error = null;
                    resJSON.User = rows[0];
                }
                res.end(JSON.stringify(resJSON));
                connection.release();
            });
    });
};

var getUserLearningPaths = function(req,res){
    //res.send(JSON.stringify(req.params));
    sqlConnector.getConnection(function(err,connection){
        connection.query("SELECT * FROM learningpath WHERE CreatorUser = ?",[req.params.username]
            ,function(err,rows){
                connection.release();
                var resJSON={};
                if(rows.length==0){
                    resJSON.Error = "No learning paths yet";
                    resJSON.lp=null;
                }else{

                    resJSON.Error = null;
                    resJSON.lp = rows;
                }
                res.end(JSON.stringify(resJSON));
            });
    });
};

var getRegisteredLearningPaths = function(req,res){
    //res.send(JSON.stringify(req.params));
    sqlConnector.getConnection(function(err,connection){
        connection.query("SELECT lp.* FROM user u,learningpath lp,registerslp r WHERE u.Username=r.Username AND lp.ID=r.LPID AND u.Username = ?"
            ,[req.params.username]
            ,function(err,rows){
                connection.release();
                var resJSON={};
                if(rows.length==0){
                    resJSON.Error = "Not registered in any learning paths yet";
                    resJSON.lp=null;
                }else{

                    resJSON.Error = null;
                    resJSON.lp = rows;
                }
                res.end(JSON.stringify(resJSON));
            });
    });
};

var getUserFollowers = function(req,res){
    //res.send(JSON.stringify(req.params));
    sqlConnector.getConnection(function(err,connection){
        connection.query("SELECT User.* FROM User,Follows WHERE User.Username = follows.FollowerUN AND FollowedUN = ?",[req.params.username]
            ,function(err,rows){
                connection.release();
                var resJSON={};
                if(rows.length==0){
                    resJSON.Error = "No One Follows "+req.params.username+" yet";
                    resJSON.followers=null;
                }else{

                    resJSON.Error = null;
                    resJSON.followers = rows;
                }
                res.end(JSON.stringify(resJSON));
                //connection.release();
            });
    });
};

var getUserFollowed = function(req,res){
    //res.send(JSON.stringify(req.params));
    sqlConnector.getConnection(function(err,connection){
        connection.query("SELECT User.* FROM User,Follows WHERE User.Username = follows.FollowedUN AND FollowerUN = ?",[req.params.username]
            ,function(err,rows){
                connection.release();
                var resJSON={};
                if(rows.length==0){
                    resJSON.Error = req.params.username+" doesn't follow anyone yet";
                    resJSON.followed=null;
                }else{

                    resJSON.Error = null;
                    resJSON.followed = rows;
                }
                res.end(JSON.stringify(resJSON));
            });
    });
};



////////Mahmoud
var Login = function(req,res){
    sqlConnector.getConnection(function(err,connection){
        connection.query("SELECT Username,Type FROM User WHERE Username = ? and Password = ?",[req.body.username, req.body.password],function(err,rows) {
            var resJSON = {};
            if (rows.length == 0) {
                resJSON.Error = "User not found"
                res.end(JSON.stringify(resJSON));
                connection.release();
                return;
            }
            else {
                req.AdvanceCookie.username = rows[0].Username;
                req.AdvanceCookie.type = rows[0].Type;
                resJSON.Error = null;
                resJSON.User = rows[0];
                res.end(JSON.stringify(resJSON));
                connection.release();
            }
        });
    });
};

var Logout = function(req,res){
    var resJSON = {};
    if(!req.AdvanceCookie.username)
    {
        resJSON.Error = "You are not logged in";
        res.end(JSON.stringify(resJSON));
        return;
    }

    resJSON.Error = null;
    req.AdvanceCookie.reset();
    res.end(JSON.stringify(resJSON));

};

var authenticate = function(req,res){
    var resJSON = {username:null,type:null};
    if(req.AdvanceCookie.username) {
        resJSON.username = req.AdvanceCookie.username;
        resJSON.type = req.AdvanceCookie.type;
    }
    res.end(JSON.stringify(resJSON));
};



///////////Assem
var Follow = function(req,res){
    sqlConnector.getConnection(function(err,connection){
        var O ={};
        connection.query("Insert into Follows Values(?,?) ",[req.AdvanceCookie.username,req.params.username],function (err, rows) {
            O.Error=err;
            res.end(JSON.stringify(O) + "\n");
            connection.release();
        });
    });
};

var UnFollow = function(req,res){
    sqlConnector.getConnection(function(err,connection){
        var O ={};
        connection.query("Delete FROM Follows Where FollowerUN = ? AND FollowedUN = ? ",[req.AdvanceCookie.username,req.params.username],function (err, rows) {
            O.Error=err;
            res.end(JSON.stringify(O) + "\n");
            connection.release();
        });
    });
};

var PromoteUser = function (req,res){
    var O={};
    sqlConnector.getConnection(function(err,connection){
        connection.query("UPDATE USER SET Type = 1  Where Username = ? ",[req.params.username], function (err,rows) {
            O.Error=err;
            res.end(JSON.stringify(O) + "\n");
            connection.release();
        });
    });
};

var DemoteUser = function (req,res){
    var O={};
    sqlConnector.getConnection(function(err,connection){
        connection.query("UPDATE USER SET Type = 0  Where Username = ? ",[req.params.username],function (err,rows) {
            O.Error=err;
            res.end(JSON.stringify(O) + "\n");
            connection.release();
        });
    });
};

var StopUser = function (req,res){
    var O={};
    sqlConnector.getConnection(function(err,connection){
        connection.query("UPDATE USER SET Type = -1  Where Username = ? ",[req.params.username],function (err,rows) {
            O.Error=err;
            res.end(JSON.stringify(O) + "\n");
            connection.release();
        });
    });
};

var EditUserData = function (req,res){
    var O={};
    sqlConnector.getConnection(function(err,connection){
        connection.query("UPDATE USER SET FullName = ? , Password = ? , Email= ? , Image = ? , Gender = ? , Birthdate = ? Where Username = ?",[req.body.Fullname,req.body.Password,req.body.Email,req.body.Image,req.body.Gender,req.body.Birthdate,req.AdvanceCookie.username],function(err,rows){
            O.Error=err;
            res.end(JSON.stringify(O) + "\n");
            connection.release();
        });
    });
};

//Hamada
var sendMessage = function(req,res){
    sqlConnector.getConnection(function(err,connection){
        var O ={};
        connection.query("INSERT INTO message(Sender,Receiver,MessageText) VALUES(?,?,?) ",[req.body.sender,req.body.receiver,req.body.msgtext],function (err, rows) {
            O.Error=err;
            res.end(JSON.stringify(O) + "\n");
            connection.release();
        });
    });
};

var getUnreadMessages = function(req,res){
    sqlConnector.getConnection(function(err,connection){
        var O ={};
        connection.query("SELECT * FROM message WHERE Receiver = ? AND IsUnread = 1 ORDER BY ID DESC",[req.params.username],function (err, rows) {
            O.Error=err;
            O.unreadMessages = rows;
            O.a="1";
            res.end(JSON.stringify(O) + "\n");
            connection.query("UPDATE message SET IsUnread = 0 WHERE Receiver = ? AND IsUnread = 1",[req.params.username],function (err, rows) {
                connection.release();
            });
        });
    });
};

var getReadMessages = function(req,res){
    sqlConnector.getConnection(function(err,connection){
        var O ={};
        connection.query("SELECT * FROM message WHERE Receiver = ? AND IsUnread = 0 ORDER BY ID DESC",[req.params.username],function (err, rows) {
            O.Error=err;
            O.readMessages = rows;
            res.end(JSON.stringify(O) + "\n");
            connection.release();
        });
    });
};

var getUnreadMessagesCount = function(req,res){
    sqlConnector.getConnection(function(err,connection){
        var O ={};
        //res.end(JSON.stringify(err) + "\n");
        //return;
        connection.query("SELECT IFNULL(SUM(IsUnread),0) as count FROM message WHERE Receiver = ? AND IsUnread = 1",[req.params.username],function (err, rows) {
            O.Error=err;
            if(!err) {
                O.count = rows[0].count;
            }
            res.end(JSON.stringify(O) + "\n");
            connection.release();
        });
    });
};



module.exports = {
    //////////Hamada
    getUsers: getUsers,
    RegisterUser: RegisterUser,
    getUserData: getUserData,
    getUserLearningPaths:getUserLearningPaths,
    getUserFollowers:getUserFollowers,
    getUserFollowed:getUserFollowed,
    getRegisteredLearningPaths:getRegisteredLearningPaths,
    authenticate:authenticate,
    sendMessage:sendMessage,
    getUnreadMessages:getUnreadMessages,
    getReadMessages:getReadMessages,
    getUnreadMessagesCount:getUnreadMessagesCount,

    ////////Mahmoud
    Login:Login,
    Logout:Logout,

    //////Assem
    Follow:Follow,
    UnFollow:UnFollow,
    PromoteUser: PromoteUser,
    DemoteUser: DemoteUser,
    StopUser: StopUser,
    EditUserData: EditUserData
};