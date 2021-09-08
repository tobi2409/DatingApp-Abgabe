var jwt = require('jsonwebtoken');

const SECRET_ACCESS_TOKEN = process.env.SECRET_ACCESS_TOKEN;

// Der AccessToken, der nachdem Login vergeben wird, muss logischerweise vom Client im Authorization-Header enthalten sein.
function authToken(authHeader) {
	// verhält sich ohne Callback synchorn
	return jwt.verify(authHeader, SECRET_ACCESS_TOKEN);
}

module.exports.authToken = authToken;