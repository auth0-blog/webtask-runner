"use strict"
var chai = require('chai');
var expect = chai.expect;

require('../require-version');

describe('require module', function() {
	it('should resolve default module', function(){
		var mod_a = require('module_a');

		expect(mod_a.packageInfo().name).to.equal('module_a');
		expect(mod_a.packageInfo().version).to.equal('1.1.0');
	});

	it('should error if missing', function() {
		var reqFn = function() {
			require('module_none');
		}
		
		expect(reqFn).to.throw(Error);
	});

	it('should resolve exact module version', function() {
		var mod_a = require('module_a@1.0.0');

		expect(mod_a.packageInfo().name).to.equal('module_a');
		expect(mod_a.packageInfo().version).to.equal('1.0.0');
	})

	it('should resolve semver match', function() {
		var mod_a = require('module_a@^1.x');

		expect(mod_a.packageInfo().name).to.equal('module_a');
		expect(mod_a.packageInfo().version).to.equal('1.9.0');
	})

	it('should error if no semver match', function() {
		var reqFn = function() {
			require('module_a@3.0.0');
		}
		
		expect(reqFn).to.throw(Error);
	})

	it('should error if no versioned modules exists', function() {
		var reqFn = function() {
			require('module_none@1.0.0');
		}
		
		expect(reqFn).to.throw(Error);
	})
});