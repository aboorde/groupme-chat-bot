module.exports = function (registerCommand) {
  registerCommand('time', 'time: Get the current time', function (callback) {
    callback('The current time is ' + (new Date()).toString());
  });
};