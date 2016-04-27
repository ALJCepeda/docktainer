var Temper = require("./resources/dockercmd");

/*
	args - DockerArguments - Startup info for docker container
*/
var Docktainer = function(args) {
	this.id = "";
	this.pid = 0;
	this.args = args;
	this.command = "";
}

Docktainer.prototype.run = function(image, cmd, version, repository) {
	if(this.isRunning() === true) {
		this.log("Container ("+this.name+") is already running");
		return false;
	} else {
		

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