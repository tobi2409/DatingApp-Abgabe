async function setUpOtherPersonProfilePage(userName) {
    document.getElementById('login').style.display = 'none';
    document.getElementById('profile').style.display = 'flex';
    document.getElementById('main').style.display = 'none';

    setUpProfileAllgemeineDaten();

    document.getElementById('profile-tabcontrol-extra').innerHTML = 
        '<button class="tab" onclick="setUpChatPage(\'' + userName + '\');">Chat</button>';

    const paramJson = { 'requestedUsername': userName };

    const result = await sendJsonRequest(HOST + ':' + PORT + '/getUserData', window.localStorage.getItem('DatingApp-accessToken'), paramJson);

    const profileImageField = '<img id="profile-image-field" alt="Bild"" src=""/>';

    document.getElementById('profile-image-cell').innerHTML = profileImageField;
    document.getElementById('profile-image-field').src = 'data:image/png;base64,' + result['bild'];

    document.getElementById('profile-allgemeinedaten-nutzername-cell').innerHTML = result['nutzername'];
    document.getElementById('profile-allgemeinedaten-vorname-cell').innerHTML = result['vorname'];
    document.getElementById('profile-allgemeinedaten-geburtsdatum-cell').innerHTML = result['geburtsdatum'];
    document.getElementById('profile-allgemeinedaten-landcode-cell').innerHTML = result['landcode'];
    document.getElementById('profile-allgemeinedaten-plz-cell').innerHTML = result['plz'];
    document.getElementById('profile-allgemeinedaten-ort-cell').innerHTML = result['ort'];
    document.getElementById('profile-allgemeinedaten-suchumkreis-cell').innerHTML = result['suchumkreis'];
    document.getElementById('profile-allgemeinedaten-geschlecht-cell').innerHTML = result['geschlecht'];
    document.getElementById('profile-allgemeinedaten-partnergeschlecht-cell').innerHTML = result['partnergeschlecht'];
    document.getElementById('profile-allgemeinedaten-groesse-cell').innerHTML = result['groesse'];
    document.getElementById('profile-allgemeinedaten-gewicht-cell').innerHTML = result['gewicht'];
    document.getElementById('profile-allgemeinedaten-koerperbau-cell').innerHTML = result['koerperbau'];
    document.getElementById('profile-allgemeinedaten-haarfarbe-cell').innerHTML = result['haarfarbe'];
    document.getElementById('profile-allgemeinedaten-augenfarbe-cell').innerHTML = result['augenfarbe'];
    document.getElementById('profile-allgemeinedaten-gesichtszug-cell').innerHTML = result['gesichtszug'];

    setUpWichtungTable(result['interessen'], 'profile-interessen-table');
    setUpWichtungTable(result['charaktere'], 'profile-charaktere-table');
}