var HTTPS = require('https');
var path = require('path');
var bot = {};

var botID = process.env.BOT_ID;

var botCommands = [];
var registerCommand = function(command, description, func) {
	botCommands[command] = [description, func];
};

//require all files in a folder
var normalizedPath = path.join(__dirname, "commands");
require("fs").readdirSync(normalizedPath).forEach(function (file) {
  if (path.extname(file) === '.js') {
    require("./commands/" + file)(registerCommand);
  }
});