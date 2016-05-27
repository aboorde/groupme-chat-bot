var HTTPS = require('https');
var cool = require('cool-ascii-faces');

var botID = process.env.BOT_ID;

function respond() {
	var request = JSON.parse(this.req.chunks[0]),
		botRegex = /^\/cool guy$/;

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
	
	var botResponse = cool();

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