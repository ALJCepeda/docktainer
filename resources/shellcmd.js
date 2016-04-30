var Base = require("./../libs/barejs/index");
var b = new Base();

var ShellCMD = function(command, action, options, params) {
	if(options && options.sudo === true) {
		this.useSudo = true;
		delete options.sudo
	} else {
		this.useSudo = false;
	}
	

	this.command = command || "";
	this.action = action || "";
	this.options = options || {};
	this.params = params || "";	
};

ShellCMD.prototype.generate = function() {
	var options = this.unpack(this.options);

	var command = this.command;
	var action = this.action;

	var params = this.params;
	if(this.params instanceof ShellCMD) {
		params = this.params.generate();
	}

	var result = [];
	if(this.useSudo === true) { result.push("sudo"); }

	result.push(command);

	if( options !== "" ) { result.push(options); }

	result.push(action);

	if( params !== "" ) { result.push(params); }


	return result.join(" ");
};

ShellCMD.prototype.unpack = function(args) {
	var result = [];

	for(var arg in args) {
		var value = args[arg];

		if(arg.length === 1) {
			result.push(b.supplant("-{0} {1}", [ arg, value ]));
		} else {
			if(value === true) {
				result.push(b.supplant("--{0}", [ arg ]));
			} else if(value !== false) {
				if(Array.isArray(value) === true && value.length > 0) {
					result.push(b.supplant("--{0}=\"{1}\"", [ arg, value.join(",") ]));
				} else {
					result.push(b.supplant("--{0}=\"{1}\"", [ arg, value ]));
				}
			}
		}
	}

	return result.join(" ");
};

module.exports = ShellCMD;