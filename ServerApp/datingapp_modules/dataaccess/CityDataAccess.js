const noSqlWrapper = require('../dbwrapper/NoSQLWrapper');

async function queryCity(landCode, plz, ortName) {
    return await noSqlWrapper.sendQuery('World', 'postal', {'country_code' : landCode, 'postal_code' : plz, 'place_name' : ortName});
}

async function queryCities(landCode, plz, ortName) {
    return await noSqlWrapper.sendQuery('World', 'postal', {'country_code' : landCode, 'postal_code' : plz, 'place_name' : {$regex : '^' + ortName}});
}

module.exports.queryCity = queryCity;
module.exports.queryCities = queryCities;