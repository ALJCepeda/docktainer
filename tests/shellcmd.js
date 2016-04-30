var assert = require("assert");
var ShellCMD = require("./../resources/shellcmd");

describe("Command", function() {
	describe("unpack", function() {
		it("empty args", function() {
			var command = new ShellCMD();
			var result = command.unpack({});
			assert(result === "");
		});

		it("few args", function() {
			var command = new ShellCMD();
			var result = command.unpack({
				"kernel-memory":"5M",
				"rm":true,
				"id":"Test Container"
			});

			assert.equal(result, "--kernel-memory=\"5M\" --rm --id=\"Test Container\"");
		});

		it("nested args", function() {
			var command = new ShellCMD();
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
			var inner = new ShellCMD("php", "index.php");
			var cmd = new ShellCMD("docker", "run debian", { sudo:true }, inner);
			
			var result = cmd.generate();
			assert.equal(result, "sudo docker run debian php index.php");
		});

		it("few args", function() {
			var inner = new ShellCMD("nodejs", "app.js");
			var cmd = new ShellCMD("docker", "run ubuntu", {
				sudo:true,
				"kernel-memory":"5M",
				rm:true,
				id:"Test Container"
			}, inner);

			var result = cmd.generate();
			assert.equal(result, "sudo docker --kernel-memory=\"5M\" --rm --id=\"Test Container\" run ubuntu nodejs app.js");
		});
	});
});