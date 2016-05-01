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
		return false;
	} else {
		var cmd = this._cmd = this.generate("run");
		return this.exec(cmd, expose);
	}
};

Docktainer.prototype.isRunning = function() {
	if(this._pid === 0 || this.name === "") {
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