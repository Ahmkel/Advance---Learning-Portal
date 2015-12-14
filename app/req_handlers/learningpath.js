/**
 * Created by Mahmoud on 12/11/2015.
 */

var sqlConnector = require('./sqlConnector.js');

/*
var getLP = function(req,res) {
    sqlConnector.getConnection(function (err, connection) {
        var resJSON = {};
        connection.query("SELECT * FROM LearningPath where ID = ?",[req.params.id], function (err, rows) {
            if (rows.length == 0) {
                resJSON.Error = "LP not found";
                res.end(JSON.stringify(resJSON));
                connection.release();
            }
            else{
                resJSON.LP = rows[0];
                resJSON.Error = null;
                res.end(JSON.stringify(resJSON));
                connection.release();
            }
        });

    });
};
*/

var editPath = function(req,res){
    sqlConnector.getConnection(function(err,connection){
        var resJSON = {};
        connection.query("UPDATE LearningPath LP SET Title=? ,Description=?, Duration=?, Category=? WHERE ID = ?",[req.body.Title, req.body.Description, req.body.Duration, req.body.Category, req.params.id] ,function(err,rows){
            if(err)
            {
                resJSON.Error="Update Failed";
            }
            else
            {
                resJSON.Error=null;
            }
            res.end(JSON.stringify(resJSON))
            connection.release();
        });
    });
};

var getStep = function(req,res){
    sqlConnector.getConnection(function(err,connection){
        var resJSON = {};
        connection.query("SELECT Type FROM Resource WHERE LPID = ? and StepNo = ?",[req.body.lpid,req.body.stepno] ,function(err,rows){
            if(err)
            {
                resJSON.Error="Resource not found";
            }
            else
            {
                resJSON.Error=null;
                if(rows[0].Type == "Blog")
                {
                    connection.query("SELECT * FROM Blog WHERE LPID = ? and StepNo = ?",[req.body.lpid,req.body.stepno],function(err,rows){
                        resJSON.Step = rows[0];
                        resJSON.Type = "Blog";
                    })
                }
                else if (rows[0].Type = "Book") {
                    connection.query("SELECT * FROM Book WHERE LPID = ? and StepNo = ?", [req.body.lpid, req.body.stepno], function (err, rows) {
                        resJSON.Step = rows[0];
                        resJSON.Type = "Book";
                    })
                }
                else if (rows[0].Type = "Course") {
                    connection.query("SELECT * FROM Course WHERE LPID = ? and StepNo = ?", [req.body.lpid, req.body.stepno], function (err, rows) {
                        resJSON.Step = rows[0];
                        resJSON.Type = "Course";
                    })
                }
                else if (rows[0].Type = "Video") {
                    connection.query("SELECT * FROM Video WHERE LPID = ? and StepNo = ?", [req.body.lpid, req.body.stepno], function (err, rows) {
                        resJSON.Step = rows[0];
                        resJSON.Type = "Video";
                    })
                }
            }
            res.end(JSON.stringify(resJSON))
            connection.release();
        });
    });
}

var addBlog = function(req,res){
    sqlConnector.getConnection(function(err,connection){
        connection.query("INSERT INTO Resource VALUES (?, ?, ?, ?, ?, '1')",[req.body.lp,req.body.StepNo,req.body.title,req.body.desc,req.body.link],function(err,rows) {
            if(err){
                res.end(JSON.stringify(err));
                connection.release();
                return;
            }
        });
        connection.query("INSERT INTO Blog VALUES (?,?,?)",[req.body.lp,req.body.StepNo,req.body.blogger], function(err,rows){
            res.end(JSON.stringify({Error:null}));
            connection.release();
        });
    });
};

