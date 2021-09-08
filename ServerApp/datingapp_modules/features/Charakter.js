const tokenAuthentication = require('../tools/TokenAuthentication');

const charakterDataAccess = require('../dataaccess/CharakterDataAccess');

async function searchNameOfCharaktere(authToken, subwort, toIgnore) {
    const currentUser = tokenAuthentication.authToken(authToken);
	
	if (!currentUser) {
		return;
    }
    
    const charaktereSqlResult = await charakterDataAccess.searchNameOfCharaktere(subwort);

    let charaktere = [];
    charaktereSqlResult.forEach(function (element) {
        charaktere.push(element['bezeichnung']);
    });

    return charaktere.filter(function (x) { if (!toIgnore.includes(x)) { return x; } });
}

module.exports.searchNameOfCharaktere = searchNameOfCharaktere;