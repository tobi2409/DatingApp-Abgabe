//TODO: Stufe darunter bauen (unabhängig vom Use-Case)

const relationalDBWrapper = require('../../dbwrapper/RelationalDBWrapper');

async function queryOwnUser_PotentialMatches(userUUID) {
	// Join mit Profil_Interessen, damit mehrere Queries vermieden werden
	// ORDER BY CASE "UUID" WHEN ? THEN 1 END -> die 1. Zeile ist die angemeldete Person selber (KEINE GUTE IDEE, WEIL SONST ALLES AUSGEWÄHLT WIRD UND MAN IM RESULT DANN PRÜFEN MÜSSTE, OB ORT IM SUCHUMKREIS LIEGT)
	
	const query = "SELECT Mongo_Orte.Longitude, Mongo_Orte.Latitude, Suchumkreis, Geschlecht_ID, Partnergeschlecht_ID, JSONB_AGG(DISTINCT JSONB_BUILD_OBJECT('ID', Profil_Interessen.Interesse_ID, 'Wichtung', Profil_Interessen.Wichtung)) AS Interessen, " +
		"JSONB_AGG(DISTINCT JSONB_BUILD_OBJECT('ID', Profil_Charaktere.Charakter_ID, 'Wichtung', Profil_Charaktere.Wichtung)) AS Charaktere " +
		"FROM Profile JOIN Mongo_Orte ON Ort_ID = Mongo_Orte.Mongo_Ort_ID LEFT JOIN Profil_Interessen ON ID = Profil_Interessen.Profil_ID LEFT JOIN Profil_Charaktere ON ID = Profil_Charaktere.Profil_ID WHERE UUID = $1 GROUP BY ID, Mongo_Orte.Mongo_Ort_ID";
        
    const db_res = (await relationalDBWrapper.sendQuery(query, [userUUID]))['rows'];
	return db_res.length == 1 ? db_res[0] : null;
}

async function queryPotentialMatches(userUUID, boundsOfDistance, geschlechtId, partnerGeschlechtId) {
	//PROBLEM: Bei mehreren Left Joins wurde selbes Profil mehrfach für beide gejointe Tabellen aufgelistet -> JSON_ARRAYAGG brachte deswegen einige Einträge mehrfach -> Lösung: DISTINCT 		
	const queryOtherPersons = "SELECT UUID, encode(Bild, \'base64\') AS Bild, Nutzername, Vorname, Geburtsdatum, Mongo_Orte.Longitude, Mongo_Orte.Latitude, JSONB_AGG(DISTINCT JSONB_BUILD_OBJECT('ID', Profil_Interessen.Interesse_ID, 'Wichtung', Profil_Interessen.Wichtung)) AS Interessen, " + 
		"JSONB_AGG(DISTINCT JSONB_BUILD_OBJECT('ID', Profil_Charaktere.Charakter_ID, 'Wichtung', Profil_Charaktere.Wichtung)) AS Charaktere " +
		"FROM Profile JOIN Mongo_Orte ON Ort_ID = Mongo_Orte.Mongo_Ort_ID LEFT JOIN Profil_Interessen ON ID = Profil_Interessen.Profil_ID LEFT JOIN Profil_Charaktere ON ID = Profil_Charaktere.Profil_ID " +
		"WHERE Mongo_Orte.Longitude > $1 AND Mongo_Orte.Longitude < $2 AND Mongo_Orte.Latitude > $3 AND Mongo_Orte.Latitude < $4 " +
		"AND Geschlecht_ID = $5 AND Partnergeschlecht_ID = $6 AND UUID <> $7 GROUP BY Profile.ID, Mongo_Orte.Mongo_Ort_ID";
			
	return (await relationalDBWrapper.sendQuery(queryOtherPersons,
		[boundsOfDistance[0]['longitude'], boundsOfDistance[1]['longitude'], boundsOfDistance[0]['latitude'], boundsOfDistance[1]['latitude'], partnerGeschlechtId, geschlechtId, userUUID]))['rows'];
}

module.exports.queryOwnUser_PotentialMatches = queryOwnUser_PotentialMatches;
module.exports.queryPotentialMatches = queryPotentialMatches;