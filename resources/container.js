var Promise = require("promise");
var cp = require("child_process");

var ShellCMD = require("./shellcmd");
var Base = require("./../libs/barejs/index");
var b = new Base();
/*
	options - DockerArguments - Startup info for docker container
*/
var Docktainer = function(image, inner, options, tag) {
	this._id = "";
	this._pid = 0;
	this._cmd = "";

	this.image = image || "";
	this.inner = inner || "";
	this.options = options || {};
	this.tag = tag || "latest";
	

	this.process;
};

Docktainer.prototype.generate = function() {
	var image = this.image;
	var inner = this.inner;
	var options = this.options;
	var tag = this.tag;	

	var action = b.supplant("run {0}:{1}", [ image, tag ]);
	var commander = new ShellCMD("docker", action, options, inner);

	var result = commander.generate();
	return result;
};

Docktainer.prototype.run = function(expose) {
	if(this.isRunning() === true) {
		return false;
	} else {
		var cmd = this._cmd = this.generate();

		/*
		this.exec(cmd, expose).then(function(result) {
			console.log(result.stdout);
		}).catch(function(result) {
			console.log(result.error);
		});*/
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