/**
 * Created by Ahmkel on 12/5/2015.
 */

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

module.exports = {
    getUsers: getUsers
}