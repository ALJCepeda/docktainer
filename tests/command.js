var tape = require("tape");
var Command = require("./../resources/command");

tape("generate", function(t) {
	var command = new Command("aljcepeda/php", "latest", "php index.php");

	var result = command.build("run");

	t.equal(
		result,
		"sudo docker run aljcepeda/php:latest php index.php",
		"Builds docker command"
	);

	t.end();
});
