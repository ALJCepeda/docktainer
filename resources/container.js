var Promise = require("promise");
var cp = require("child_process");

var CMD = require("./cmd");
var B = require("bareutil");
/*
	options - DockerArguments - Startup info for docker container
*/
var Docktainer = function(name, tag, inner, options) {
	this._id = "";
	this._pid = 0;
	this._cmd = "";

	this.sudo =  true;
	this.name = name || "";
	this.inner = inner || "";
	this.options = options || {};
	this.tag = tag || "latest";

	this.process = null;

	this.disconnect = 0;
	this.onDisconnect = null;

	this.kill = 0;
	this.onKill = null;

	if(options) {
		console.log(B);
		B.Obj.merge(this, options);

		this.options = B.Obj.filter(options, B.Obj.values(this));
	}
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

/*
Needs to be redone. Possibly a Process class for exec instead
Docktainer.prototype.disconnect = function(expose) {
	if(this.isRunning() === true) {
		var cmd = new CMD(this.sudo, "docker kill", this.name);
		console.log(cmd);

		return this.exec(cmd, expose);
	} else {
		return Promise.resolve({ stdout:"", stdin:"", stderr:"" });
	}
};
*/

Docktainer.prototype.isRunning = function() {
	return (this.process && this.process.connected === true);
};

Docktainer.prototype.exec = function(action, expose) {
	var self = this;

	var cmd = this._cmd = this.generate(action);

	//Execute docker command
	var promise = new Promise(function(resolve, reject) {

		console.log("Executing command: " + cmd);
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

	return promise;
};

module.exports = Docktainer;
