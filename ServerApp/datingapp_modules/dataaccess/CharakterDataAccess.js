const relationalDBWrapper = require('../dbwrapper/RelationalDBWrapper');

async function searchNameOfCharaktere(subwort) {
    const query = 'SELECT Bezeichnung FROM Charaktere WHERE Bezeichnung LIKE $1';
    return (await relationalDBWrapper.sendQuery(query, [subwort + '%']))['rows'];
}

module.exports.searchNameOfCharaktere = searchNameOfCharaktere;