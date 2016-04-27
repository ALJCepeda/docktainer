var Command = require("./commands");

/*
	args - DockerArguments - Startup info for docker container
*/
var Docktainer = function(args) {
	this.id = "";
	this.pid = 0;
	this.args = args;
	this.command = "";
};

Docktainer.prototype.run = function(image, cmd, version, repository) {
	if(this.isRunning() === true) {
		return false;
	} else {
		var commander = new Command();
		var runCMD = commander.generate("run", this.args);
		console.log(runCMD);
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

Dock