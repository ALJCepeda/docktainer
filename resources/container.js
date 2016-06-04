var Promise = require("promise");
var cp = require("child_process");

var CMD = require("./cmd");
var B = require("bareutil");

/* options - DockerArguments - Startup info for docker container */
var Docktainer = function(name, tag, inner, options) {
	this.id = "";
	this.pid = 0;
	this.cmd = "";

	this.process = null;

	this.disconnect = 0;
	this.onDisconnect = null;

	this.kill = 0;
	this.onKill = null;
};

Docktainer.prototype.run = function(expose) {
	if(this.isRunning() === true) {
		return Promise.reject("Container is already running");
	} else {
		return this.exec("run", expose);
	}
};

Docktainer.prototype.generate = function(action) {
	var name = this.name;
	var options = this.options;
	var tag = this.tag;

	var inner = this.inner;
	if(this.inner instanceof CMD) { inner = this.inner.value; }

	var image = B.supplant("{0}:{1} {2}", [ name, tag, inner ]);
	var cmd = new CMD(this.sudo, "docker", action, options, image);

	var result = cmd.value;
	return result;
};


Docktainer.prototype.isRunning = function() {
	return (this.process && this.process.connected === true);
};

Docktainer.prototype.exec = function(action, expose) {
	var self = this;

	var cmd = this.cmd = this.generate(action);

	//Execute docker command
	return new Promise(function(resolve, reject) {
		self.process = cp.exec(cmd, function(error, stdout, stderr) {
			if(error && error.kill === true) {
				reject({ error:error, stdout:stdout, stderr:stderr, command:command });
			} else {
				resolve({ stdout:stdout, stderr:stderr, command:cmd });
			}
		});

		if(self.disconnect > 0) {
			console.log("Setup disconnect");
			setTimeout(function() {
				self.process.kill();

				if(typeof self.onDisconnect !== "undefined") {
					self.onDisconnect();
				}
			}, self.disconnect);
		}

		if(self.kill > 0) {
			console.log("Setup kill");
			setTimeout(function() {
				self.process.kill();

				if(typeof self.onKill !== "undefined") {
					self.onKill();
				}
			}, self.kill);
		}

		if(typeof expose !== "undefined") {
			console.log("Exposing process");
			expose(self.process);
		}

	});
};

module.exports = Docktainer;
