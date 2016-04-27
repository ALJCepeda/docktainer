var Command = require("./../resources/command");

function run(assert) {
	describe("Command", function() {
		var command;

		beforeEach(function() {
			command = new Command();
		});

		describe("unpack", function() {
			it("empty args", function() {
				var result = command.unpack({});
				assert(result === "");
			});

			it("few args", function() {
				var result = command.unpack({
					"kernel-memory":"5M",
					"rm":true,
					"id":"Test Container"
				});

				assert.equal(result, " --kernel-memory=\"5M\" --rm --id=\"Test Container\"");
			});

			it("nested args", function() {
				var result = command.unpack({
					"id":"Moo",
					"volumes":[
						"/var/tmp:/var/hosttmp",
						"/dev/stdin:/dev/hoststdin"
					]
				});

				assert.equal(result, " --id=\"Moo\" --volumes=\"/var/tmp:/var/hosttmp,/dev/stdin:/dev/hoststdin\"");
			})
		});

		describe("generate", function() {
			it("No args", function() {
				var cmd = command.generate("debian", "php index.php");
				assert.equal(cmd, "sudo docker run debian php index.php");
			});
		});
	});
}

module.exports = run;