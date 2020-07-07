const utilities = require('../utilities');

describe('First routes verification tests', () => {
    test('Validate Routes Test True', () => {
        let routeid1 = 'eu-something-something-1';
        let routeid2 = 'us-something-something-2';

        let routearray = [routeid1, routeid2];

        let returned = utilities.validateFirstRoutesPicked(routearray);

        expect(returned).toBeTruthy();
    });

    test('Validate Routes Test False', () => {
        let routeid1 = 'eu-something-something-1';
        let routeid2 = 'eu-something-something-2';

        let routearray = [routeid1, routeid2];

        let returned = utilities.validateFirstRoutesPicked(routearray);

        expect(returned).toBeFalsy();
    });

    test('Validate Routes Test Empty', () => {
        let routearray = [];

        let returned = utilities.validateFirstRoutesPicked(routearray);

        expect(returned).toBeFalsy();
    });

    test('Validate Routes Test Undefined', () => {
        let routearray = undefined;

        let returned = utilities.validateFirstRoutesPicked(routearray);

        expect(returned).toBeFalsy();
    });
});