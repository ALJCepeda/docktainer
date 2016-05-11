var tape = require("tape");
var CMD = require("./../resources/cmd");

tape("unpack", function(t) {
	var cmd = new CMD();

	t.equal(
		cmd.unpack({}),
		"",
		"Empty args return emtpy string"
	);

	t.equal(
		cmd.unpack({
			"kernel-memory":"5M",
			"rm":true,
			"id":"Test Container"
		}),
		"--kernel-memory=\"5M\" --rm --id=\"Test Container\"",
		"Unpacks arguments"
	);

	t.equal(
		cmd.unpack({
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

tape("generate", function(t) {
	var php = new CMD("php", "index.php");
	var debian = new CMD("ajrelic/debian", php);
	var case1 = new CMD(true, "docker", "run", debian);

	t.equal(
		case1.value,
		"sudo docker run ajrelic/debian php index.php",
		"Unpacks nested commands"
	);

	var node = new CMD("nodejs", "app.js");
	var case2 = new CMD(true, "docker", {
		"kernel-memory":"5M",
		rm:true,
		id:"Test Container"
	}, "run ubuntu", node);

	t.equal(
		case2.value,
		"sudo docker --kernel-memory=\"5M\" --rm --id=\"Test Container\" run ubuntu nodejs app.js",
		"Fully qualified docker command"
	);

	t.end();
});
