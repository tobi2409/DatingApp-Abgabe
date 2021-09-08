const rdbModule = require('pg');

const rdbConfig = require('../../config/rdb');

console.log('RelationalDBWrapper');

// Pool sammelt bestehende Verbindungen
// wenn eine Verbindung fertig ist, wird sie in den Pool gelegt und für die nächste Anfrage verwendet
const pool = new rdbModule.Pool(rdbConfig.config);

// connect läuft asynchron
async function connect(tryFunction, catchFunction = async function(client, e) {}, finallyFunction = async function(client) {}) {
	const client = await pool.connect();

	// Dieses try-catch-finally dient nur, weil z.B. die Transaktion dies erfordert. Sonst könnte man dies auch weglassen und es hätte keine Auswirkung auf Fehlerbehandlung
	// Da innerhalb von client.query im Fehlerfall auch ein throw geschmissen wird. Throw wird so lange in der Aufrufhierarchie nach oben getragen, bis es gecatcht wird
	try {
		await tryFunction(client);
	} catch (e) {
		await catchFunction(client, e);
		throw e;
	} finally {
		await finallyFunction(client);
		client.release();
	}
}

async function sendTransaction(tryFunction) {
	await connect(async function (client) {
		await client.query('BEGIN');
		await tryFunction(client);
		await client.query('COMMIT');
	}, async function (client, e) {
		await client.query('ROLLBACK');
	});
}

async function sendQuery(query, queryValues) {
	let res = null;

	await connect(async function (client) {
		res = await client.query(query, queryValues);
	});
	
	return res;
}

module.exports.connect = connect;
module.exports.sendTransaction = sendTransaction;
module.exports.sendQuery = sendQuery;