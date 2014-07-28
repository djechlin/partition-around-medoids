"use strict";

function shuffleArray(array) {
	for (var i = array.length - 1; i > 0; i--) {
		var j = Math.floor(Math.random() * (i + 1));
		var temp = array[i];
		array[i] = array[j];
		array[j] = temp;
	}
	return array;
}

function range(bound) {
	return Array.apply(null, {length: bound}).map(Number.call, Number);
}

var KMedoids = module.exports = function KMedoids(size, distances, numberOfMedoids) {

	this.size = size;
	this.distances = distances;
	this.numberOfMedoids = numberOfMedoids;
}

KMedoids.prototype.run = function(medoids) {

	// first, pick numberOfMedoids random starting medoids

	medoids = medoids || randomMedoids();

	// assign each object to closest medoid

	var clusters = assign(medoids);

	// get new medoids

	var newMedoids = naturalMedoids(clusters);

	// optimize each cluster

	return newMedoids.toString() === medoids.toString() ? newMedoids : this.run(newMedoids);

};

KMedoids.prototype.naturalMedoids = function(clusters) {
	var newMedoids = [];
	for (var medoid = 0; medoid < this.numberOfMedoids; medoid++) {
		var cluster = clusters[medoid];
		var newMedoid = optimizeCluster(cluster);
		newMedoids.push(newMedoid);
	}

	return newMedoids;
};

KMedoids.prototype.assign = function(medoids) {
	var clusters = medoids.map(function() {
		return [];
	});

	for (var object = 0; object < this.size; object++) {

		var bestDistance = Infinity;
		var bestMedoid = -1;

		for (var medoid = 0; medoid < numberOfMedoids; medoid++) {
			var distance = this.distances[medoid][object];
			if (distance < bestDistance) {
				bestDistance = distance;
				bestMedoid = medoid;
			}
		}

		clusters[bestMedoid].push(object);
	}

	return clusters;
}

function randomMedoids(size, numberOfMedoids) {
	return shuffle(range(size)).slice(numberOfMedoids);
}


function optimizeCluster(cluster) {
	var bestTotalDistance = Infinity;
	var bestMedoid = -1;


	cluster.forEach(function(candidateMedoid) {
		var totalDistance = 0;

		cluster.forEach(function(clusterNode) {
			totalDistance += distances[clusterNode][candidateMedoid];
		});

		if (totalDistance < bestTotalDistance) {
			totalDistance = bestTotalDistance;
			bestMedoid = candidateMedoid;
		}
	});

	return bestMedoid;
}