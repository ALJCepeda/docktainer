var tape = require('tape');
var Container = require('./../resources/container');
var Command = require('./../resources/command');

var xtape = function(name) {
	console.log('Manuall skipped:', name);
};

tape('exec', function(t) {
	var command = new Command('aljcepeda', 'php', 'latest', [
		'--rm'
	], 'php', [
		'-r',
		'while(true) { $moo = 1; echo $moo; }'
	]);

	var command = new Command('aljcepeda', 'debian', 'latest', ['--rm'], 'uname', ['-mrs']);
	var cmd = command.build('run');

	t.deepEqual(
		cmd,
		[ 'sudo', 'docker', 'run', '--rm', 'aljcepeda/debian:latest', 'uname', '-mrs' ],
		'Generates docker command'
	);

	var container = new Container(command);
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

	var container = new Container(command);
	container.disconnect = 500;
	container.onDisconnect = function() {
		t.pass('Disconnect hook was called');
	};

	container.exec().then(function(buf) {
		t.pass('Promise resolves with no errors');
	}).done(t.end);
});
