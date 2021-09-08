//TODO: Stufe darunter bauen (unabhängig vom Use-Case), wo man für jede Tabelle auswählen kann, welche Spalten selected werden sollen (u.a. auch mit JOINS)

const relationalDBWrapper = require('../../dbwrapper/RelationalDBWrapper');

async function queryUser_LoginData(username) {
	const query = 'SELECT UUID, Passwort FROM Profile WHERE Nutzername = $1';
	
	const result = await relationalDBWrapper.sendQuery(query, [username]);
	const db_res = result['rows'];
	return db_res.length == 1 ? db_res[0] : null;
}

async function queryUser_GeneralData(username) {
	const query = 'SELECT Nutzername, encode(Bild, \'base64\') AS Bild, Vorname, TO_CHAR(Geburtsdatum, \'YYYY-MM-DD\') AS Geburtsdatum, Groesse, Gewicht, Mongo_Orte.Landcode, Mongo_Orte.PLZ, Mongo_Orte.Name AS Ort, Suchumkreis, Koerperbaus.Bezeichnung AS Koerperbau, Haarfarben.Bezeichnung AS Haarfarbe, Augenfarben.Bezeichnung AS Augenfarbe, Gesichtszuege.Bezeichnung AS Gesichtszug, Geschlechter.Bezeichnung AS Geschlecht, Partnergeschlechter.Bezeichnung AS Partnergeschlecht, JSONB_AGG(DISTINCT JSONB_BUILD_OBJECT(\'Bezeichnung\', Interessen.Bezeichnung, \'Wichtung\', Profil_Interessen.Wichtung)) AS Interessen, JSONB_AGG(DISTINCT JSONB_BUILD_OBJECT(\'Bezeichnung\', Charaktere.Bezeichnung, \'Wichtung\', Profil_Charaktere.Wichtung)) AS Charaktere ' +
			'FROM Profile LEFT JOIN Mongo_Orte ON Ort_ID = Mongo_Orte.Mongo_Ort_ID LEFT JOIN Koerperbaus ON Koerperbau_ID = Koerperbaus.ID LEFT JOIN Haarfarben ON Haarfarbe_ID = Haarfarben.ID LEFT JOIN Augenfarben ON Augenfarbe_ID = Augenfarben.ID LEFT JOIN Gesichtszuege ON Gesichtszug_ID = Gesichtszuege.ID LEFT JOIN Geschlechter ON Geschlecht_ID = Geschlechter.ID LEFT JOIN Geschlechter AS Partnergeschlechter ON Partnergeschlecht_ID = Partnergeschlechter.ID ' +
			'LEFT JOIN Profil_Interessen ON Profile.ID = Profil_Interessen.Profil_ID LEFT JOIN Interessen ON Profil_Interessen.Interesse_ID = Interessen.ID LEFT JOIN Profil_Charaktere ON Profile.ID = Profil_Charaktere.Profil_ID LEFT JOIN Charaktere ON Profil_Charaktere.Charakter_ID = Charaktere.ID WHERE Nutzername = $1 GROUP BY Profile.ID, Mongo_Orte.Mongo_Ort_ID, Koerperbaus.ID, Haarfarben.ID, Augenfarben.ID, Gesichtszuege.ID, Geschlechter.ID, Partnergeschlechter.ID';
	
	return (await relationalDBWrapper.sendQuery(query, [username]))['rows'][0];
}

async function queryUser_ShortOverview(username) {
	const query = 'SELECT Nutzername, encode(Bild, \'base64\') AS Bild, Vorname, TO_CHAR(Geburtsdatum, \'DD/MM/YYYY\') AS Geburtsdatum FROM Profile WHERE Nutzername = $1';
	
	return (await relationalDBWrapper.sendQuery(query, [username]))['rows'][0];
}

async function createUser(nutzername, hashedPasswort, vorname, geburtsdatum, landCode, plz, ortName, longitude, latitude, geschlecht, partnergeschlecht) {
	await relationalDBWrapper.sendTransaction(async function (client) {
		await client.query('INSERT INTO Mongo_Orte(LandCode, PLZ, Longitude, Latitude, Name) VALUES($1, $2, $3, $4, $5) ON CONFLICT DO NOTHING', [landCode, plz, longitude, latitude, ortName]);
		
		const ortId = (await client.query('SELECT Mongo_Ort_ID FROM Mongo_Orte WHERE LandCode = $1 AND PLZ = $2 AND Name = $3', [landCode, plz, ortName]))['rows'][0]['mongo_ort_id'];

		const query = 'INSERT INTO Profile(Nutzername, Passwort, Vorname, Geburtsdatum, Ort_ID, Suchumkreis, Geschlecht_ID, Partnergeschlecht_ID) VALUES($1, $2, $3, $4, $5, $6, (SELECT ID FROM Geschlechter WHERE Bezeichnung = $7), (SELECT ID FROM Geschlechter WHERE Bezeichnung = $8))';
		await client.query(query, [nutzername, hashedPasswort, vorname, geburtsdatum, ortId, 50, geschlecht, partnergeschlecht]);
	});
}

