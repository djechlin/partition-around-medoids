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

function rand(n) {
	return Math.floor(Math.random() * n);
}

function randomElement(array) {
	return array[rand(array.length)];
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
		var bestMedoidIndices = [];

		for (var medoidIndex = 0; medoidIndex < this.numberOfMedoids; medoidIndex++) {
			var medoid = medoids[medoidIndex];
			var distance = this.distances[medoid][object];
			if(distance === bestDistance) {
				bestMedoidIndices.push(medoidIndex);
			}
			if (distance < bestDistance) {
				bestDistance = distance;
				bestMedoidIndices = [medoidIndex];
			}
		}

		// if tie between multiple clusters, choose the smallest
		// since even distribution works better for this algorithm
		// may choose first cluster among tie

		var smallestCluster = [];
		var smallestSize = Infinity;

		bestMedoidIndices.forEach(function(bestMedoidIndex) {
			var bestMedoid = medoids[bestMedoidIndex];

			if(clusters[bestMedoidIndex].length === smallestSize) {
				smallestCluster.push(clusters[bestMedoidIndex]);
			}

			else if(clusters[bestMedoidIndex].length < smallestSize) {
				smallestSize = clusters[bestMedoidIndex].length;
				smallestCluster = [clusters[bestMedoidIndex]];
			}
		});

		randomElement(smallestCluster).push(object);
	}

	return clusters;
};

KMedoids.prototype.randomMedoids = function() {
	return shuffle(range(this.size)).slice(0, this.numberOfMedoids);
};


KMedoids.prototype.optimizeCluster = function(cluster) {
	var bestTotalDistance = Infinity;
	var bestMedoids = [];

	var self = this;


	cluster.forEach(function(candidateMedoid) {
		var totalDistance = 0;

		cluster.forEach(function(clusterNode) {
			totalDistance += self.distances[clusterNode][candidateMedoid];
		});

		if(totalDistance === bestTotalDistance) {
			bestMedoids.push(candidateMedoid);
		}

		else if (totalDistance < bestTotalDistance) {
			bestTotalDistance = totalDistance;
			bestMedoids = [candidateMedoid];
		}
	});

	var best = randomElement(bestMedoids);
	return best;
};