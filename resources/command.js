var misc = require('bareutil').misc;

var Command = function(repository, name, tag, args, inner, innerArgs) {
	this.sudo = true;
	this.repository = repository;
	this.name = name;
	this.tag = tag;

	this.args = args;
	this.inner = inner;
	this.innerArgs = innerArgs;
}

Command.prototype.build = function(action) {
	var result = [];
	var image = this.repository + '/' + this.name + ':' + this.tag;

	if(this.sudo) { result.push('sudo'); }
	result.push('docker');
	result.push(action);
	[].push.apply(result, this.args);
	result.push(image);
	result.push(this.inner);
	[].push.apply(result, this.innerArgs);

	return result;
};

module.exports = Command;
