var bare = require('bareutil');
var misc = bare.misc;
var val = bare.val;
var glue = require('./glue');

var Command = function(name, tag, inner, options) {
	this.sudo =  true;
	this.name = name || '';
	this.tag = tag || 'latest';
	this.inner = inner || '';
	this.options = options || {};
};

Command.prototype.build = function(action) {
	var name = this.name;
	var options = this.options;
	var tag = this.tag;

	var inner = this.inner;
	if(val.array(this.inner) === true) {
		inner = glue.apply(null, this.inner);
	}

	var image = misc.supplant('{0}:{1} {2}', [ name, tag, inner ]);

	if(this.sudo === true) {
		return glue('sudo', 'docker', action, options, image);
	} else {
		return glue('docker', action, options, image);
	}
};

module.exports = Command;
