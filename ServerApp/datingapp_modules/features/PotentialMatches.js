const tokenAuthentication = require('../tools/TokenAuthentication');
const potentialMatchesDataAccess = require('../dataaccess/userdataaccess/PotentialMatches');
const potentialMatchesLogic = require('./potentialmatches/PotentialMatchesLogic.js');

const geolib = require('geolib');

async function searchForPotentialMatches(authToken) {
	// Wenn man nicht angemeldet ist, darf man auch von anderen nichts sehen
	const currentUser = tokenAuthentication.authToken(authToken);
	
	if (!currentUser) {
		return;
	}
	
	const currentUUID = currentUser.UUID;

	const ownPersonResult = await potentialMatchesDataAccess.queryOwnUser_PotentialMatches(currentUUID);

	if (!ownPersonResult) {
		return;
	}

	const longitude = ownPersonResult['longitude'];
	const latitude = ownPersonResult['latitude'];
	const suchUmkreis = ownPersonResult['suchumkreis'];
	const geschlechtId = ownPersonResult['geschlecht_id'];
	const partnerGeschlechtId = ownPersonResult['partnergeschlecht_id'];

	const boundsOfDistance = geolib.getBoundsOfDistance({'latitude' : latitude, 'longitude' : longitude}, suchUmkreis * 1000);

	const otherPersonsResult = await potentialMatchesDataAccess.queryPotentialMatches(currentUUID, boundsOfDistance, geschlechtId, partnerGeschlechtId);
	
	if (otherPersonsResult.length == 0) {
		return;
	}

	const interessen = ownPersonResult['interessen'];
	const charaktere = ownPersonResult['charaktere'];
	
	return potentialMatchesLogic.calcPotentialMatchesByProperties(interessen, charaktere, otherPersonsResult);
}

module.exports.searchForPotentialMatches = searchForPotentialMatches;