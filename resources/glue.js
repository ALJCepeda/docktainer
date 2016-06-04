var B = require("bareutil");

/*
	Initially breaks down arguments and feeds them to unpack then rebuilds for final result
*/
var glue = function() {
	var args = [].splice.call(arguments, 0);
	var result = [];

	for(var index in args) {
		value = args[index];

		var unpacked = unpack(value);

		if(unpacked !== "") {
			result.push(unpack(value));
		}
	}

	return result.join(" ");
};

/*
	Recursively breaks down args into command
*/
var unpack = function(args) {
	var value;
	var result = [];

	if(typeof args === "string") {
		result.push(args);
	} else if(Array.isArray(args)) {
		result.push(glue(args));
	} else if(typeof args === "object") {
		for(var key in args) {
			value = args[key];

			if(key === "flags") {
				if(Array.isArray(value) === true && value.length > 0) {
					result.push(B.supplant("-{0}", [ value.join("") ]));
				} else {
					result.push(B.supplant("-{0}", [ value ]));
				}
			} else if (value === true) {
				result.push(B.supplant("--{0}", [ key ]));
			} else if (value !== false) {
				if(Array.isArray(value) === true && value.length > 0) {
					result.push(B.supplant("--{0}=\"{1}\"", [ key, value.join(",") ]));
				} else {
					result.push(B.supplant("--{0}=\"{1}\"", [ key, value ]));
				}
			}
		}
	}

	return result.filter(function(e) { return e !== ""; }).join(" ");
};

module.exports = glue;
