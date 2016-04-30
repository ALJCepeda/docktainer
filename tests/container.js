var assert = require("assert");
var Container = require("./../resources/container");

describe("Container", function() {
	xdescribe("exec", function() {
		it("uname", function(done) {
			var container = new Container();

			container.exec("uname -mrs").then(function(result) {
				assert.equal(result.stdout, "Linux 3.13.0-85-generic x86_64\n");
				done();
			}).catch(function(error) {
				console.log(error);
				done();
			});
		});
	});

	describe("run", function(done) {
		it("uname", function() {
			var container = new Container();

			container.run("debian", "ps", "latest", "ajrelic");
		});
	});

});