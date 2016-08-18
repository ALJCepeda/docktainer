var tape = require('tape');
var Container = require('./../resources/container');
var Command = require('./../resources/command');

var xtape = function(name) {
	console.log('Manually skipped:', name);
};

xtape('exec', function(t) {
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
		[ 'docker', 'run', '--rm', 'aljcepeda/debian:latest', 'uname', '-mrs' ],
		'Generates docker command'
	);

	var container = new Container(command);
	container.exec().then(function(result) {
		t.equal(
			result.stdout,
			'Linux 4.5.0-1-ARCH x86_64\n',
			'Outputs the kernel version'
		);
	}).catch(t.fail).done(t.end);
});

tape('timeout', function(t) {
	var command = new Command('aljcepeda', 'php', 'latest', [
		'--rm'
	], 'php', [
		'-r',
		'while(true) { $moo = 1; echo $moo; }'
	]);

	var container = new Container(command);
	container.timeout = 1000;
	container.onTimeout = function() {
		t.pass('Disconnect hook was called');
	};

	container.exec().then(function(result) {
		t.equal(typeof result.err, 'undefined', 'Process returned no errors');
		t.equal(result.stderr, '', 'Command returned no errors');
	}).done(t.end);
});

xtape('kernel constraints', function(t) {
	var command = new Command('aljcepeda', 'php', 'latest', [
		'--rm',
		'--cpu-shares',
		'2',
		'--memory',
		'20M'
	], 'php', [
		'-r',
		'$str="wontstaysmall"; $i=0; while(true) { $i = $i+1; $str = str_repeat($str, 5); echo $i . ": " . strlen($str) . "\n"; }'
	]);

	var container = new Container(command);
	container.timeout = 3000;
	container.onTimeout = function() {
		t.fail('Container will end from memory before timeout is reached');
	};

	container.exec().then(function(buf) {
		t.pass('Container ended when memory limit was reached');
		t.equal(
			buf.stdout,
			'1: 65\n2: 325\n3: 1625\n4: 8125\n5: 40625\n6: 203125\n7: 1015625\n8: 5078125\n',
			'String repeated 8 times'
		);

		t.equal(
			buf.stderr,
			'',
			'No warning if kernel supports swap limit capabilities'
		);

		t.end();
	});
});

xtape('disabled networking', function(t) {
	var command = new Command('aljcepeda', 'php', 'latest', [
		'--rm',
		'--net',
		'none'
	], 'php', [
		'-r',
		'$google = file_get_contents("http://www.google.com"); echo $google;'
	]);

	var container = new Container(command);
	container.exec().then(function(buf) {
		t.equal(
			buf.stderr,
			'PHP Warning:  file_get_contents(): php_network_getaddresses: getaddrinfo failed: Name or service not known in Command line code on line 1\nPHP Warning:  file_get_contents(http://www.google.com): failed to open stream: php_network_getaddresses: getaddrinfo failed: Name or service not known in Command line code on line 1\n',
			'Error for lack of LAN');

		t.equal(
			buf.stdout,
			'',
			'Nothing made it to stdout'
		);

		t.end();
	})
});
