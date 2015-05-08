"usage strict"

module.exports.packageInfo = function() {
	var info = require('./package.json');
	return info;
};