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
	this.stderr = '';
	this.err = '';
	this.bufferLimit = 0;
	this.bufferSize = 0;
	this.timer = '';
	this.timeout = 0;

	this.onTimeout;
	this.overflow = false;
	this.onOverflow;
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
		self.err = '';

		self.process.stdout.on('data', (data) => {
			if(self.overflow === false) {
				self.bufferSize += Buffer.byteLength(data.toString());

				if(self.bufferLimit === 0 || self.bufferSize < self.bufferLimit) {
					self.stdout += data.toString();
				} else {
					self.kill();
					self.overflow = true;
					if(val.function(self.onOverflow)) {
						self.onOverflow();
					}
				}
			}
		});
		self.process.stderr.on('data', (data) => {
			if(self.overflow === false) {
				self.bufferSize += Buffer.byteLength(data.toString());

				if(self.bufferLimit === 0 || self.bufferSize < self.bufferLimit) {
					self.stderr += data.toString();
				} else {
					self.kill();
					self.overflow = true;
					if(val.function(self.onOverflow)) {
						self.onOverflow();
					}
				}
			}
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

		if(val.number(self.timeout) && self.timeout > 0) {
			self.timer = setTimeout(function() {
				self.kill();

				if(val.function(self.onTimeout)) {
					self.onTimeout();
				}
			}, self.timeout);
		}
	}).then(function(result) {
		if(self.timer !== '') {
			clearTimeout(self.timer);
		}
		return result;
	});
};

Docktainer.prototype.kill = function() {
	var self = this;
	if(self.command.sudo === true) {
		cp.exec('sudo docker kill ' + self.name, (err, stdout, stderr) => {
			self.err += err;
			self.stdout += stdout;
			self.stderr += stderr;
		});
	} else {
		cp.exec('docker kill ' + self.name, (err, stdout, stderr) => {
			self.err += err;
			self.stdout += stdout;
			self.stderr += stderr;
		});
	}
}
module.exports = Docktainer;
