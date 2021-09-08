const bcrypt = require('bcrypt');
const fs = require('fs');

const tokenAuthentication = require('../tools/TokenAuthentication');

const userDataAccess = require('../dataaccess/userdataaccess/UserDataAccess');
const cityDataAccess = require('../dataaccess/CityDataAccess');

const loginLogic = require('./login/LoginLogic');

async function login(username, passwort) {
	const user = await userDataAccess.queryUser_LoginData(username);
	return loginLogic.login(user, passwort);
}

async function register(nutzername, passwort, vorname, geburtsdatum, landCode, plz, ortName, geschlecht, partnergeschlecht) {
	const propertiesOfCity = await cityDataAccess.queryCity(landCode, plz, ortName);

	if (propertiesOfCity.length != 1) {
		throw new Error('City not found');
	}
		
	const longitude = propertiesOfCity[0]['longitude'];
	const latitude = propertiesOfCity[0]['latitude'];
	//const ortName = propertiesOfCity[0]['place_name'];

	// in MySQL-DB zwischenlagern, da Kommunikation zwischen Mongo und MySql zu aufwendig

	// ist hier ein Fehler, wird dieser ordnungsgemäß bis Aufruf von Server.js weitergeleitet
	const hashedPasswort = await bcrypt.hash(passwort, 10);
	await userDataAccess.createUser(nutzername, hashedPasswort, vorname, geburtsdatum, landCode, plz, ortName, longitude, latitude, geschlecht, partnergeschlecht);
}

async function getUserData(authToken, requestedUsername) {
	// Wenn man nicht angemeldet ist, darf man auch von anderen nichts sehen
	const currentUser = tokenAuthentication.authToken(authToken);
	
	if (!currentUser) {
		return;
	}
    
	const data = await userDataAccess.queryUser_GeneralData(requestedUsername);
	
	if (!data) {
		throw new Error('No User found');
	}

	return data;
}

async function getUserData_ShortOverview(authToken, requestedUsername) {
	const currentUser = tokenAuthentication.authToken(authToken);
	
	if (!currentUser) {
		return;
	}
    
	const data = await userDataAccess.queryUser_ShortOverview(requestedUsername);
	
	if (!data) {
		throw new Error('No User found');
	}

	return data;
}

async function changeUserData(authToken, nutzername, vorname, geburtsdatum,
	landCode, plz, ortName, suchumkreis, geschlecht, partnergeschlecht, groesse, gewicht, koerperbau, haarfarbe, augenfarbe, gesichtszug) {

	const currentUser = tokenAuthentication.authToken(authToken);
	
	if (!currentUser) {
		return;
	}

	const currentUUID = currentUser.UUID;

	let longitude = null;
	let latitude = null;

	if (landCode && plz && ortName) {
		const propertiesOfCity = await cityDataAccess.queryCity(landCode, plz, ortName);

		if (propertiesOfCity.length != 1) {
			throw new Error('City not found');
		}
			
		longitude = propertiesOfCity[0]['longitude'];
		latitude = propertiesOfCity[0]['latitude'];
	}

	await userDataAccess.changeUserData
		(currentUUID, nutzername, vorname, geburtsdatum, landCode, plz, ortName, longitude, latitude, suchumkreis,
			geschlecht, partnergeschlecht, groesse, gewicht, koerperbau, haarfarbe, augenfarbe, gesichtszug);
}

async function addInteresseToUser(authToken, interesse, wichtung) {

    const currentUser = tokenAuthentication.authToken(authToken);
	
	if (!currentUser) {
		return;
	}

    const currentUUID = currentUser.UUID;

    await userDataAccess.linkInteresseToUser(currentUUID, interesse, wichtung);
}

async function removeInteresseFromUser(authToken, interesse) {
	const currentUser = tokenAuthentication.authToken(authToken);

	if (!currentUser) {
		return;
	}

	const currentUUID = currentUser.UUID;

	await userDataAccess.removeInteresseFromUser(currentUUID, interesse);
}

async function addCharakterToUser(authToken, charakter, wichtung) {

    const currentUser = tokenAuthentication.authToken(authToken);
	
	if (!currentUser) {
		return;
	}

    const currentUUID = currentUser.UUID;

    await userDataAccess.linkCharakterToUser(currentUUID, charakter, wichtung);
}

async function removeCharakterFromUser(authToken, charakter) {
	const currentUser = tokenAuthentication.authToken(authToken);

	if (!currentUser) {
		return;
	}

	const currentUUID = currentUser.UUID;

	await userDataAccess.removeCharakterFromUser(currentUUID, charakter);
}

//TODO: testen, ob Datei richtiges Format
async function addImageToUser(authToken, imageContent) {
	const currentUser = tokenAuthentication.authToken(authToken);
	
	if (!currentUser) {
		return;
	}

	const currentUUID = currentUser.UUID;
	
	//const row = fs.readFileSync(fileName);
	
	await userDataAccess.addImageToUser(currentUUID, imageContent);
}

module.exports.login = login;
module.exports.register = register;
module.exports.getUserData = getUserData;
module.exports.getUserData_ShortOverview = getUserData_ShortOverview;
module.exports.changeUserData = changeUserData;
module.exports.addInteresseToUser = addInteresseToUser;
module.exports.removeInteresseFromUser = removeInteresseFromUser;
module.exports.addCharakterToUser = addCharakterToUser;
module.exports.removeCharakterFromUser = removeCharakterFromUser;
module.exports.addImageToUser = addImageToUser;