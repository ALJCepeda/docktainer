var tape = require('tape');
var Command = require('./../resources/command');
var misc = require('bareutil').misc;

var xtape = function(name) { console.log('Manual skipped:', name); };

tape('generate', function(t) {
	var case1 = new Command('aljcepeda', 'php', 'latest', [], 'php', ['index.php']);

	t.deepEqual(
		case1.build('run'),
		[ 'docker', 'run', 'aljcepeda/php:latest', 'php', 'index.php' ],
		'Builds docker command'
	);


	var case2 = new Command('aljcepeda', 'debian', 'latest', [], 'uname', ['-mrs']);
	t.deepEqual(
		case2.build('run'),
		[ 'docker', 'run', 'aljcepeda/debian:latest', 'uname', '-mrs' ],
		'Generates uname command for debian container'
	);

	t.end();
});

tape('coder', function(t) {
	var command = new Command('aljcepeda', 'php', 'latest', [
		'--name',
		'randomID',
		'--rm',
		'--volume',
		'tmp/randomID:/scripts',
		'-w',
		'/scripts'
	], 'php', ['test.php']);
	command.sudo = true;

	t.deepEqual(
		command.build('run'),
		[ 'sudo',
		  'docker',
		  'run',
		  '--name',
		  'randomID',
		  '--rm',
		  '--volume',
		  'tmp/randomID:/scripts',
		  '-w',
		  '/scripts',
		  'aljcepeda/php:latest',
		  'php',
		  'test.php' ],
		'Docker command with sudo'
	);

	t.end();
});
