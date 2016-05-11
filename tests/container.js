var assert = require("assert");
var fs = require("fs");
var Container = require("./../resources/container");
var ShellCMD = require("./../resources/cmd");

describe("Container", function() {
	xdescribe("exec", function() {
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

	xdescribe("generate", function() {
		it("uname", function() {
			var inner = new ShellCMD("uname", { "mrs":true });
			var container = new Container("ajrelic/debian", inner);
			var result = container.generate("run");

			assert.equal(result, "sudo docker run ajrelic/debian:latest uname --mrs");
		});
		it("ps", function() {
			var container = new Container("ajrelic/debian", "ps");
			var result = container.generate("run");

			assert.equal(result, "sudo docker run ajrelic/debian:latest ps");
		});
	});

	describe("run", function() {
		xit("uname", function(done) {
			var container = new Container("debian", "uname");

			container.run().then(function(result) {
				assert.equal(result.stdout, "Linux\n");
				done();
			}).catch(function(error) {
				console.log(error);
				done();
			});
		});

		it("disconnect", function(done) {
			this.timeout(50000);

			var container = new Container("debian", "", { flags:"i" });
			container.disconnect = 5000;
			container.onDisconnect = function() {
				console.log("did kill");
			};

			container.run().then(function(result) {
				done();
			}).catch(function(error) {
				console.log(error);
				done();
			});
		});
	});
});
