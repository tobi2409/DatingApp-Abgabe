const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const SECRET_ACCESS_TOKEN = process.env.SECRET_ACCESS_TOKEN;

// leerer AccessToken entspricht Fehler
async function login(user, passwort) {
	if (!user) {
		return { 'accessToken' : '' };
	}

	// ist hier ein Fehler, wird dieser ordnungsgemäß bis Aufruf von Server.js weitergeleitet
	const isMatch = await bcrypt.compare(passwort, user['passwort']);

    if (isMatch) {
		const accessToken = jwt.sign({ 'UUID' : user['uuid'] }, SECRET_ACCESS_TOKEN);
		return { 'accessToken' : accessToken };
	}
	
	return { 'accessToken' : '' };
}

module.exports.login = login;