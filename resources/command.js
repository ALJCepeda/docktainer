var Base = require("./../libs/barejs/index");
var b = new Base();

var Command = function() {
	this.useSudo = true;
	this.action = "run";
	this.name = "";
	this.tag = "";
};

Command.prototype.generate = function(image, command, args) {
	args = args || {};

	var result = "";
	var values = {
		action:this.action,
		command:command,
		image:image
	};

	if(this.useSudo === true) {
		result += "sudo docker {action}";
	} else {
		result += "docker {action}";
	}

	result += this.unpack(args);

	if(this.name !== "") {
		result += " {name}/{image}";
	} else {
		result += " {image}";
	}

	if(this.tag !== "") {
		result +=":{tag}";
		values.tag = this.tag;
	}

	result += " {command}";
	return b.supplant(result, values);
};

Command.prototype.unpack = function(args) {
	var result = "";

	for(var arg in args) {
		var value = args[arg];

		if(arg.length === 1) {
			result += b.supplant(" -{0} {1}", [ arg, value ]);
		} else {
			if(value === true) {
				result += b.supplant(" --{0}", [ arg ]);
			} else if(value !== false) {
				if(Array.isArray(value) === true && value.length > 0) {
					result += b.supplant(" --{0}=\"{1}\"", [ arg, value.join(",") ]);
				} else {
					result += b.supplant(" --{0}=\"{1}\"", [ arg, value ]);
				}
			}
		}
	}

	return result;
};

module.exports = Command;