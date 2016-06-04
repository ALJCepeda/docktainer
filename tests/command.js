var tape = require("tape");
var Command = require("./../resources/command");

tape("generate", function(t) {
	var case1 = new Command("aljcepeda/php", "latest", "php index.php");

	t.equal(
		case1.build("run"),
		"sudo docker run aljcepeda/php:latest php index.php",
		"Builds docker command"
	);

	var case2 = new Command("aljcepeda/debian", "latest", [ "uname", { "flags":"mrs" } ]);
	t.equal(
		case2.build("run"),
		"sudo docker run aljcepeda/debian:latest uname -mrs",
		"Generates uname command for debian container"
	);

	t.end();
});
