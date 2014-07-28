"use strict";

module.exports = function(data, metric, numberOfMedoids) {
	// generate matrix

	var distances = data.map(function(left, leftIndex) {
		return data.map(function(right, rightIndex) {
			return metric(left, right);
		});
	});

	return new KMedoids(data.length, distances, numberOfMedoids).run();

}