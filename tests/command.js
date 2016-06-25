var tape = require('tape');
var Command = require('./../resources/command');
var misc = require('bareutil').misc;

tape('generate', function(t) {
	var case1 = new Command('aljcepeda/php', 'latest', 'php index.php');

	t.equal(
		case1.build('run'),
		'sudo docker run aljcepeda/php:latest php index.php',
		'Builds docker command'
	);

	var case2 = new Command('aljcepeda/debian', 'latest', [ 'uname', { 'flags':'mrs' } ]);
	t.equal(
		case2.build('run'),
		'sudo docker run aljcepeda/debian:latest uname -mrs',
		'Generates uname command for debian container'
	);

	t.end();
});

tape('coder', function(t) {
	var name = misc.supplant("$0/$1", ['aljcepeda', 'PHP']);
	var volume = misc.supplant("$0:$1", ['tmp/randomID', "/scripts"]);

	var command = new Command(name, 'latest', 'php test.php', {
		name:'randomID',
		rm:true,
		volume:volume,
		workdir:"/scripts"
	});

	var cmd = command.build('run');
	t.equal(
		cmd,
		'sudo docker run --name="randomID" --rm --volume="tmp/randomID:/scripts" --workdir="/scripts" aljcepeda/PHP:latest php test.php',
		'Simple way of generating docker commands'
	);
});
