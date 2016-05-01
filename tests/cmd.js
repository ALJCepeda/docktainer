var assert = require("assert");
var CMD = require("./../resources/cmd");

describe("Command", function() {
	xdescribe("unpack", function() {
		it("empty args", function() {
			var command = new CMD();
			var result = command.unpack({});
			assert(result === "");
		});

		it("few args", function() {
			var command = new CMD();
			var result = command.unpack({
				"kernel-memory":"5M",
				"rm":true,
				"id":"Test Container"
			});

			assert.equal(result, "--kernel-memory=\"5M\" --rm --id=\"Test Container\"");
		});

		it("nested args", function() {
			var command = new CMD();
			var result = command.unpack({
				"id":"Moo",
				"volumes":[
					"/var/tmp:/var/hosttmp",
					"/dev/stdin:/dev/hoststdin"
				]
			});

			assert.equal(result, "--id=\"Moo\" --volumes=\"/var/tmp:/var/hosttmp,/dev/stdin:/dev/hoststdin\"");
		})
	});

	describe("generate", function() {
		it("no args", function() {
			var php = new CMD("php", "index.php");
			var debian = new CMD("ajrelic/debian", php);
			var cmd = new CMD(true, "docker", "run", debian);
			
			var result = cmd.value;
			assert.equal(result, "sudo docker run ajrelic/debian php index.php");
		});

		it("few args", function() {
			var node = new CMD("nodejs", "app.js");
			var cmd = new CMD(true, "docker", {
				"kernel-memory":"5M",
				rm:true,
				id:"Test Container"
			}, "run ubuntu", node);

			var result = cmd.value;
			assert.equal(result, "sudo docker --kernel-memory=\"5M\" --rm --id=\"Test Container\" run ubuntu nodejs app.js");
		});
	});
});