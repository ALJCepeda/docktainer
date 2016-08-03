var Promise = require("promise");
var cp = require("child_process");
var bare = require('bareutil');
var val = bare.val;
var misc = bare.misc;

/* options - DockerArguments - Startup info for docker container */
var Docktainer = function(command, length, possibles) {
	this.command = command.slice();
	this.randomLength = length || 10;
	this.randomPossibles = possibles || 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz1234567890';

	this.name = '';
	this.stdout = '';
	this.stderr = ''
	this.disconnect = 0;

	this.onDisconnect;
	this.process;

	var name;
	var index = this.command.indexOf('--name');
	if(index === -1) {
		name = misc.random(this.randomLength, this.randomPossibles);
		this.command.splice(3, 0, '--name', name);
	} else {
		name = this.command[index+1];
	}

	this.name = name;
};

Docktainer.prototype.exec = function(options) {
	var self = this;
	var command = this.command;

	return new Promise(function(resolve, reject) {
		var cmd = command.shift();
		self.process = cp.spawn(cmd, command);
		self.stdout = '';
		self.stderr = '';

		self.process.stdout.on('data', (data) => {
			self.stdout += data.toString();
		});
		self.process.stderr.on('data', (data) => {
			self.stderr += data.toString();
		});

		self.process.on('exit', (code, signal) => {
			resolve({
				stdout:self.stdout,
				stderr:self.stderr
			});
		});
		self.process.on('error', (error) => {
			reject({
				stdout:self.stdout,
				stderr:self.stderr,
				error:error
			});
		});

		if(val.number(self.disconnect)) {
			setTimeout(function() {
				cp.exec('sudo docker kill ' + self.name);

				if(val.function(self.onDisconnect)) {
					self.onDisconnect();
				}
			}, self.disconnect);
		}
	});
};

module.exports = Docktainer;
