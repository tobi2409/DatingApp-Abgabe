function setUpLoginPage() {
    document.getElementById('login').style.display = 'flex';
    document.getElementById('register').style.display = 'none';
    document.getElementById('main').style.display = 'none';
    document.getElementById('profile').style.display = 'none';
}

async function login() {
    const nutzernameField = document.getElementById('login-nutzername');
    const passwortField = document.getElementById('login-passwort');

    const paramJson = { 'nutzername': nutzernameField.value, 'passwort': passwortField.value };

    const result = await sendJsonRequest(HOST + ':' + PORT + '/login', '', paramJson);

    const accessToken = 'accessToken' in result ? result['accessToken'] : null;

    if (accessToken && accessToken != '') {
        window.localStorage.setItem('DatingApp-accessToken', accessToken);
        window.localStorage.setItem('DatingApp-nutzername', paramJson['nutzername']);

        // Cookie verschwindet beim Ausloggen

        //cacheOwnUserData();
        setUpMainPage();
    } else {
        document.getElementById('login-status').innerText = 'FEHLER: Geben Sie Nutzernamen und Passwort bitte erneut ein!';
    }
}