var Base = require("./../libs/barejs/index");
var b = new Base();

var CMD = function(sudo) {
	this.sudo = sudo || false;
	
	var result = [];
	if(sudo && sudo === true) { 
		result.push("sudo"); 
		[].splice.call(arguments, 0, 1);
	}

	var args = [].splice.call(arguments, 0);
	result.push(this.unpack(args));

	this.value = result.join(" ");
};

CMD.prototype.unpack = function(args) {
	var result = [];

	if(typeof args === "string") {
		result.push(args);
	} else if(args instanceof CMD) {
		result.push(args.value);
	} else if(Array.isArray(args)) {

		for(var index in args) {
			var value = args[index];
			result.push(this.unpack(value));
		}

	} else if(typeof args === "object") {

		for(var key in args) {
			var value = args[key];

			if(key.length === 1) {
				result.push(b.supplant("-{0} {1}", [ key, value ]));
			} else {
				if(value === true) {
					result.push(b.supplant("--{0}", [ key ]));
				} else if(value !== false) {
					if(Array.isArray(value) === true && value.length > 0) {
						result.push(b.supplant("--{0}=\"{1}\"", [ key, value.join(",") ]));
					} else {
						result.push(b.supplant("--{0}=\"{1}\"", [ key, value ]));
					}
				}
			}
		}

	}
	
	return result.join(" ");
};

module.exports = CMD;