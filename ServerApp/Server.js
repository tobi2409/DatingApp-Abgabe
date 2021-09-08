require('dotenv').config();

const express = require('express');
const https = require('https');
const fs = require('fs');
const bodyParser = require('body-parser');
const cors = require('cors');

// Express ist Mini-App (bestehend aus HTTP-Server und URL-Routing)
const app = express();
app.use(express.json({
	'limit': '2mb'
})); // damit POST-Parameter verstanden werden
app.use(bodyParser.raw({type: 'application/octet-stream', limit : '2mb'}));
app.use(cors());
/*app.use(session({
	secret: 'secret',
	cookie: { maxAge: 60000 },
	rolling: true,
	resave: true,
	saveUninitialized: false
}));*/
/*app.use(bodyParser.urlencoded({
	extended: true
})); // damit POST-Parameter verstanden werden
*/

const certificateConfig = require('../certificate.config.js');

const userModule = require('./datingapp_modules/features/User');
const potentialMatches = require('./datingapp_modules/features/PotentialMatches');
const cityModule = require('./datingapp_modules/features/City');
const interesseModule = require('./datingapp_modules/features/Interesse');
const charakterModule = require('./datingapp_modules/features/Charakter');

async function login(req, res) {
	const nutzername = req.body.nutzername;
	const passwort = req.body.passwort;
	
	try {
		const result = await userModule.login(nutzername, passwort);
		res.send(result);
	} catch (e) {
		console.error(e);
		res.send({'Error' : e.message});
	}
}

async function register(req, res) {
	const nutzername = req.body.nutzername;
	const passwort = req.body.passwort;
	const vorname = req.body.vorname;
	const geburtsdatum = req.body.geburtsdatum;
	const landCode = req.body.landCode; // abhängig von Mongo-Collection
	const plz = req.body.plz; // abhängig von Mongo-Collection
	const ortName = req.body.ortName; // abhängig von Mongo-Collection
	const geschlecht = req.body.geschlecht;
	const partnergeschlecht = req.body.partnergeschlecht;

	try {
		await userModule.register(nutzername, passwort, vorname, geburtsdatum, landCode, plz, ortName, geschlecht, partnergeschlecht);
		res.send({});
	} catch (e) {
		console.error(e);
		res.send({'Error' : e.message});
	}
}

async function searchCities(req, res) {
	const landCode = req.body.landCode;
	const plz = req.body.plz;
	const cityName = req.body.cityname;

	try {
		const result = await cityModule.searchCities(landCode, plz, cityName);
		res.send(result);
	} catch (e) {
		console.error(e);
		res.send({'Error' : e.message});
	}
}

async function getUserData(req, res) {
	const auth = req.headers['authorization'];
	const requestedUsername = req.body['requestedUsername'];

	try {
		const result = await userModule.getUserData(auth, requestedUsername);
		res.send(result);
	} catch (e) {
		console.error(e);
		res.send({'Error' : e.message});
	}
}

async function getUserData_ShortOverview(req, res) {
	const auth = req.headers['authorization'];
	const requestedUsername = req.body['requestedUsername'];

	try {
		const result = await userModule.getUserData_ShortOverview(auth, requestedUsername);
		res.send(result);
	} catch (e) {
		console.error(e);
		res.send({'Error' : e.message});
	}
}

async function searchForPotentialMatches(req, res) {
	const auth = req.headers['authorization'];

	try {
		const result = await potentialMatches.searchForPotentialMatches(auth);
		res.send(result);
	} catch (e) {
		console.error(e);
		res.send({'Error' : e.message});
	}
}

