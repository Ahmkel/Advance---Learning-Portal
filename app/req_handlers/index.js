/**
 * Created by Ahmkel on 12/4/2015.
 *
 * This is a module that containts all user related request handlers
 *
 */

//Manage requires
////////Hamada
var users = require('./users.js');

//////////Mahmoud
var challenge = require('./challenge.js');
var learningpath = require('./learningpath.js');


//Export module functions
module.exports = {
    //////////Hamada
    getUsers: users.getUsers,
    RegisterUser: users.RegisterUser,
    getUserData:users.getUserData,
    getUserLearningPaths:users.getUserLearningPaths,
    getUserFollowers:users.getUserFollowers,
    getUserFollowed:users.getUserFollowed,
    getRegisteredLearningPaths:users.getRegisteredLearningPaths,
    authenticate:users.authenticate,
    registerLP:learningpath.registerLP,
    unregisterLP:learningpath.unregisterLP,
    removeLP:learningpath.removeLP,
    deleteStep:learningpath.deleteStep,
    swapSteps:learningpath.swapSteps,
    checkUserVoteLP:learningpath.checkUserVoteLP,
    voteLP:learningpath.voteLP,
    getResourceData:learningpath.getResourceData,


    //////Mahmoud
    Login: users.Login,
    Logout: users.Logout,
    AddChallenge: challenge.AddChallenge,
    GetLP: learningpath.getLP,
    EditLP:learningpath.editPath,
    addCourse:learningpath.addCourse,
    addBook:learningpath.addBook,
    addVideo:learningpath.addVideo,
    addBlog:learningpath.addBlog,
    NoOfSteps:learningpath.NoOfSteps,

    ///////Kahla
    addLP: learningpath.addLP,
    getSteps: learningpath.getSteps,
    getLP: learningpath.getLP,
    getLPUsers: learningpath.getLPUsers,
    getLpComments: learningpath.getLpComments,
    getLpVotes: learningpath.getLpVotes,
    getLpChallenges: learningpath.getLpChallenges,
    getChallenge: challenge.getChallenge,
    getChLP: challenge.getChLP,
    getChUsers: challenge.getChUsers,
    addComment: learningpath.addComment,

    //Assem
    Follow: users.Follow,
    UnFollow: users.UnFollow,
    SearchLPbyName:learningpath.SearchLPbyName,
    SearchLPbyCat:learningpath.SearchLPbyCat
};