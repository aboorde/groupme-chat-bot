/*eslint-env node*/

//------------------------------------------------------------------------------
// node.js starter application for Bluemix
//------------------------------------------------------------------------------

// This application uses express as its web server
// for more info, see: http://expressjs.com
//var express = require('express');

// cfenv provides access to your Cloud Foundry environment
// for more info, see: https://www.npmjs.com/package/cfenv
var cfenv = require('cfenv');

// create a new express server
//var app = express();

//create vars for bot
var http = require('http');
var director = require('director');
var cool = require('cool-ascii-faces');

//Firebase

var bot = require('./bot.js');


var router = new director.http.Router({
  '/' : {
    post: bot.respond,
    get: ping
  }
});

var server = http.createServer(function (req, res) {
  req.chunks = [];
  req.on('data', function (chunk) {
    req.chunks.push(chunk.toString());
});

router.dispatch(req, res, function(err) {
    res.writeHead(err.status, {"Content-Type": "text/plain"});
    res.end(err.message);
  });
});

var appEnv = cfenv.getAppEnv();

var port = Number(process.env.PORT || 5000);
//var port = appEnv.port;
server.listen(port);

function ping() {
  this.res.writeHead(200);
  this.res.end("Hey, I'm Cool Guy.");
}
// serve the files out of ./public as our main files
/*app.use(express.static(__dirname + '/public'));

// GET method route
app.get('/', function (req, res) {
  res.send('GET request to the homepage');
});

// POST method route
app.post('/', function (req, res) {
  res.send('POST request to the homepage');
});*/

// get the app environment from Cloud Foundry


// start server on the specified port and binding host
/*app.listen(appEnv.port, '0.0.0.0', function() {
  // print a message when the server starts listening
  console.log("server starting on " + appEnv.url);
});*/
