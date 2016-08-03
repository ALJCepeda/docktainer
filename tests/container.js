var tape = require('tape');
var Container = require('./../resources/container');
var Command = require('./../resources/command');

var xtape = function(name) {
	console.log('Manuall skipped:', name);
};

xtape('exec', function(t) {
	var command = new Command('aljcepeda/debian', 'latest', [ 'uname', { 'flags':'mrs' } ]);
	var cmd = command.build('run');

	t.equal(
		cmd,
		'sudo docker run aljcepeda/debian:latest uname -mrs',
		'Generates docker command'
	);

	var container = new Container(cmd);
	container.exec().then(function(result) {
		t.equal(
			result.stdout,
			'Linux 3.13.0-88-generic x86_64\n',
			'Outputs the kernel version'
		);
	}).catch(t.fail).done(t.end);
});

tape('disconnect', function(t) {
	var command = new Command('aljcepeda', 'php', 'latest', [
		'--rm'
	], 'php', [
		'-r',
		'while(true) { $moo = 1; echo $moo; }'
	]);

	var cmd = command.build('run');
	console.log(cmd.join(' '));
	var container = new Container(cmd);

	container.disconnect = 500;
	container.onDisconnect = function() {
		console.log('Did disconnect');
	};

	container.exec().then(function(buf) {
		console.log('stdout:', buf.stdout);
		console.log('stderr:', buf.stderr);
	}).catch(function(buf) {
		console.log('stdout:', buf.stdout);
		console.log('stderr:', buf.stderr);
		console.log('error:', buf.error);
	}).done(t.end);


});
