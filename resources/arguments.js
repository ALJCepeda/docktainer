var DockerArguments = function() {
	this.name = "";
	this.id = "";
	this.workingDIR = "";
	this.mounts = {};
	this.args = [];
	this.command = "";

	this.useSudo = true;
	this.remove = true;
};

module.exports = DockerArguments;