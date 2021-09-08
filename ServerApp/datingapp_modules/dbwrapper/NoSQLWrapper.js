const client = require('mongodb').MongoClient;
const nosqlConfig = require('../../config/nosql');

const url = nosqlConfig.url;

let connection = null;

client.connect(url, {poolSize : 10}, function(err, db) {
	connection = db;
});

async function sendQuery(dbName, collectionName, searchQuery) {
	try {
		const dbo = connection.db(dbName);
		return await dbo.collection(collectionName).find(searchQuery).toArray();
	} catch (e) {
		throw e;
	}
}

process.on('SIGINT', function() {
	console.log('SIGINT');
	connection.close();
	process.exit();
});

module.exports.sendQuery = sendQuery;