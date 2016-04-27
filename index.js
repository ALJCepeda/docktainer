var DockerArguments = require("./resources/arguments");
var DockerCommand = require("./resources/command");
var DockerContainer = require("./resources/container");

var DockerFactory = function() {
	this.DockerArguments = DockerArguments;
	this.DockerCommand = DockerCommand;
	this.DockerContainer = DockerContainer;
};

