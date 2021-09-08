const relationalDBWrapper = require('../dbwrapper/RelationalDBWrapper');

async function searchNameOfInteressen(subwort) {
    const query = 'SELECT Bezeichnung FROM Interessen WHERE Bezeichnung LIKE $1';
    return (await relationalDBWrapper.sendQuery(query, [subwort + '%']))['rows'];
}

module.exports.searchNameOfInteressen = searchNameOfInteressen;