/**
 * Created by Ahmkel on 12/4/2015.
 */

//Set up Express app
var app =require('express')();

//Setup routes
require('./myRouter').route(app);

//Start Server
app.listen(process.env.PORT||8080);