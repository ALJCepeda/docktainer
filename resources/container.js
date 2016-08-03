var Promise = require("promise");
var cp = require("child_process");
var bare = require('bareutil');
var val = bare.val;
var misc = bare.misc;

/* options - DockerArguments - Startup info for docker container */
var Docktainer = function(command, length, possibles) {
	this.command = command;
	this.randomLength = length || 10;
	this.randomPossibles = possibles || 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz1234567890';

	this.name = '';
	this.stdout = '';
	this.stderr = ''
	this.disconnect = 0;

	this.onDisconnect;
	this.process;
};

Docktainer.prototype.exec = function(options) {
	var self = this;
	var args = this.command.build('run');

	var index = args.indexOf('--name');
	if(index === -1) {
		this.name = misc.random(this.randomLength, this.randomPossibles);
		args.splice(3, 0, '--name', this.name);
	} else {
		this.name = args[index+1];
	}

	return new Promise(function(resolve, reject) {
		var cmd = args.shift();
		self.process = cp.spawn(cmd, args);
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
