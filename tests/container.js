var assert = require("assert");
var Container = require("./../resources/container");
var ShellCMD = require("./../resources/shellcmd");

describe("Container", function() {
	describe("exec", function() {
		it("uname", function(done) {
			var inner = new ShellCMD("uname", "", { "mrs":true });
			var container = new Container("ajrelic/debian", inner, { sudo:true });

			container.exec("uname -mrs").then(function(result) {
				assert.equal(result.stdout, "Linux 3.13.0-85-generic x86_64\n");
				done();
			}).catch(function(error) {
				console.log(error);
				done();
			});
		});
	});

	describe("generate", function() {
		it("uname", function() {
			var inner = new ShellCMD("uname", "", { "mrs":true });
			var container = new Container("ajrelic/debian", inner, { sudo:true });
			var result = container.generate();

			assert.equal(result, "sudo docker run ajrelic/debian:latest uname --mrs");
		});
		it("ps", function() {
			var container = new Container("ajrelic/debian", "ps", { sudo:true }, "latest");
			var result = container.generate();
			
			assert.equal(result, "sudo docker run ajrelic/debian:latest ps");
		});
	})

	describe("run", function() {
		it("uname", function(done) {
			var container = new Container("debian", "uname", { sudo:true }, "latest");
			
			container.run().then(function(result) {
				assert.equal(result.stdout, "Linux\n");
				done();
			}).catch(function(error) {
				console.log(error);
				done();
			});
		});
	});
});