var Promise = require("promise");
var cp = require("child_process");

var CMD = require("./cmd");
var Base = require("./../libs/barejs/index");
var b = new Base();
/*
	options - DockerArguments - Startup info for docker container
*/
var Docktainer = function(name, inner, options, tag) {
	this._id = "";
	this._pid = 0;
	this._cmd = "";

	this.sudo = true;
	this.name = name || "";
	this.inner = inner || "";
	this.options = options || {};
	this.tag = tag || "latest";

	this.process;

	this.disconnect = 0;
	this.onDisconnect;

	this.kill = 0;
	this.onKill;
};

Docktainer.prototype.generate = function(action) {
	var name = this.name;
	var inner = this.inner;
	var options = this.options;
	var tag = this.tag;	

	if(inner instanceof CMD) { inner = inner.value; }

	var image = b.supplant("{0}:{1} {2}", [ name, tag, inner ]);
	var cmd = new CMD(this.sudo, "docker", action, options, image);

	var result = cmd.value;
	return result;
};

Docktainer.prototype.run = function(expose) {
	if(this.isRunning() === true) {
		return Promise.reject("Container is already running");
	} else {
		var cmd = this._cmd = this.generate("run");
		return this.exec(cmd, expose);
	}
};

Docktainer.prototype.disconnect = function(expose) {
	if(this.isRunning() === true) {
		var cmd = new CMD(this.sudo, "docker kill", this.name);
		console.log(cmd);

		return this.exec(cmd, expose);
	} else {
		return Promise.resolve({ stdout:"", stdin:"", stderr:"" });
	}
}

Docktainer.prototype.isRunning = function() {
	return (this.process && this.process.connected === true);
};

Docktainer.prototype.exec = function(command, expose) {
	var self = this;
	//Execute docker command
	var promise = new Promise(function(resolve, reject) {

		self.process = cp.exec(command, function(error, stdout, stderr) {
			if(error && error.kill === true) {
				reject({ error:error, stdout:stdout, stderr:stderr, command:command });
			} else {
				resolve({ stdout:stdout, stderr:stderr, command:command });
			}
		});

		if(self.disconnect > 0) {
			console.log("Set disconnect");
			setTimeout(function() {
				self.process.kill();

				if(typeof self.onDisconnect !== "undefined") {
					self.onDisconnect();
				}
			}, self.disconnect);
		}

		if(self.kill > 0) {
			console.log("Set disconnect");
			setTimeout(function() {
				self.process.kill();

				if(typeof self.onKill !== "undefined") {
					self.onKill();
				}
			}, self.kill);
		}

		if(typeof expose !== "undefined") {
			expose(self.process);
		}

	});

	return promise;
};

module.exports = Docktainer;