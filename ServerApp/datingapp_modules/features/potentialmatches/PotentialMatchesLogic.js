function calcPotentialMatchesByProperties(interessen, charaktere, otherPersonsResult) {
	// Interessen- und Charaktervergleich
	// JSON-Object im MySql-Query vielleicht besser, um Interessen-IDs und Wichtungen zusammenzubringen?

	const potenzielleMatches = [];

	otherPersonsResult.forEach(function (element) {
        const otherPersonInteressen = element['interessen'];
		const zusammengeführteInteressen = interessen.concat(otherPersonInteressen);
		
        const interessenBewertungen = createMatchBewertungTable(zusammengeführteInteressen);
		
		const otherPersonCharaktere = element['charaktere'];
		const zusammengeführteCharaktere = charaktere.concat(otherPersonCharaktere);
		
        const charakterBewertungen = createMatchBewertungTable(zusammengeführteCharaktere);
		
		const erreichtePunkte = interessenBewertungen[0]['Erreichte_Punkte'] + charakterBewertungen[0]['Erreichte_Punkte'];
		const maxPunkte = interessenBewertungen[0]['Max_Punkte'] + charakterBewertungen[0]['Max_Punkte'];
		const relation = (erreichtePunkte / maxPunkte).toFixed(2);
		
		potenzielleMatches.push({'Relation' : relation, 'UUID' : element['uuid'], 'Bild' : element['bild'],
			'Nutzername' : element['nutzername'], 'Vorname' : element['vorname']});
	});
	
	potenzielleMatches.sort(comparePersonsByMatchRelation);

	return potenzielleMatches;
}

function createMatchBewertungTable(zusammengeführteListe) {
	const result = [];
	
	const bewertungsTabelle_EinzelneSchwerpunkte = createMatchBewertungTable_EinzelneSchwerpunkte(zusammengeführteListe);
	const gesamtPunkte = calcTotalPoints(bewertungsTabelle_EinzelneSchwerpunkte);
	
	result.push(gesamtPunkte);
	
	return result;
}

function createMatchBewertungTable_EinzelneSchwerpunkte(zusammengeführteListe) {
	const bewertungsTabelle = [];
	
	zusammengeführteListe.forEach(function (element) {
		const findIndexById = bewertungsTabelle.findIndex(function (filterItem) { return filterItem['ID'] == element['ID']; });
	
		let bewertung = null;
	
		if (findIndexById == -1) {
			bewertung = {'ID' : element['ID'], 'Erreichte_Punkte' : 0, 'Max_Punkte' : element['Wichtung']};
			bewertungsTabelle.push(bewertung);
		} else {
			if (bewertungsTabelle[findIndexById]['Max_Punkte'] < element['Wichtung']) {
				bewertung = {'ID' : element['ID'], 'Erreichte_Punkte' : bewertungsTabelle[findIndexById]['Max_Punkte'], 'Max_Punkte' : element['Wichtung']};
			} else {
				bewertung = {'ID' : element['ID'], 'Erreichte_Punkte' : element['Wichtung'], 'Max_Punkte' : bewertungsTabelle[findIndexById]['Max_Punkte']};
			}
			bewertungsTabelle[findIndexById] = bewertung;
		}
	});
	
	return bewertungsTabelle;
}

function calcTotalPoints(bewertungsTabelle) {
	const gesamtPunkte = {'Erreichte_Punkte' : 0, 'Max_Punkte' : 0, 'Relation' : 0};
	
	bewertungsTabelle.forEach(function (element) {
		const erreichtePunkte = element['Erreichte_Punkte'];
		const maxPunkte = element['Max_Punkte'];
		
		gesamtPunkte['Erreichte_Punkte'] = gesamtPunkte['Erreichte_Punkte'] + erreichtePunkte;
		gesamtPunkte['Max_Punkte'] = gesamtPunkte['Max_Punkte'] + maxPunkte;
	});
	
	gesamtPunkte['Relation'] = gesamtPunkte['Erreichte_Punkte'] / gesamtPunkte['Max_Punkte'];
	
	return gesamtPunkte;
}

function comparePersonsByMatchRelation(a, b) {
	if (a['Relation'] < b['Relation']) {
		return 1;
	}
	
	return -1;
}

module.exports.calcPotentialMatchesByProperties = calcPotentialMatchesByProperties;