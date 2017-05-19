"use strict";

var Module = require('module');
var path = require('path');
var fs = require('fs');
var semver = require('semver');
var baseRequire = module.constructor.prototype.require;

var findVersion = function(versionPath, soughtModule, soughtVersion) {
	var versions = fs.readdirSync(path.join(versionPath, soughtModule));
	var match = null;

	versions.sort(semver.rcompare);
	for(var i = 0; i < versions.length; i++) {
		if (semver.satisfies(versions[i], soughtVersion)) {
			return versions[i];
		}
	}

	return match;
};

module.constructor.prototype.require = function(request) {
	var newRequest = request;
	var versionedRequest = request.split('@');

	if (versionedRequest.length === 2) {
		var basePath = path.dirname(this.filename);
		var versionedModulesPath = path.join(basePath, 'node_ver_modules');

		var match = findVersion(versionedModulesPath, versionedRequest[0], versionedRequest[1]);
		
		if (match !== null) {
			// Prepend modules path and change request to resolve specific version
			this.paths.unshift(path.join(versionedModulesPath)); 
			newRequest = path.join(versionedRequest[0], match);	
		}
	}

	return baseRequire.apply(this, [newRequest]);
};

module.exports = require;