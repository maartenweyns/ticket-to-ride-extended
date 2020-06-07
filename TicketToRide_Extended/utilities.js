module.exports = {
    getRandomColor: function () {
        var number1 = Math.random();
        if (number1 < 0.87) {
            var number = Math.random();
            if (number < 0.125) {
                return "black";
            } else if (number < 0.25) {
                return "blue";
            } else if (number < 0.375) {
                return "brown";
            } else if (number < 0.5) {
                return "green";
            } else if (number < 0.625) {
                return "purple";
            } else if (number < 0.75) {
                return "red";
            } else if (number < 0.875) {
                return "white";
            } else {
                return "yellow";
            }
        } else {
            return "loco";
        }
    },

    allColorsArray: ['black', 'blue', 'brown', 'green', 'purple', 'red', 'white', 'yellow', 'loco'],
}