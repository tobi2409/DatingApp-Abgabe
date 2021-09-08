const tokenAuthentication = require('../tools/TokenAuthentication');

const interesseDataAccess = require('../dataaccess/InteresseDataAccess');

async function searchNameOfInteressen(authToken, subwort, toIgnore) {
    const currentUser = tokenAuthentication.authToken(authToken);
	
	if (!currentUser) {
		return;
    }
    
    const interessenSqlResult = await interesseDataAccess.searchNameOfInteressen(subwort);

    let interessen = [];
    interessenSqlResult.forEach(function (element) {
        interessen.push(element['bezeichnung']);
    });

    return interessen.filter(function (x) { if (!toIgnore.includes(x)) { return x; } });
}

module.exports.searchNameOfInteressen = searchNameOfInteressen;