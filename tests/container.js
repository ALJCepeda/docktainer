var tape = require("tape");
var fs = require("fs");
var Container = require("./../resources/container");
var CMD = require("./../resources/cmd");

tape("generate", function(t) {
	var inner = new CMD("uname", { "flags":"mrs" });
	var case1 = new Container("ajrelic/debian", inner);

	t.equal(
		case1.generate("run"),
		"sudo docker run ajrelic/debian:latest uname -mrs",
		"Generates uname command for debian container"
	);

	var case2 = new Container("ajrelic/debian", "ps");

	t.equal(
		case2.generate("run"),
		"sudo docker run ajrelic/debian:latest ps",
		"Generate simple commands without CMD class"
	);

	t.end();
});


tape("exec", function(t) {
	var cmd = new CMD("uname", { "flags":"mrs" });
	var container = new Container("aljcepeda/debian", cmd, { sudo:true });

	t.plan(1);

	container.exec("run").then(function(result) {
		t.equal(
			result.stdout,
			"Linux 3.13.0-85-generic x86_64\n",
			"Outputs the kernel version"
		);
	}).catch(t.fail);
});

tape("run", function(t) {
	var container = new Container("debian", "uname");

	t.plan(1);
	container.run().then(function(result) {
		t.equal(
			result.stdout,
			"Linux\n",
			"Outputs kernel type"
		);
	}).catch(t.fail);
});

/*
describe("Container", function() {
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
});*/
