const assert = require('assert');
const potentialMatchesLogic = require('../datingapp_modules/features/potentialmatches/PotentialMatchesLogic');

describe('Test PotentialMatchesLogic!', function() {
    it('Example #1', function() {
        const interessen = [{'ID' : 1, 'Wichtung' : 10}, {'ID' : 2, 'Wichtung' : 20}];
        const charaktere = [{'ID' : 2, 'Wichtung' : 2}];

        otherPersonsResult = [{'vorname' : 'Anton', 'interessen': [{'ID' : 2, 'Wichtung' : 18}], 'charaktere' : [{'ID' : 1, 'Wichtung' : 10}]}];

        const result = potentialMatchesLogic.calcPotentialMatchesByProperties(interessen, charaktere, otherPersonsResult);

        assert.equal(result.length, 1);
        assert.equal(result[0]['Vorname'], 'Anton');
        assert.equal(result[0]['Relation'], 0.43);
    });

    it('Example #2', function() {
        const interessen = [{'ID' : 1, 'Wichtung' : 10}, {'ID' : 2, 'Wichtung' : 20}, {'ID' : 3, 'Wichtung' : 12}];
        const charaktere = [{'ID' : 2, 'Wichtung' : 2}, {'ID' : 3, 'Wichtung' : 8}];

        otherPersonsResult = [{'vorname' : 'Anton', 'interessen': [{'ID' : 1, 'Wichtung': 6}, {'ID' : 2, 'Wichtung' : 18}],
            'charaktere' : [{'ID' : 1, 'Wichtung' : 10}, {'ID' : 2, 'Wichtung' : 3}, {'ID' : 3, 'Wichtung' : 4}, {'ID' : 4, 'Wichtung' : 10}]}];

        const result = potentialMatchesLogic.calcPotentialMatchesByProperties(interessen, charaktere, otherPersonsResult);

        assert.equal(result.length, 1);
        assert.equal(result[0]['Vorname'], 'Anton');
        assert.equal(result[0]['Relation'], 0.41);
    });

    it('Example #3', function() {
        const interessen = [{'ID' : 1, 'Wichtung' : 10}, {'ID' : 2, 'Wichtung' : 20}, {'ID' : 3, 'Wichtung' : 12}];
        const charaktere = [{'ID' : 2, 'Wichtung' : 2}, {'ID' : 3, 'Wichtung' : 8}];

        otherPersonsResult = [{'vorname' : 'Anton', 'interessen': [{'ID' : 1, 'Wichtung': 6}, {'ID' : 2, 'Wichtung' : 18}],
            'charaktere' : [{'ID' : 1, 'Wichtung' : 10}, {'ID' : 2, 'Wichtung' : 3}, {'ID' : 3, 'Wichtung' : 4}, {'ID' : 4, 'Wichtung' : 10}]},
        
            {'vorname' : 'Berta', 'interessen' : [{'ID' : 1, 'Wichtung' : 12}], 'charaktere' : [{'ID' : 1, 'Wichtung' : 4}, {'ID' : 2, 'Wichtung' : 6}]}];

        const result = potentialMatchesLogic.calcPotentialMatchesByProperties(interessen, charaktere, otherPersonsResult);

        assert.equal(result.length, 2);
        assert.equal(result[0]['Vorname'], 'Anton');
        assert.equal(result[0]['Relation'], 0.41);

        assert.equal(result[1]['Vorname'], 'Berta');
        assert.equal(result[1]['Relation'], 0.19);
    });
});