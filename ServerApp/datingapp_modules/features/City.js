const cityDataAccess = require('../dataaccess/CityDataAccess');

async function searchCities(landCode, plz, cityName) {
    return await cityDataAccess.queryCities(landCode, plz, cityName);
}

module.exports.searchCities = searchCities;