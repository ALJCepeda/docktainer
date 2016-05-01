var Base = require("./../libs/barejs/index");
var b = new Base();

var CMD = function(name, args, action, append, sudo) {
	this.sudo = sudo || false;
	this.name = name;
	this.args = args || {};
	this.action = action || "";
	this.append = append || "";
};

CMD.prototype.generate = function() {
	var result = []; 

	if(this.sudo === true) { result.push("sudo"); }
	
	result.push(this.name);

	var args = this.unpack(this.args);
	if( args !== "" ) { result.push(args); }

	if( this.action !== "" ) { result.push(this.action); }

	var append = this.unpack(this.append);
	if( append !== "" ) { result.push(append); }

	return result.join(" ");
};

CMD.prototype.unpack = function(args) {
	var result = [];

	if(typeof args === "string") {
		result.push(args);
	} else if(args instanceof CMD) {
		result.push(args.generate());
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