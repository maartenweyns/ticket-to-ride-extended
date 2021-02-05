const edge = function(to, weight) {
    this.to = to;
    this.weight = weight;
}

edge.prototype.getTo = function () {
    return this.to;
}

edge.prototype.getWeight = function () {
    return this.weight;
}

module.exports = edge;