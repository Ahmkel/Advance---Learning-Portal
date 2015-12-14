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

var addCourse = function (req,res) {
    sqlConnector.getConnection(function(err,connection){
        connection.query("SELECT MAX(StepNo) MaxStepNo FROM resource WHERE LPID = ?",[req.body.lpid],function(err,rows){
            var NewStepNo = rows[0].MaxStepNo + 1;
            connection.query("INSERT INTO resource VALUES (?, ?, ?, ?, ?, '4')",[req.body.lpid,NewStepNo,req.body.title,req.body.desc,req.body.link]);
            connection.query("INSERT INTO course VALUES (?, ?, ?, ?, ?)",[req.body.lpid,NewStepNo,req.body.provider,req.body.duration,req.body.price]
                ,function(err,rows){
                    res.end(JSON.stringify({"err":err}));
                    connection.release();
            });
        });
    });
};

var addBook = function (req,res) {
    sqlConnector.getConnection(function(err,connection){
        connection.query("SELECT MAX(StepNo) MaxStepNo FROM resource WHERE LPID = ?",[req.body.lpid],function(err,rows){
            var NewStepNo = rows[0].MaxStepNo + 1;
            connection.query("INSERT INTO resource VALUES (?, ?, ?, ?, ?, '1')",[req.body.lpid,NewStepNo,req.body.title,req.body.desc,req.body.link]);
            connection.query("INSERT INTO book VALUES(?,?,?,?,?)",[req.body.lpid,NewStepNo,req.body.author,req.body.pno,req.body.price]
                ,function(err,rows){
                    res.end(JSON.stringify({"err":err}));
                    connection.release();
            });
        });
    });
};

var addVideo = function (req,res) {
    sqlConnector.getConnection(function(err,connection){
        connection.query("SELECT MAX(StepNo) MaxStepNo FROM resource WHERE LPID = ?",[req.body.lpid],function(err,rows){
            var NewStepNo = rows[0].MaxStepNo + 1;
            connection.query("INSERT INTO resource VALUES (?, ?, ?, ?, ?, '2')",[req.body.lpid,NewStepNo,req.body.title,req.body.desc,req.body.link]);
            connection.query("INSERT INTO video VALUES(?,?,?,?)",[req.body.lpid,NewStepNo,req.body.uploader, req.body.duration]
                ,function(err,rows){
                    res.end(JSON.stringify({"err":err}));
                    connection.release();
            });
        });
    });
};

var addBlog = function (req,res) {
    sqlConnector.getConnection(function(err,connection){
        connection.query("SELECT MAX(StepNo) MaxStepNo FROM resource WHERE LPID = ?",[req.body.lpid],function(err,rows){
            var NewStepNo = rows[0].MaxStepNo + 1;
            connection.query("INSERT INTO resource VALUES (?, ?, ?, ?, ?, '3')",[req.body.lpid,NewStepNo,req.body.title,req.body.desc,req.body.link]);
            connection.query("INSERT INTO blog VALUES (?,?,?)",[req.body.lpid,NewStepNo,req.body.blogger]
                ,function(err,rows){
                    res.end(JSON.stringify({"err":err}));
                    connection.release();
            });
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
        connection.query("SELECT CO.Username,C.Text from Comment C,CommentsOn CO where CO.CID = C.ID and CO.LPID =? ORDER BY C.ID DESC",[req.params.id],function(err,rows){
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

var removeLP = function (req,res) {
    sqlConnector.getConnection(function(err,connection){
        var resJSON = {Error:null};
        connection.query("DELETE c FROM comment c JOIN commentson con on c.id = con.cid JOIN learningpath lp on lp.id = con.lpid WHERE lp.id= ?",[req.params.id]);
        connection.query("DELETE FROM learningpath WHERE ID = ? ",[req.params.id],function(err,rows){
            if (err) {
                resJSON.Error=err;
            }
            res.end(JSON.stringify(resJSON));
        });
    });
};

var deleteStep = function(req,res){
    sqlConnector.getConnection(function(err,connection){
        connection.query("SELECT MAX(StepNo) MaxStepNo FROM resource WHERE LPID = ?",[req.body.lpid],function(err,rows){
            var MaxStepNo = rows[0].MaxStepNo;
            connection.query("Delete From resource where lpid = ? and stepno = ?",[req.body.lpid,req.body.stepno]);
            for(var i = req.body.stepno + 1;i<MaxStepNo;i++){
                connection.query("UPDATE resource SET stepno = ? where lpid = ? and stepno = ?",[i-1,req.body.lpid,i]);
            }
            connection.query("UPDATE resource SET stepno = ? where lpid = ? and stepno = ?",[MaxStepNo-1,req.body.lpid,MaxStepNo], function (err) {
                res.end(JSON.stringify({err:err}));
                connection.release();
            });

        });
    });
};

var swapSteps = function (req,res) {
    sqlConnector.getConnection(function(err,connection){
        connection.query("UPDATE resource SET stepno = 0 where lpid = ? and stepno = ?",[req.body.lpid,req.body.stepno1]);
        connection.query("UPDATE resource SET stepno = ? where lpid = ? and stepno = ?",[req.body.stepno1,req.body.lpid,req.body.stepno2]);
        connection.query("UPDATE resource SET stepno = ? where lpid = ? and stepno = 0",[req.body.stepno2,req.body.lpid]
            ,function(err){
                res.end(JSON.stringify({err:err}));
                connection.release();
            });
    });
}

///////Kahla
var addComment = function (req,res) {
    sqlConnector.getConnection(function (err,connection) {
        var resJSON={};
        connection.query("Insert into Comment(Text) values(?);",[req.body.Text],function(err){
            resJSON.Error1 = err;
        });
        connection.query("Select MAX(ID) as CID from Comment",function(err,rows){
            resJSON.CID=rows[0].CID;
            resJSON.Error2 = rows;

            connection.query("Insert into CommentsOn values(?,?,?)", [req.AdvanceCookie.username,req.params.id,resJSON.CID], function (err) {
                resJSON.Error3=err;
                res.end(JSON.stringify(resJSON));
                connection.release();
            });
        });
    });
};



/////////Assem
var SearchLPbyName = function(req,res){
    sqlConnector.getConnection(function(err,connection){
        connection.query("SELECT L.Title, L.Category, L.Duration, L.CreatorUser, L.CreationDate, Sum(V.Type) FROM LearningPath L, VotesLP V WHERE Name like '%" + req.params.name + "&' GROUP BY L.Title, L.Category, L.Duration, L.CreatorUser, L.CreationDate",function(err,rows){
            res.end(JSON.stringify(LPS = rows)+'\n');
        });
    });
};

var SearchLPbyCat = function(req,res){
    sqlConnector.getConnection(function(err,connection){
        connection.query("SELECT L.Title, L.Category, L.Duration, L.CreatorUser, L.CreationDate, Sum(V.Type) FROM LearningPath L, VotesLP V WHERE Category = '" + req.params.name + "' GROUP BY L.Title, L.Category, L.Duration, L.CreatorUser, L.CreationDate",function(err,rows){
            res.end(JSON.stringify(LPS = rows)+'\n');
        });
    });
};

module.exports = {
    /////////Mahmoud
    editPath: editPath,
    getStep:getStep,
    addCourse:addCourse,
    addBook: addBook,
    addVideo: addVideo,
    addBlog:addBlog,
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
    unregisterLP:unregisterLP,
    removeLP:removeLP,
    deleteStep:deleteStep,
    swapSteps:swapSteps,

    ///////Assem
    SearchLPbyName: SearchLPbyName,
    SearchLPbyCat: SearchLPbyCat
};