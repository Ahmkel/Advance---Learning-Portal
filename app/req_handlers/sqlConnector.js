/**
 * Created by Ahmkel on 12/5/2015.
 */

//Create the connection
var mysql = require('mysql');

var dbConfig = {
    host:"eu-cdbr-azure-west-c.cloudapp.net",
    user:"b05c485a20f5f8",
    password:"fc3fd947",
    database:"Advance Project"
};

module.exports = mysql.createPool(dbConfig);