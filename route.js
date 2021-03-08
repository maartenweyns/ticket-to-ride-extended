const route = function (stationA, stationB, variant, color, length, locoReq) {
    this.stationA = stationA;
    this.stationB = stationB;
    this.variant = variant;
    this.color = color;
    this.length = length;
    this.locoReq = locoReq;
};

module.exports = route;