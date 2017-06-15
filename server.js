var express = require("express");

var bodyParser = require("body-parser");
var methodOverride = require("method-override");
var request = require("request");
var PORT = process.env.PORT || 3000;
var app = express();
var path = require("path");
const nodemailer = require('nodemailer');

// Serve static content for the app from the "public" directory in the application directory.
app.use(express.static(__dirname + "/public"));
// Sets up the Express app to handle data parsing
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.text());

// override with POST having ?_method=DELETE
app.use(methodOverride("_method"));
var exphbs = require("express-handlebars");

app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");


var routes = require("./routes/apiRoutes")(app);
var db = require("./models");


db.sequelize.sync().then(function() {
 app.listen(PORT, function() {
   console.log("App Listening on Port: "+ PORT);
 });



 // view engine setup
app.set('views', path.join(__dirname, 'views'));
//set up handlebars

app.engine('handlebars', exphbs({
    defaultLayout: 'main'
}));

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
//Configure public web folder
app.use('/assets', express.static(path.join(__dirname, 'public', 'assets')));


});
