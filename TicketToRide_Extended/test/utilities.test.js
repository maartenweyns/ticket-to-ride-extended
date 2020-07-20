const utilities = require('../utilities');

describe('First routes verification tests', () => {
    test('Validate Routes Test True Both Continents', () => {
        let routeid1 = 'eu-something-something-1';
        let routeid2 = 'us-something-something-2';

        let routearray = [routeid1, routeid2];

        let returned = utilities.validateFirstRoutesPicked(routearray, true, true);

        expect(returned).toBeTruthy();
    });

    test('Validate Routes Test False Both Continents', () => {
        let routeid1 = 'eu-something-something-1';
        let routeid2 = 'eu-something-something-2';

        let routearray = [routeid1, routeid2];

        let returned = utilities.validateFirstRoutesPicked(routearray, true, true);

        expect(returned).toBeFalsy();
    });

    test('Validate Routes Test True Only EU', () => {
        let routeid1 = 'eu-something-something-1';

        let routearray = [routeid1];

        let returned = utilities.validateFirstRoutesPicked(routearray, true, false);

        expect(returned).toBeTruthy();
    });

    test('Validate Routes Test False Only EU', () => {
        let routeid1 = 'us-something-something-1';

        let routearray = [routeid1];

        let returned = utilities.validateFirstRoutesPicked(routearray, true, false);

        expect(returned).toBeFalsy();
    });

    test('Validate Routes Test True Only US', () => {
        let routeid1 = 'us-something-something-1';

        let routearray = [routeid1];

        let returned = utilities.validateFirstRoutesPicked(routearray, false, true);

        expect(returned).toBeTruthy();
    });

    test('Validate Routes Test False Only US', () => {
        let routeid1 = 'eu-something-something-1';

        let routearray = [routeid1];

        let returned = utilities.validateFirstRoutesPicked(routearray, false, true);

        expect(returned).toBeFalsy();
    });

    test('Validate Routes Test Both Continents Empty', () => {
        let routearray = [];

        let returned = utilities.validateFirstRoutesPicked(routearray, true, true);

        expect(returned).toBeFalsy();
    });

    test('Validate Routes Test Undefined', () => {
        let routearray = undefined;

        let returned = utilities.validateFirstRoutesPicked(routearray);

        expect(returned).toBeFalsy();
    });
});