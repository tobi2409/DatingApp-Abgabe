function runChat(partnerName) {
    const ownName = window.localStorage.getItem('DatingApp-nutzername');
    
    //TODO: config
    const client = new WebSocket('wss://localhost:10000');

    const body = document.getElementById('profile-chat-table-body');

    client.onopen = function() {
        const registerJson = {'Type' : 'Register', 'Name' : ownName, 'Empfaenger' : partnerName};
        client.send(JSON.stringify(registerJson));

        document.getElementById('profile-chat-send').onclick = function() {
            sendChat();
        };

        function sendChat() {
            const messageField = document.getElementById('profile-chat-message');

            body.appendChild(entry('Ich', messageField.value));

            const json = {'Type' : 'Send', 'Name' : ownName, 'Empfaenger' : partnerName, 'Message' : messageField.value};
            client.send(JSON.stringify(json));
        }
    }
    
    client.onerror = function(error) {
        console.log('WebSocket Error ' + error);
    };

    client.onmessage = function(msg) {
        body.appendChild(entry(partnerName, msg.data));
        //document.getElementById('profile-chat-field').value += msg.data;
    }

    function entry(who, message) {
        const tr1 = document.createElement('tr');

        const td1 = document.createElement('td');
        td1.innerText = who;
        td1.align = 'right';
        td1.fontWeight = 'bold';
        tr1.appendChild(td1)

        const td2 = document.createElement('td');
        td2.innerText = message;
        tr1.appendChild(td2);

        return tr1;
    }
}