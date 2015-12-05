/**
 * Created by Ahmkel on 12/5/2015.
 */

var express = require('express');
var sessions = require('client-sessions');
var req_handlers = require("./../req_handlers");

module.exports.route = function(app){
    //Setup session handling using cookies
    app.use(sessions({
        cookieName:"AdvanceCookie",
        secret:"adamncioeuqwkjsad"
    }));

    //Handle responding with static pages
    app.use(express.static("./../static"));

    //Routes
    app.get("/GetUsers", req_handlers.getUsers);
};