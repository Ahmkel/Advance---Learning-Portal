/**
 * Created by Ahmkel on 12/5/2015.
 */



    ////////////Hamada

var express = require('express');
var sessions = require('client-sessions');
var req_handlers = require("./../req_handlers");
var path = require('path');
var bodyParser = require('body-parser');

module.exports.route = function(app){
    //Setup session handling using cookies
    app.use(sessions({
        cookieName:"AdvanceCookie",
        secret:"adamncioeuqwkjsad"
    }));

    //Handle responding with static pages
    app.use(express.static("./../static"));

    app.use(bodyParser.json());

    //Routes
    //////////////Hamada
    app.get("/GetUsers", req_handlers.getUsers);
    app.post("/RegisterUser",req_handlers.RegisterUser);
    app.get("/GetUserData/:username",req_handlers.getUserData);
    app.get("/GetUserLearningPaths/:username",req_handlers.getUserLearningPaths);
    app.get("/GetUserFollowers/:username",req_handlers.getUserFollowers);
    app.get("/GetUserFollowed/:username",req_handlers.getUserFollowed);
    app.get("/GetRegisteredLearningPaths/:username",req_handlers.getRegisteredLearningPaths);
    app.get("/authenticate",req_handlers.authenticate);
    app.post("/registerLP",req_handlers.registerLP);
    app.post("/unregisterLP",req_handlers.unregisterLP);
    app.delete("/removeLP/:id",req_handlers.removeLP);
    app.post("/deleteStep",req_handlers.deleteStep);
    app.post("/swapSteps",req_handlers.swapSteps);
    app.post("/checkUserVoteLP",req_handlers.checkUserVoteLP);
    app.post("/voteLP",req_handlers.voteLP);
    app.post("/getResourceData",req_handlers.getResourceData);
    app.post("/sendMessage",req_handlers.sendMessage);
    app.get("/getUnreadMessages/:username",req_handlers.getUnreadMessages);
    app.get("/getReadMessages/:username",req_handlers.getReadMessages);
    app.get("/getUnreadMessagesCount/:username",req_handlers.getUnreadMessagesCount);
    app.post("/registerChallenge",req_handlers.registerChallenge);
    app.post("/unregisterChallenge",req_handlers.unregisterChallenge);
    app.delete("/removeChallenge/:challengeTitle",req_handlers.removeChallenge);


    ///////////Mahmoud
    app.get("/Logout",req_handlers.Logout);
    app.post("/AddChallenge",req_handlers.AddChallenge);
    app.get("/GetLP/:id",req_handlers.GetLP);
    app.post("/EditLP/:id",req_handlers.EditLP);
    app.post("/AddCourse",req_handlers.addCourse);
    app.post("/AddBook",req_handlers.addBook);
    app.post("/AddVideo",req_handlers.addVideo);
    app.post("/AddBlog",req_handlers.addBlog);
    app.get("/NoOfSteps/:id",req_handlers.NoOfSteps);
    app.post("/Login",req_handlers.Login);


    //////////Kahla
    app.post("/addLP",req_handlers.addLP);
    app.get("/getSteps/:id",req_handlers.getSteps);
    app.get("/GetLPUsers/:id",req_handlers.getLPUsers);
    app.get("/GetLpComments/:id",req_handlers.getLpComments);
    app.get("/GetLpVotes/:id",req_handlers.getLpVotes);
    app.get("/GetLpChallenges/:id",req_handlers.getLpChallenges);
    app.post("/GetChallenge",req_handlers.getChallenge);
    app.post("/GetChLP",req_handlers.getChLP);
    app.post("/GetChUsers",req_handlers.getChUsers);
    app.post("/addComment/:id",req_handlers.addComment);
    app.post("/addLPtoCh/:id",req_handlers.addLPtoCh);
    app.get("/getCh", req_handlers.getCh);
    app.post("/removeCh/:id",req_handlers.removeLPChallenge);

    //////////Assem
    app.get("/Follow/:username",req_handlers.Follow);
    app.get("/UnFollow/:username1",req_handlers.UnFollow);
    app.post("/SearchLPbyName",req_handlers.SearchLPbyName);
    app.get("/SearchLPbyCat",req_handlers.SearchLPbyCat);
    app.get("/PromoteUser/:username",req_handlers.PromoteUser);
    app.get("/DemoteUser/:username",req_handlers.DemoteUser);
    app.post('/ReportLP/:id',req_handlers.ReportLP);
    app.get("/GetReports/:id",req_handlers.getReports);
    app.get("/StopUser/:username",req_handlers.StopUser);
    app.post("/EditUserData",req_handlers.EditUserData);
    app.get("/getAllChallenges",req_handlers.getAllChallenges);
    app.get("/GetAllReports",req_handlers.GetAllReports);

    //////Hamada
    app.get("*",function(req,res){
        res.sendFile('/index.html',{root: "./../static"});
    });

};