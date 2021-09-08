function setUpRegisterPage() {
    document.getElementById('login').style.display = 'none';
    document.getElementById('register').style.display = 'flex';
    document.getElementById('main').style.display = 'none';
    document.getElementById('profile').style.display = 'none';
}

async function register() {
    const nutzernameField = document.getElementById('register-nutzername');
    const passwortField = document.getElementById('register-passwort');
    const repeatpasswortField = document.getElementById('register-repeatpasswort');
    const vornameField = document.getElementById('register-vorname');
    const geburtsdatumField = document.getElementById('register-geburtsdatum');
    const landCodeField = document.getElementById('register-landcode');
    const plzField = document.getElementById('register-plz');
    const ortField = document.getElementById('register-ort');
    //const cityListField = document.getElementById('register-citylist');
    const geschlechtField = document.getElementById('register-geschlecht');
    const partnergeschlechtField = document.getElementById('register-partnergeschlecht');

    const status = document.getElementById('register-status');

    if (passwortField.value != repeatpasswortField.value) {
        status.innerText = 'FEHLER: Sie haben ihr Passwort falsch bestätigt.'
    }

    const paramJson = {
        'nutzername': nutzernameField.value, 'passwort': passwortField.value, 'vorname': vornameField.value, 'geburtsdatum': geburtsdatumField.value,
        'landCode': landCodeField.value, 'plz': plzField.value, 'ortName': ortField.value, 'geschlecht': geschlechtField.value, 'partnergeschlecht': partnergeschlechtField.value
    };

    const result = await sendJsonRequest(HOST + ':' + PORT + '/register', '', paramJson);

    if ('Error' in result) {
        status.innerText = result['Error'];
    } else {
        setUpLoginPage();
    }
}