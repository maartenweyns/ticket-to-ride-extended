const sharp = require('sharp');

const imagery = function(gameID) {
    this.gameID = gameID;
    
    this.euWagonImage = 'iVBORw0KGgoAAAANSUhEUgAADUoAAAiSAQAAAAAyvWL+AAAABGdBTUEAALGPC/xhBQAAAAJ0Uk5TAAB2k804AAAAAmJLR0QAAd2KE6QAAAAHdElNRQfkBRYTIyEQMw4RAAADo0lEQVR42u3BgQAAAADDoPlTX+EAVQEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAnwFMWAABF5aSwQAAACV0RVh0ZGF0ZTpjcmVhdGUAMjAyMC0wNS0yMlQxOTozNTozMyswMDowMLu8BUkAAAAldEVYdGRhdGU6bW9kaWZ5ADIwMjAtMDUtMjJUMTk6MzU6MzMrMDA6MDDK4b31AAAAAElFTkSuQmCC';
    this.usWaognImage = 'iVBORw0KGgoAAAANSUhEUgAABqUAAARJAQAAAABoLDXeAAAABGdBTUEAALGPC/xhBQAAAAJ0Uk5TAAB2k804AAAAAmJLR0QAAd2KE6QAAAAHdElNRQfkBRYTJAQUdkyRAAAA+UlEQVR42u3BAQEAAACCIP+vbkhAAQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADwY5UzAAE6sk3bAAAAJXRFWHRkYXRlOmNyZWF0ZQAyMDIwLTA1LTIyVDE5OjM2OjA0KzAwOjAwG6OHJwAAACV0RVh0ZGF0ZTptb2RpZnkAMjAyMC0wNS0yMlQxOTozNjowNCswMDowMGr+P5sAAAAASUVORK5CYII=';

    this.blueModulation = {};
    this.brightyellowModulation = {hue: -168, saturation: 2, brightness: 4};
    this.greenModulation = {hue: -100, brightness: 1.6};
    this.redModulation = {hue: 140, brightness: 1.4};
    this.purpleModulation = {hue: 76};
    this.greyModulation = {saturation: 0};
    this.lightblueModulation = {hue: -35, brightness: 1.7};
    this.yellowModulation = {hue: 180};
}

imagery.prototype.computeWagons = function(continent, route, color, io, gameID) {

    console.log(`[INFO] Drawing wagons for ${continent} ${route}`);

    let wagonspath = `./public/images/trainsOnMap/${continent}/${route}.png`;
    let oldimage = Buffer.from(this[`${continent}WagonImage`]);

    sharp(wagonspath)
        .modulate(this[`${color}Modulation`])
        // .composite([{input: oldimage}])
        .toFormat('png')
        .toBuffer()
        .then(data => {
            this[`${continent}WagonImage`] = data.toString('base64');
            console.log(`[INFO] Finished drawing wagons.`);
            io.in(gameID).emit('wagonimage', this[`${continent}WagonImage`]);
        }); 
}

module.exports = imagery;