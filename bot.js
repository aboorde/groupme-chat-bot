var HTTPS = require('https');
var cool = require('cool-ascii-faces');
var path = require('path');
var glob = require('glob');

//require all files in botCommands/
var requireDir = require('require-dir');
var dir = requireDir('./botCommands');

//calls about()
/*dir.about();*/

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
console.log(commands);

//this works
/*function testFxn() {
	console.log("I WORKED BITCH");
}

var testVar = "testFxn";
eval(testVar)();
*/


function respond() {
	var request = JSON.parse(this.req.chunks[0]).toLowerCase();
	//botRegex = /^Tell me a joke$/;

	/*for(var command in commands) {

	};*/

	if(request.text && botRegex.test(request.text)) {
		this.res.writeHead(200);
		postMessage();
		this.res.end();
	} else {
		console.log("dont care!?!");
		this.res.writeHead(200);
		this.res.end();
	}
}

function postMessage() {
	
	var botResponse = "Why can't the Atlanta Braves use the internet?  Because they can't get 3 W's in a row.";

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