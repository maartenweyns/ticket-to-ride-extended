const node = function (id) {
    this.id = id;
    this.edges = [];
}

node.prototype.getId = function () {
    return this.id;
}

node.prototype.addEdge = function (edge) {
    this.edges.push(edge);
}

node.prototype.getEdges = function () {
    return this.edges;
}

module.exports = node;