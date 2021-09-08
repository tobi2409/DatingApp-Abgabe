//TODO: AccessToken irgendwo hinterlegen und nicht immer als Parameter mitgeben!!!

async function setUpMainPage() {
    showMainPage();

    const paramJson = { 'requestedUsername': window.localStorage.getItem('DatingApp-nutzername') };

    const overviewData = await sendJsonRequest(HOST + ':' + PORT + '/getUserData_ShortOverview', window.localStorage.getItem('DatingApp-accessToken'), paramJson);

    //TODO: not only png
    const headerProfileHtml = '<div id="header-profile-inner" onclick="setUpOwnProfilePage()"> <img id="header-profile-inner-img" src="data:image/png;base64,'
        + overviewData['bild'] + '"> <h3>' + overviewData['vorname'] + '</h3> </div>';

    document.getElementById('header-profile').innerHTML = headerProfileHtml;

    const headerProfileLogoutHtml = '<div id="header-profile-logout"> <img id="header-profile-logout-img" onclick="logout();" src="assets/logout.svg">' + 
        '<div>Icon made from <a href="http://www.onlinewebfonts.com/icon">Icon Fonts</a> is licensed by CC BY 3.0</div> </div>';

    document.getElementById('header-profile').innerHTML += headerProfileLogoutHtml;

    searchForPotentialMatches(window.localStorage.getItem('DatingApp-accessToken'));
}

function showMainPage() {
    document.getElementById('login').style.display = 'none';
    document.getElementById('register').style.display = 'none';
    document.getElementById('profile').style.display = 'none';
    document.getElementById('main').style.display = 'flex';
}

async function searchForPotentialMatches(accessToken) {
    const result = await sendJsonRequest(HOST + ':' + PORT + '/searchForPotentialMatches', accessToken, {});

    for (const element of result) {
        const html = '<div class="potential-match-entry" onclick="setUpOtherPersonProfilePage(\'' + element['Nutzername'] + '\')"> '
             + '<img class="potential-match-img" src="data:image/jpg;base64, ' + element['Bild'] + '"> <b>'
             + element['Vorname'] + ' (' + element['Relation'] + ') </b> </div>';
        document.getElementById('main').innerHTML += html;
    }
}

function logout() {
    window.localStorage.removeItem('DatingApp-accessToken')
    window.localStorage.removeItem('DatingApp-nutzername');

    location.reload();
}