var addBook = function(req,res){
    sqlConnector.getConnection(function(err,connection){
        var StepNo = 0;
        connection.query("SELECT FROM Resource WHERE LPID = ?",[req.body.lp],function(err,rows){
            StepNo = rows.length + 1;
        });
        connection.query("INSERT INTO Resource VALUES (?, ?, ?, ?, ?, 1)",[req.body.lp,StepNo,req.body.title,req.body.desc,req.body.link],function(err,rows) {
        });
        connection.query("INSERT INTO Book VALUES(?,?,?,?,?,?)",[req.body.lp,StepNo,req.body.author, req.body.pno, req.body.duration, req.body.Price], function(err,rows){
            connection.release();
            res.redirect('/');
        });
    });
};

var addVideo = function(req,res){
    sqlConnector.getConnection(function(err,connection){
        var StepNo = 0;
        connection.query("SELECT FROM Resource WHERE LPID = ?",[req.body.lp],function(err,rows){
            StepNo = rows.length + 1;
        });
        connection.query("INSERT INTO Resource VALUES (?, ?, ?, ?, ?, 2)",[req.body.lp,StepNo,req.body.title,req.body.desc,req.body.link],function(err,rows) {
        });
        connection.query("INSERT INTO Video VALUES(?,?,?,?)",[req.body.lp,StepNo,req.body.uploader, req.body.duration], function(err,rows){
            connection.release();
            res.redirect('/');
        });
    });
};


var NoOfSteps = function(req,res){
    sqlConnector.getConnection(function(err,connection){
        connection.query("SELECT MAX(StepNo) M FROM Resource WHERE LPID = ?",[req.params.id],function(err,rows){
            res.end(JSON.stringify({NO:(rows[0].M + 1)}));
            connection.release();
          });
    });
};

/////////Kahla
var addLP = function(req,res){
    sqlConnector.getConnection(function(err,connection){
        resJSON = {};
        var d = new Date();
        var date = d.getFullYear()+"-"+(d.getMonth()+1)+"-"+d.getDate();
        connection.query("INSERT into LearningPath(Title,Description,Duration,Category,CreatorUser,CreationDate) values(?,?,?,?,?,?)",[req.body.Title, req.body.Description, req.body.Duration, req.body.Category, req.body.CreatorUser,
            date] ,function(err,rows){
            resJSON.Error=err;
            res.end(JSON.stringify(resJSON));
            connection.release();
        });
    });
};

var DeletePath = function(req,res){
    sqlConnector.getConnection(function(err,connection){

        connection.query("Delete from LearningPath where LearningPath.ID = ?",[req.body.LPID] ,function(err,rows){
            res.redirect("/");
            connection.release();
        });
    });
};

var getSteps = function(req,res) {
    sqlConnector.getConnection(function (err, connection) {
        var resJSON = {};
        connection.query("SELECT * FROM Resource where LPID = ?",[req.params.id], function (err, rows) {
            if (err) {
                res.end(JSON.stringify(err));
                return;
                resJSON.Error = "No resources";
                res.end(JSON.stringify(resJSON));
                connection.release();
            }
            else{
                resJSON.Steps = rows;
                resJSON.Error = null;
                res.end(JSON.stringify(resJSON));
                connection.release();
            }
        });

    });
};


var getLP = function(req,res) {
    sqlConnector.getConnection(function (err, connection) {
        var resJSON = {};
        connection.query("SELECT * FROM LearningPath where ID = ?",[req.params.id], function (err, rows) {
            if (err) {
                res.end(JSON.stringify(err));
                return;
            }
            else{
                resJSON.LP = rows[0];
                resJSON.Error = null;
                res.end(JSON.stringify(resJSON));
                connection.release();
            }
        });

    });
};

var getLPUsers = function(req,res){
    sqlConnector.getConnection(function(err,connection){
        var resJSON = {};
        connection.query("SELECT R.Username,Email,Type FROM User U,RegistersLP R where R.Username=U.Username and R.LPID=?",[req.params.id],function(err,rows){
            if (err) {
                res.end(JSON.stringify(err));
                return;
                res.end(JSON.stringify(resJSON));
                connection.release();
            }
            else{
                resJSON.Users = rows;
                resJSON.Error = null;
                res.end(JSON.stringify(resJSON));
                connection.release();
            }
        });
    });
};