async function changeUserData(uuid, nutzername, vorname, geburtsdatum, landCode, plz, ortName, longitude, latitude, suchumkreis,
	geschlecht, partnergeschlecht, groesse, gewicht, koerperbau, haarfarbe, augenfarbe, gesichtszug) {

	await relationalDBWrapper.sendTransaction(async function (client) {
		await sendConditionalQuery(nutzername, 'UPDATE Profile SET Nutzername = $1 WHERE UUID = $2', [nutzername, uuid]);
		await sendConditionalQuery(vorname, 'UPDATE Profile SET Vorname = $1 WHERE UUID = $2', [vorname, uuid]);
		await sendConditionalQuery(geburtsdatum, 'UPDATE Profile SET Geburtsdatum = $1 WHERE UUID = $2', [geburtsdatum, uuid]);
		await sendConditionalQuery(suchumkreis, 'UPDATE Profile SET Suchumkreis = $1 WHERE UUID = $2', [suchumkreis, uuid]);
		await sendConditionalQuery(geschlecht, 'UPDATE Profile SET Geschlecht_ID = (SELECT ID FROM Geschlechter WHERE Bezeichnung = $1) WHERE UUID = $2', [geschlecht, uuid]);
		await sendConditionalQuery(partnergeschlecht, 'UPDATE Profile SET Partnergeschlecht_ID = (SELECT ID FROM Geschlechter WHERE Bezeichnung = $1) WHERE UUID = $2', [partnergeschlecht, uuid]);
		await sendConditionalQuery(groesse !== undefined, 'UPDATE Profile SET Groesse = $1 WHERE UUID = $2', [groesse, uuid]);
		await sendConditionalQuery(gewicht !== undefined, 'UPDATE Profile SET Gewicht = $1 WHERE UUID = $2', [gewicht, uuid]);
		//await sendConditionalQuery(ortId != null, 'UPDATE Profile SET Ort_ID = $1 WHERE UUID = $2', [ortId, uuid]);
		await sendConditionalQuery(koerperbau !== undefined, 'UPDATE Profile SET Koerperbau_ID = (SELECT ID FROM Koerperbaus WHERE Bezeichnung = $1) WHERE UUID = $2', [koerperbau, uuid]);
		await sendConditionalQuery(haarfarbe !== undefined, 'UPDATE Profile SET Haarfarbe_ID = (SELECT ID FROM Haarfarben WHERE Bezeichnung = $1) WHERE UUID = $2', [haarfarbe, uuid]);
		await sendConditionalQuery(augenfarbe !== undefined, 'UPDATE Profile SET Augenfarbe_ID = (SELECT ID FROM Augenfarben WHERE Bezeichnung = $1) WHERE UUID = $2', [augenfarbe, uuid]);
		await sendConditionalQuery(gesichtszug !== undefined, 'UPDATE Profile SET Gesichtszug_ID = (SELECT ID FROM Gesichtszuege WHERE Bezeichnung = $1) WHERE UUID = $2', [gesichtszug, uuid]);

		if (landCode && plz && ortName && longitude && latitude) {
			//TODO: auslagern
			await client.query('INSERT INTO Mongo_Orte(LandCode, PLZ, Longitude, Latitude, Name) VALUES($1, $2, $3, $4, $5) ON CONFLICT DO NOTHING', [landCode, plz, longitude, latitude, ortName]);
			const ortId = (await client.query('SELECT Mongo_Ort_ID FROM Mongo_Orte WHERE LandCode = $1 AND PLZ = $2 AND Name = $3', [landCode, plz, ortName]))['rows'][0]['mongo_ort_id'];

			client.query('UPDATE Profile SET Ort_ID = $1 WHERE UUID = $2', [ortId, uuid]);
		}

		async function sendConditionalQuery(condition, query, queryValues) {
			if (condition) {
				await client.query(query, queryValues);
			}
		}
	});
}

