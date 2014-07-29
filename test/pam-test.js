"use strict";

var assert = require('assert');
var pam = require('../index.js');

var euclidean = function(a,b) { return Math.abs(a - b); };

describe("pam", function() {
	it("should run", function() {

		var clusters = pam([1,1,1,1,20,20,20,20], euclidean, 2);
		assert(clusters[0].toString() === '1,1,1,1' || clusters[0].toString() === '20,20,20,20');

	});
});