var getLpComments = function(req,res){
    sqlConnector.getConnection(function(err,connection){
        var resJSON = {};
        connection.query("SELECT CO.Username,C.Text from Comment C,CommentsOn CO where CO.CID = C.ID and CO.LPID =?",[req.params.id],function(err,rows){
            if (err) {
                res.end(JSON.stringify(err));
                return;
            }
            else{
                resJSON.Comments = rows;
                resJSON.Error = null;
                res.end(JSON.stringify(resJSON));
                connection.release();
            }
        });
    });
};

var getLpVotes = function(req,res){
    sqlConnector.getConnection(function(err,connection){
        var resJSON = {};
        connection.query("SELECT sum(Type) as Votes from VotesLP where LPID = ?",[req.params.id],function(err,rows){
            if (err) {
                res.end(JSON.stringify(err));
                return;
            }
            else{
                resJSON.Votes = rows[0];
                resJSON.Error = null;
                res.end(JSON.stringify(resJSON));
                connection.release();
            }
        });
    });
};

var getLpChallenges = function(req,res){
    sqlConnector.getConnection(function(err,connection){
        var resJSON = {};
        connection.query("SELECT C.* from ChallengeAssociatedLP L,Challenge C where L.LPID = ? and C.Title=L.ChallengeTitle ",[req.params.id],function(err,rows){
            if (err) {
                res.end(JSON.stringify(err));
                return;
            }
            else{
                resJSON.Challenges = rows;
                resJSON.Error = null;
                res.end(JSON.stringify(resJSON));
                connection.release();
            }
        });
    });
};

var registerLP = function(req,res){
    sqlConnector.getConnection(function(err,connection){
        var resJSON = {Error:null};
        var d = new Date();
        var date = d.getFullYear()+"-"+(d.getMonth()+1)+"-"+d.getDate();
        connection.query("INSERT INTO registerslp VALUES(?,?,?) ",[req.body.username,req.body.lpid,date],function(err,rows){
            if (err) {
                resJSON.Error=err;
            }
            res.end(JSON.stringify(resJSON));
        });
    });
};

var unregisterLP = function(req,res){
    sqlConnector.getConnection(function(err,connection){
        var resJSON = {Error:null};
        var d = new Date();
        var date = d.getFullYear()+"-"+(d.getMonth()+1)+"-"+d.getDate();
        connection.query("DELETE FROM registerslp WHERE Username = ? AND LPID = ? ",[req.body.username,req.body.lpid],function(err,rows){
            if (err) {
                resJSON.Error=err;
            }
            res.end(JSON.stringify(resJSON));
        });
    });
};

var addComment = function (req,res) {
    sqlConnector.getConnection(function (err,connection) {
        var resJSON={};
        connection.query("Insert into Comment(Text) values(?);",[req.body.Text],function(err){
            resJSON.Error1 = err;
        });
        connection.query("Select ID from Comment where Text = ?",[req.body.Text],function(err,rows){
            resJSON.CID=rows[0].ID;
            resJSON.Error2 = err;

            connection.query("Insert into CommentsOn values(?,?,?)", [req.AdvanceCookie.username,req.params.id,resJSON.CID], function (err) {
                resJSON.Error3=err;
                res.end(JSON.stringify(resJSON));
                connection.release();
            });
        });
    });
};

module.exports = {
    /////////Mahmoud
    getLP: getLP,
    editPath: editPath,
    getStep:getStep,
    editPath:editPath,
    addBlog:addBlog,
    addBook: addBook,
    addVideo: addVideo,
    NoOfSteps:NoOfSteps,

    //////Kahla
    addLP: addLP,
    DeletePath: DeletePath,
    getSteps: getSteps,
    getLP: getLP,
    getLPUsers: getLPUsers,
    getLpComments: getLpComments,
    getLpVotes: getLpVotes,
    getLpChallenges: getLpChallenges,
    addComment: addComment,

    //////Hamada
    registerLP:registerLP,
    unregisterLP:unregisterLP
};