async function linkInteresseToUser(uuid, interesse, wichtung) {
	await relationalDBWrapper.sendTransaction(async function (client) {
		await client.query('INSERT INTO Interessen(Bezeichnung) VALUES($1) ON CONFLICT DO NOTHING', [interesse]);
		
		const query = 'INSERT INTO Profil_Interessen(Profil_ID, Interesse_ID, Wichtung) VALUES((SELECT ID FROM Profile WHERE UUID = $1), (SELECT ID FROM Interessen WHERE Bezeichnung = $2), $3) ' + 
		'ON CONFLICT (Profil_ID, Interesse_ID) DO UPDATE SET Wichtung = $3 WHERE Profil_Interessen.Profil_ID IN (SELECT ID FROM Profile WHERE UUID = $1) AND Profil_Interessen.Interesse_ID IN (SELECT ID FROM Interessen WHERE Bezeichnung = $2)';
		await client.query(query, [uuid, interesse, wichtung]);
	});
}

async function removeInteresseFromUser(uuid, interesse) {
	await relationalDBWrapper.sendTransaction(async function (client) {
		const queryDeleteLink = 'DELETE FROM Profil_Interessen WHERE Profil_ID IN (SELECT ID FROM Profile WHERE UUID = $1) AND Interesse_ID IN (SELECT ID FROM Interessen WHERE Bezeichnung = $2)';
		await client.query(queryDeleteLink, [uuid, interesse]);

		const queryCount = 'SELECT COUNT(*) FROM Profil_Interessen WHERE Interesse_ID IN (SELECT ID FROM Interessen WHERE Bezeichnung = $1)';
		const count = (await client.query(queryCount, [interesse]))['rows'][0]['count'];

		if (count == 0) {
			await client.query('DELETE FROM Interessen WHERE Bezeichnung = $1', [interesse]);
		}
	});
}

async function linkCharakterToUser(uuid, charakter, wichtung) {
	await relationalDBWrapper.sendTransaction(async function (client) {
		await client.query('INSERT INTO Charaktere(Bezeichnung) VALUES($1) ON CONFLICT DO NOTHING', [charakter]);
	
		const query = 'INSERT INTO Profil_Charaktere(Profil_ID, Charakter_ID, Wichtung) VALUES((SELECT ID FROM Profile WHERE UUID = $1), (SELECT ID FROM Charaktere WHERE Bezeichnung = $2), $3) ' + 
			'ON CONFLICT (Profil_ID, Charakter_ID) DO UPDATE SET Wichtung = $3 WHERE Profil_Charaktere.Profil_ID IN (SELECT ID FROM Profile WHERE UUID = $1) AND Profil_Charaktere.Charakter_ID IN (SELECT ID FROM Charaktere WHERE Bezeichnung = $2)';
		await client.query(query, [uuid, charakter, wichtung]);
	});
}

async function removeCharakterFromUser(uuid, charakter) {
	await relationalDBWrapper.sendTransaction(async function (client) {
		const queryDeleteLink = 'DELETE FROM Profil_Charaktere WHERE Profil_ID IN (SELECT ID FROM Profile WHERE UUID = $1) AND Charakter_ID IN (SELECT ID FROM Charaktere WHERE Bezeichnung = $2)';
		await client.query(queryDeleteLink, [uuid, charakter]);

		const queryCount = 'SELECT COUNT(*) FROM Profil_Charaktere WHERE Charakter_ID IN (SELECT ID FROM Charaktere WHERE Bezeichnung = $1)';
		const count = (await client.query(queryCount, [charakter]))['rows'][0]['count'];

		if (count == 0) {
			await client.query('DELETE FROM Charaktere WHERE Bezeichnung = $1', [charakter]);
		}
	});
}

async function addImageToUser(uuid, row) {
	const query = 'UPDATE Profile SET Bild = $1 WHERE UUID = $2';
	const queryValues = [row, uuid];

	await relationalDBWrapper.sendQuery(query, queryValues);
}

module.exports.queryUser_LoginData = queryUser_LoginData;
module.exports.queryUser_GeneralData = queryUser_GeneralData;
module.exports.queryUser_ShortOverview = queryUser_ShortOverview;
module.exports.createUser = createUser;
module.exports.changeUserData = changeUserData;
module.exports.linkInteresseToUser = linkInteresseToUser;
module.exports.removeInteresseFromUser = removeInteresseFromUser;
module.exports.linkCharakterToUser = linkCharakterToUser;
module.exports.removeCharakterFromUser = removeCharakterFromUser;
module.exports.addImageToUser = addImageToUser;