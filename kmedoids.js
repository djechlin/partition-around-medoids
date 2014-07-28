"use strict";

function shuffle(array) {
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
};

KMedoids.prototype.run = function(medoids) {

	// first, pick numberOfMedoids random starting medoids

	medoids = medoids || this.randomMedoids();

	// assign each object to closest medoid

	var clusters = this.assign(medoids);

	// get new medoids

	var newMedoids = this.naturalMedoids(clusters);

	// optimize each cluster

	return newMedoids.toString() === medoids.toString() ? clusters : this.run(newMedoids);

};

KMedoids.prototype.naturalMedoids = function(clusters) {
	var newMedoids = [];
	for (var medoid = 0; medoid < this.numberOfMedoids; medoid++) {
		var cluster = clusters[medoid];
		var newMedoid = this.optimizeCluster(cluster);
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
		var bestMedoids = [];

		for (var medoid = 0; medoid < this.numberOfMedoids; medoid++) {
			var distance = this.distances[medoid][object];
			if(distance === bestDistance) {
				bestMedoids.push(medoid);
			}
			if (distance < bestDistance) {
				bestDistance = distance;
				bestMedoids = [medoid];
			}
		}

		// if tie between multiple clusters, choose the smallest
		// since even distribution works better for this algorithm
		// may choose first cluster among tie

		var smallestCluster;
		var smallestSize = Infinity;

		bestMedoids.forEach(function(bestMedoid) {
			if(clusters[bestMedoid].length < smallestSize) {
				smallestSize = clusters[bestMedoid].length;
				smallestCluster = clusters[bestMedoid];
			}
		});

		smallestCluster.push(object);
	}

	return clusters;
};

KMedoids.prototype.randomMedoids = function() {
	return shuffle(range(this.size)).slice(this.numberOfMedoids);
};


KMedoids.prototype.optimizeCluster = function(cluster) {
	var bestTotalDistance = Infinity;
	var bestMedoid = -1;

	var self = this;


	cluster.forEach(function(candidateMedoid) {
		var totalDistance = 0;

		cluster.forEach(function(clusterNode) {
			totalDistance += self.distances[clusterNode][candidateMedoid];
		});

		if (totalDistance < bestTotalDistance) {
			totalDistance = bestTotalDistance;
			bestMedoid = candidateMedoid;
		}
	});

	return bestMedoid;
};