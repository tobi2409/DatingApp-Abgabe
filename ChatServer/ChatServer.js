const ws = require('ws');
const https = require('https');
const fs = require('fs');

const certificateConfig = require('../certificate.config.js');

const server = https.createServer({
    'cert': fs.readFileSync(certificateConfig.certFileName),
    'key': fs.readFileSync(certificateConfig.keyFileName)
});

//TODO: Paramter server nochmal anschauen. Name "server" verändern
const webSocketServer = new ws.Server({server});

//TODO: evtl. leichter über Key-Value
let clients = [];

webSocketServer.on('connection', function (client) {
    client.on('message', function (msg) {
        const msgJson = JSON.parse(msg);

        if (msgJson['Type'] == 'Register') {
            clients.push({'Client': client, 'Name' : msgJson['Name'], 'Empfaenger' : msgJson['Empfaenger']});
        } else if (msgJson['Type'] == 'Send') {
            clients.forEach(function (entry) {
                if (entry['Name'] == msgJson['Empfaenger'] && entry['Empfaenger'] == msgJson['Name']) {
                    entry['Client'].send(msgJson['Message']);
                }
            });
        }
    });
});

server.listen(10000);