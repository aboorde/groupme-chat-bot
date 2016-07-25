var HTTPS = require('https');
var cool = require('cool-ascii-faces');
var path = require('path');
var glob = require('glob');

var firebase = require("firebase");

var about = require('./botCommands/about.js');
var nothing = require('./botCommands/nothing.js');

//init Firebase
firebase.initializeApp({
  serviceAccount: "firebaseAccountCreds.json",
  databaseURL: "https://groupme-chat-bot.firebaseio.com"
});

var db = firebase.database();
var ref = db.ref("messages");


//require all files in botCommands/
/*var requireDir = require('require-dir');
var dir = requireDir('./botCommands');
*/
//calls about()
//about();

//sets bot ID defined in manifest.yml
var botID = process.env.BOT_ID;

//define pattern for folder of commands
var pattern = "botCommands/*.js";
console.log(pattern);
// extract "folder/file.js" from pattern into array
var commands = glob.sync(pattern);
console.log(commands);

// loop through existing commands and remove unneeded text
console.log("Commands:");
for(var command in commands) {
	commands[command] = commands[command].replace('botCommands', '');
	commands[command] = commands[command].replace('.js', '');
	console.log(commands[command]);
};
console.log(commands[0]);
/*
var testString = 'about';
var evalStore = eval(testString)();
console.log(evalStore);
*/
/*
var testReq = "/about";
console.log(testReq);
if(commands[0].text == testReq.text) {console.log("It is equal");};
*/
//this works
/*
function testFxn() {
	console.log("I WORKED BITCH");
}
var testVar = "testFxn";
eval(testVar)();
*/
//
//var botRegex = /^Tell me a joke$/;
function respond() {
	var request = JSON.parse(this.req.chunks[0]);
	//botRegex = /^Tell me a joke$/;
	ref.push({
		"created_at": request.created_at,
		"id": request.id,
		"name": request.name,
		"sender_type": request.sender_type,
		"text": request.text
	});
	var evalRes = '';
	for(var command in commands) {
		var cmdName = commands[command];
		var botRegex = new RegExp('^' + cmdName + '$');
		if(request.text && botRegex.test(request.text)) {
			cmdName = cmdName.replace('/', '');
			evalRes = eval(cmdName)();
			this.res.writeHead(200);
			postMessage(evalRes);
			this.res.end();
		} else {
			console.log("dont care!?!");
			this.res.writeHead(200);
			this.res.end();
			/**/
		}
	};

	/*if(request.text && botRegex.test(request.text)) {
		this.res.writeHead(200);
		postMessage();
		this.res.end();
	} else {
		console.log("dont care!?!");
		this.res.writeHead(200);
		this.res.end();
	}*/
}

function postMessage(evalRes) {
	
	var botResponse = evalRes;

	var options = {
		hostname: 'api.groupme.com',
		path: '/v3/bots/post',
		method: 'POST'
	};

	var body = {
		"bot_id": botID,
		"text": botResponse
	};

	console.log('sending' + botResponse + ' to ' + botID);

	var botReq = HTTPS.request(options, function(res) {
		if(res.statusCode == 202) {
			//cool
		} else {
			console.log('rejecting bad code get it together' + res.statusCode);
		}
	});

	botReq.on('error', function(err) {
		console.log('error posting messrge ' + JSON.stringify(err));
	});
	botReq.on('timeout', function(err) {
		console.log('timeout posting merssge ' + JSON.stringify(err));
	});
	botReq.end(JSON.stringify(body));
}

exports.respond = respond;