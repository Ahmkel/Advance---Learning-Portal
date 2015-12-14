/**
 * Created by Ahmkel on 12/5/2015.
 */

//////////Hamada

//Get the sqlConnecor object
var sqlConnector = require('./sqlConnector.js');

//User based requests handlers

var getUsers = function(req,res){
    sqlConnector.getConnection(function(err,connection){
        connection.query("SELECT * FROM User",function(err,rows){
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
        connection.query("SELECT * FROM User WHERE Username = ?",[req.params.username]
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
        connection.query("SELECT * FROM User WHERE Username = ? and Password = ?",[req.body.username, req.body.password],function(err,rows) {
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
    ////////Mahmoud
    Login:Login,
    Logout:Logout
};