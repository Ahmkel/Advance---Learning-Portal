/**
 * Created by Mahmoud on 12/11/2015.
 */

var sqlConnector = require('./sqlConnector.js');


var AddChallenge = function(req,res){
    sqlConnector.getConnection(function(err,connection){
        var resJSON = {};
        connection.query("INSERT INTO Challenge VALUES (?, ?, ?, ?)",[req.body.title,req.body.desc,req.body.price,req.body.diff],function(err,rows){
            if(err)
            {
                resJSON.Error = "Challenge already exists";
                res.end(JSON.stringify(resJSON));
                return;
            }
            resJSON.Error = null;
            res.end(JSON.stringify(resJSON));
            connection.release();
        });
    });
};

////////Kahla

var getChallenge = function(req,res){
    sqlConnector.getConnection(function (err, connection) {
        var resJSON = {};
        connection.query("SELECT * FROM Challenge where Title = ?",[req.body.Title], function (err, rows) {
            resJSON.Challenge = rows[0];
            resJSON.Error = null;
            res.end(JSON.stringify(resJSON));
            connection.release();
        });

    });
};

var getChLP = function (req,res){
    sqlConnector.getConnection(function (err, connection) {
        var resJSON = {};
        connection.query("SELECT L.* FROM LearningPath L,ChallengeAssociatedLP C where C.LPID = L.ID and C.ChallengeTitle = ?",[req.body.Title], function (err, rows) {
            if(err) {
                res.end(JSON.stringify(err));
                return;
            }
            else{
                resJSON.ChLP = rows;
                resJSON.Error = null;
                res.end(JSON.stringify(resJSON));
                connection.release();
            }
        });

    });
};

var getChUsers = function (req,res){
    sqlConnector.getConnection(function (err, connection) {
        var resJSON = {};
        connection.query("SELECT U.* FROM User U,ParticipatesChallenge P where P.Username = U.Username and P.ChallengeTitle = ?",[req.body.Title], function (err, rows) {
            if(err) {
                res.end(JSON.stringify(err));
            } else {
                resJSON.ChUsers = rows;
                resJSON.Error = null;
                res.end(JSON.stringify(resJSON));
                connection.release();
            }
        });

    });
};

var getAllChallenges= function (req,res){
    sqlConnector.getConnection(function(err,connection){
        connection.query("SELECT * FROM challenge",function(err,rows) {
            res.end(JSON.stringify({}.Challenges = rows) + "\n");
            connection.release();
        });
    });
};

var registerChallenge = function(req,res){
    sqlConnector.getConnection(function(err,connection){
        var resJSON = {Error:null};
        var d = new Date();
        var date = d.getFullYear()+"-"+(d.getMonth()+1)+"-"+d.getDate();
        connection.query("INSERT INTO participateschallenge VALUES(?,?,0) ",[req.body.username,req.body.challengeTitle],function(err,rows){
            if (err) {
                resJSON.Error=err;
            }
            res.end(JSON.stringify(resJSON));
        });
    });
};

var unregisterChallenge = function(req,res){
    sqlConnector.getConnection(function(err,connection){
        var resJSON = {Error:null};
        var d = new Date();
        var date = d.getFullYear()+"-"+(d.getMonth()+1)+"-"+d.getDate();
        connection.query("DELETE FROM participateschallenge WHERE Username = ? AND ChallengeTitle = ? ",[req.body.username,req.body.challengeTitle],function(err,rows){
            if (err) {
                resJSON.Error=err;
            }
            res.end(JSON.stringify(resJSON));
        });
    });
};

var removeChallenge = function (req,res) {
    sqlConnector.getConnection(function(err,connection){
        var resJSON = {Error:null};
        connection.query("DELETE FROM challenge WHERE Title = ? ",[req.params.challengeTitle],function(err,rows){

            if (err) {
                resJSON.Error=err;
            }
            res.end('sds');
        });
    });
};

module.exports = {
    AddChallenge:AddChallenge,
    getChallenge: getChallenge,
    getChLP: getChLP,
    getChUsers: getChUsers,
    getAllChallenges:getAllChallenges,
    registerChallenge:registerChallenge,
    unregisterChallenge:unregisterChallenge,
    removeChallenge:removeChallenge
}