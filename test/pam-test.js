"use strict";

var pam = require('../index.js');

var euclidean = function(a,b) { return Math.abs(a,b); };

describe("pam", function() {
	it("should run", function() {
		console.log(pam([1,1,1,1,20,20,20,20], euclidean, 2));
	});
});