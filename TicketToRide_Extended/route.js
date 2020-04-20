const route = function (begin, end, variant, blackReq, blueReq,
                        brownReq, greenReq, locoReq, purpleReq, redReq, whiteReq, yellowReq) {

    this.begin = begin;
    this.end = end;
    this.variant = variant;
    this.blackReq = blackReq;
    this.blueReq = blueReq;
    this.brownReq = brownReq;
    this.greenReq = greenReq;
    this.locoReq = locoReq;
    this.purpleReq = purpleReq;
    this.redReq = redReq;
    this.whiteReq = whiteReq;
    this.yellowReq = yellowReq;
};

route.prototype.checkAvailability = function () {

};

route.prototype.checkEligibility = function (route, player) {

};
