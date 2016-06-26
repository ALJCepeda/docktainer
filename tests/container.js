var tape = require("tape");
var Container = require("./../resources/container");
var Command = require("./../resources/command");

tape("exec", function(t) {
	var command = new Command("aljcepeda/debian", "latest", [ "uname", { "flags":"mrs" } ]);
	var cmd = command.build("run");

	t.equal(
		cmd,
		"sudo docker run aljcepeda/debian:latest uname -mrs",
		"Generates docker command"
	);

	var container = new Container(cmd);
	container.exec().then(function(result) {
		t.equal(
			result.stdout,
			"Linux 3.13.0-88-generic x86_64\n",
			"Outputs the kernel version"
		);
	}).catch(t.fail).done(t.end);
});

/*
tape("disconnect", function(t) {
	var container = new Container("debian", "latest", "ps", {
		disconnect:5000,
		onDisconnect:function() {
			console.log("did disconnect!");
		}
	});

	console.log(container.disconnect);
	console.log(container.options);
});*/