async function changeUserData(req, res) {
	const auth = req.headers['authorization'];

	const nutzername = req.body.nutzername;
	const vorname = req.body.vorname;
	const geburtsdatum = req.body.geburtsdatum;
	const landCode = req.body.landCode;
	const plz = req.body.plz;
	const ortName = req.body.ortName;
	const suchumkreis = req.body.suchumkreis;
	const geschlecht = req.body.geschlecht;
	const partnergeschlecht = req.body.partnergeschlecht;
	const groesse = req.body.groesse;
	const gewicht = req.body.gewicht;
	const koerperbau = req.body.koerperbau;
	const haarfarbe = req.body.haarfarbe;
	const augenfarbe = req.body.augenfarbe;
	const gesichtszug = req.body.gesichtszug;

	try {
		await userModule.changeUserData(auth, nutzername, vorname, geburtsdatum,
			landCode, plz, ortName, suchumkreis, geschlecht, partnergeschlecht, groesse, gewicht, koerperbau, haarfarbe, augenfarbe, gesichtszug);
		res.send({});
	} catch (e) {
		console.error(e);
		res.send(e.message);
	}
}

async function addInteresseToUser(req, res) {
	const auth = req.headers['authorization'];

	const interesse = req.body.interesse;
	const wichtung = req.body.wichtung;

	try {
		await userModule.addInteresseToUser(auth, interesse, wichtung);
		res.send({});
	} catch (e) {
		console.error(e);
		res.send(e.message);
	}
}

async function removeInteresseFromUser(req, res) {
	const auth = req.headers['authorization'];

	const interesse = req.body.interesse;

	try {
		await userModule.removeInteresseFromUser(auth, interesse);
		res.send({});
	} catch (e) {
		console.error(e);
		res.send(e.message);
	}
}

async function addCharakterToUser(req, res) {
	const auth = req.headers['authorization'];

	const charakter = req.body.charakter;
	const wichtung = req.body.wichtung;

	try {
		await userModule.addCharakterToUser(auth, charakter, wichtung);
		res.end({});
	} catch (e) {
		console.error(e);
		res.send(e.message);
	}
}

async function removeCharakterFromUser(req, res) {
	const auth = req.headers['authorization'];

	const charakter = req.body.charakter;

	try {
		await userModule.removeCharakterFromUser(auth, charakter);
		res.send({});
	} catch (e) {
		console.error(e);
		res.send(e.message);
	}
}

async function addImageToUser(req, res) {
	const auth = req.headers['authorization'];

	const imageContent = req.body;

	try {
		await userModule.addImageToUser(auth, imageContent);
		res.end();
	} catch (e) {
		res.send(e.message);
	}
}

async function searchNameOfWichtungen(req, res) {
	const auth = req.headers['authorization'];

	const table = req.body.table;
	const subwort = req.body.subwort;
	const toIgnore = req.body.toIgnore;

	try {
		let result;

		if (table == 'Interessen') {
			result = await interesseModule.searchNameOfInteressen(auth, subwort, toIgnore);
		} else if (table == 'Charaktere') {
			result = await charakterModule.searchNameOfCharaktere(auth, subwort, toIgnore);
		}

		res.send(result);
	} catch (e) {
		res.send(e.message);
	}
}

app.post('/login', function(req, res) {
	login(req, res);
});

app.post('/register', function(req, res) {
	register(req, res);
});

app.post('/searchCities', function(req, res) {
	searchCities(req, res);
});

app.post('/getUserData', function(req, res) {
	getUserData(req, res);
});

app.post('/getUserData_ShortOverview', function(req, res) {
	getUserData_ShortOverview(req, res);
});

app.post('/searchForPotentialMatches', function(req, res) {
	searchForPotentialMatches(req, res);
});

app.post('/changeUserData', function(req, res) {
	changeUserData(req, res);
});

app.post('/addInteresseToUser', function(req, res) {
	addInteresseToUser(req, res);
});

app.post('/removeInteresseFromUser', function(req, res) {
	removeInteresseFromUser(req, res);
});

app.post('/addCharakterToUser', function(req, res) {
	addCharakterToUser(req, res);
});

app.post('/removeCharakterFromUser', function(req, res) {
	removeCharakterFromUser(req, res);
});

app.post('/addImageToUser', function(req, res) {
	addImageToUser(req, res);
});

app.post('/searchNameOfWichtungen', function(req, res) {
	searchNameOfWichtungen(req, res);
});

/*https.createServer({
	'cert': fs.readFileSync(certificateConfig.certFileName),
	'key': fs.readFileSync(certificateConfig.keyFileName)
}, app).listen(8080);*/

app.listen(8080);