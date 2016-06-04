var tape = require("tape");
var glue = require("./../resources/glue");

tape("glue", function(t) {
	t.equal(
		glue({}),
		"",
		"Empty args return emtpy string"
	);

	t.equal(
		glue({
			"kernel-memory":"5M",
			"rm":true,
			"id":"Test Container"
		}),
		"--kernel-memory=\"5M\" --rm --id=\"Test Container\"",
		"Unpacks arguments"
	);

	t.equal(
		glue({
			"id":"Moo",
			"volumes":[
				"/var/tmp:/var/hosttmp",
				"/dev/stdin:/dev/hoststdin"
			]
		}),
		"--id=\"Moo\" --volumes=\"/var/tmp:/var/hosttmp,/dev/stdin:/dev/hoststdin\"",
		"Unpacks nested arguments"
	);

	t.end();
});

tape("nested glue", function(t) {
	var php = glue("php", "index.php");
	var debian = glue("ajrelic/debian", php);
	var case1 = glue("sudo", "docker", "run", debian);

	t.equal(
		case1,
		"sudo docker run ajrelic/debian php index.php",
		"Unpacks nested commands"
	);

	var node = glue("nodejs", "app.js");
	var case2 = glue("sudo", "docker", {
		"kernel-memory":"5M",
		rm:true,
		id:"Test Container"
	}, "run ubuntu", node);

	t.equal(
		case2,
		"sudo docker --kernel-memory=\"5M\" --rm --id=\"Test Container\" run ubuntu nodejs app.js",
		"Fully qualified docker command"
	);

	t.end();
});
