/**
 * Created by Ahmkel on 12/4/2015.
 *
 * This is a module that containts all user related request handlers
 *
 */

//Manage requires
var users = require('./users.js');

//Export module functions
module.exports = {
    getUsers: users.getUsers
};