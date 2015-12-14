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
                return;
            }
            else{
                resJSON.ChUsers = rows;
                resJSON.Error = null;
                res.end(JSON.stringify(resJSON));
                connection.release();
            }
        });

    });
};


module.exports = {
    AddChallenge:AddChallenge,
    getChallenge: getChallenge,
    getChLP: getChLP,
    getChUsers: getChUsers,
}