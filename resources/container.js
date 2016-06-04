var Promise = require("promise");
var cp = require("child_process");
var B = require("bareutil");

/* options - DockerArguments - Startup info for docker container */
var Docktainer = function(command) {
	this.command = command;

	this.id = "";
	this.pid = 0;
	this.process = null;

	this.kill = 0;
	this.onKill = null;
};

Docktainer.prototype.run = function(expose) {
	if(this.isRunning() === true) {
		return Promise.reject("Container is already running");
	} else {
		return this.exec(expose);
	}
};

Docktainer.prototype.isRunning = function() {
	return (this.process && this.process.connected === true);
};

Docktainer.prototype.exec = function(expose) {
	var command = this.command;

	//Execute docker command
	return new Promise(function(resolve, reject) {
		this.process = cp.exec(command, function(error, stdout, stderr) {
			if(error && error.kill === true) {
				reject({ error:error, stdout:stdout, stderr:stderr, command:command });
			} else {
				resolve({ stdout:stdout, stderr:stderr, command:command });
			}
		});

		if(this.kill > 0) {
			console.log("Setup kill");
			setTimeout(function() {
				this.process.kill();

				if(typeof this.onKill !== "undefined") {
					this.onKill();
				}
			}, this.kill);
		}

		if(typeof expose !== "undefined") {
			console.log("Exposing process");
			expose(this.process);
		}

	}.bind(this));
};

module.exports = Docktainer;
