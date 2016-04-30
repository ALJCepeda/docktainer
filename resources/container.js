var Promise = require("promise");
var Command = require("./command");
var cp = require("child_process");

/*
	args - DockerArguments - Startup info for docker container
*/
var Docktainer = function(args) {
	this.id = "";
	this.pid = 0;
	this.args = args || {};
	this.command = "";

	this.process;
};

Docktainer.prototype.run = function(image, tag, cmd, expose) {
	if(this.isRunning() === true) {
		return false;
	} else {
		var commander = new Command("run", image, tag);
		this.command = commander.generate(cmd, this.args);

		this.exec(this.command, expose).then(function(result) {
			console.log(result.stdout);
		}).catch(function(result) {
			console.log(result.error);
		});
	}
};

Docktainer.prototype.isRunning = function() {
	if(this.pid === 0 || this.name === "") {
		//Container was never assigned a name, cannot be running
		return false;
	} else {
		//Run command to see if it's running

		return true;
	}
};

Docktainer.prototype.exec = function(command, expose) {
	//Execute docker command
	var promise = new Promise(function(resolve, reject) {

		this.process = cp.exec(command, function(error, stdout, stderr) {
			if(error && error.kill === true) {
				reject({ error:error, stdout:stdout, stderr:stderr, command:command });
			} else {
				resolve({ stdout:stdout, stderr:stderr, command:command });
			}
		}.bind(this));

		if(typeof expose !== "undefined") {
			expose(this.process);
		}
	}.bind(this));

	return promise;
};

module.exports = Docktainer;