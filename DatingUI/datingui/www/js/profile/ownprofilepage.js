async function setUpOwnProfilePage() {
    document.getElementById('login').style.display = 'none';
    document.getElementById('profile').style.display = 'flex';
    document.getElementById('main').style.display = 'none';

    setUpProfileAllgemeineDaten();

    const paramJson = { 'requestedUsername': window.localStorage.getItem('DatingApp-nutzername') };

    const result = await sendJsonRequest(HOST + ':' + PORT + '/getUserData', window.localStorage.getItem('DatingApp-accessToken'), paramJson);
    console.log(result);

    //document.getElementById('profile-bild').src = Cookies.get('DatingApp-bild');

    const profileImageField = '<input type="file" id="profile-image-upload-field" onchange="choosingPicture();" style="display: none"/>'
        + '<img id="profile-image-field" alt="Bild" onclick="showUploadDialog();" src=""/>';

    document.getElementById('profile-image-cell').innerHTML = profileImageField;
    document.getElementById('profile-image-field').src = 'data:image/png;base64,' + result['bild'];

    const profileNutzernameField = '<input id="profile-allgemeinedaten-nutzername-field" value="' + result['nutzername'] + '">';
    document.getElementById('profile-allgemeinedaten-nutzername-cell').innerHTML = profileNutzernameField;

    const profileVornameField = '<input id="profile-allgemeinedaten-vorname-field" value="' + result['vorname'] + '">';
    document.getElementById('profile-allgemeinedaten-vorname-cell').innerHTML = profileVornameField;

    const profileGeburtsdatumField = '<input type="date" id="profile-allgemeinedaten-geburtsdatum-field" value="' + result['geburtsdatum'] + '">';
    document.getElementById('profile-allgemeinedaten-geburtsdatum-cell').innerHTML = profileGeburtsdatumField;

    const profileLandCodeField = '<select id="profile-allgemeinedaten-landcode" value="' + result['landcode'] + '">'
        + '<option>DE</option>'
        + '</select>';

    document.getElementById('profile-allgemeinedaten-landcode-cell').innerHTML = profileLandCodeField;

    const profilePlzField = '<input id="profile-allgemeinedaten-plz" value="' + result['plz'] + '">';
    document.getElementById('profile-allgemeinedaten-plz-cell').innerHTML = profilePlzField;

    const profileOrtField = '<input id="profile-allgemeinedaten-ort" list="profile-allgemeinedaten-ort-datalist" oninput="fillOrte(\'profile-allgemeinedaten\');" value="' + result['ort'] + '">'
        + '<datalist id="profile-allgemeinedaten-ort-datalist"></datalist>';
    document.getElementById('profile-allgemeinedaten-ort-cell').innerHTML = profileOrtField;

    const profileSuchumkreisField = '<input type="number" id="profile-allgemeinedaten-suchumkreis-field" value="' + result['suchumkreis'] + '">';
    document.getElementById('profile-allgemeinedaten-suchumkreis-cell').innerHTML = profileSuchumkreisField;

    const profileGeschlechtField = '<select id="profile-allgemeinedaten-geschlecht-field" value="' + result['geschlecht'] + '">'
        + '<option value="männlich">männlich</option>'
        + '<option value="weiblich">weiblich</option>'
        + '</select>';

    document.getElementById('profile-allgemeinedaten-geschlecht-cell').innerHTML = profileGeschlechtField;
    document.getElementById('profile-allgemeinedaten-geschlecht-field').value = result['geschlecht'];

    const profilePartnergeschlechtField = '<select id="profile-allgemeinedaten-partnergeschlecht-field">'
        + '<option value="männlich">männlich</option>'
        + '<option value="weiblich">weiblich</option>'
        + '</select>';

    document.getElementById('profile-allgemeinedaten-partnergeschlecht-cell').innerHTML = profilePartnergeschlechtField;
    document.getElementById('profile-allgemeinedaten-partnergeschlecht-field').value = result['partnergeschlecht'];

    const profileGroesseField = '<input type="number" id="profile-allgemeinedaten-groesse-field" value="' + result['groesse'] + '">';
    document.getElementById('profile-allgemeinedaten-groesse-cell').innerHTML = profileGroesseField;

    const profileGewichtField = '<input type="number" id="profile-allgemeinedaten-gewicht-field" value="' + result['gewicht'] + '">';
    document.getElementById('profile-allgemeinedaten-gewicht-cell').innerHTML = profileGewichtField;

    const profileKoerperbauField = '<select id="profile-allgemeinedaten-koerperbau-field">'
        + '<option></option>'
        + '<option value="dünn">dünn</option>'
        + '<option value="dick">dick</option>'
        + '</select>';

    document.getElementById('profile-allgemeinedaten-koerperbau-cell').innerHTML = profileKoerperbauField;
    document.getElementById('profile-allgemeinedaten-koerperbau-field').value = result['koerperbau'];

    const profileHaarfarbeField = '<select id="profile-allgemeinedaten-haarfarbe-field">'
        + '<option></option>'
        + '<option value="schwarz">schwarz</option>'
        + '<option value="blond">blond</option>'
        + '</select>';

    document.getElementById('profile-allgemeinedaten-haarfarbe-cell').innerHTML = profileHaarfarbeField;
    document.getElementById('profile-allgemeinedaten-haarfarbe-field').value = result['haarfarbe'];

    const profileAugenfarbeField = '<select id="profile-allgemeinedaten-augenfarbe-field">'
        + '<option></option>'
        + '<option value="braun">braun</option>'
        + '<option value="grün">grün</option>'
        + '<option value="blau">blau</option>'
        + '</select>';

    document.getElementById('profile-allgemeinedaten-augenfarbe-cell').innerHTML = profileAugenfarbeField;
    document.getElementById('profile-allgemeinedaten-augenfarbe-field').value = result['augenfarbe'];

    const profileGesichtszugField = '<select id="profile-allgemeinedaten-gesichtszug-field">'
        + '<option></option>'
        + '<option value="weich">weich</option>'
        + '<option value="streng">streng</option>'
        + '</select>';

    document.getElementById('profile-allgemeinedaten-gesichtszug-cell').innerHTML = profileGesichtszugField;
    document.getElementById('profile-allgemeinedaten-gesichtszug-field').value = result['gesichtszug'];

    setUpWichtungTableEditor(result['interessen'], 'profile-interessen-table');
    setUpWichtungTableEditor(result['charaktere'], 'profile-charaktere-table');

    const profileSaveButton = '<button onclick="changeAllgemeineData()">Speichern</button>';
    document.getElementById('profile-allgemeinedaten-extrabuttons').innerHTML = profileSaveButton;

    const profileInteressenSaveButton = '<button onclick="changeInteressenData()">Speichern</button>';
    document.getElementById('profile-interessen-extrabuttons').innerHTML = profileInteressenSaveButton;

    const profileCharaktereSaveButton = '<button onclick="changeCharakterData()">Speichern</button>';
    document.getElementById('profile-charaktere-extrabuttons').innerHTML = profileCharaktereSaveButton;
}

function showUploadDialog() {
    document.getElementById('profile-image-upload-field').click();
}

//TODO: accept multiple formats
async function choosingPicture() {
    const fileName = document.getElementById('profile-image-upload-field').files[0];
    const fileReader = new FileReader();

    fileReader.addEventListener('loadend', async function () {
        const res = fileReader.result;
        const base64 = arrayBufferToBase64(res);
        const imgSrc = 'data:image/png;base64,' + base64;

        document.getElementById('header-profile-inner-img').src = imgSrc;
        document.getElementById('profile-image-field').src = imgSrc;

        // res ist Array-Buffer -> Server speichert es in DB -> beim Auslesen später wird der Byte-String noch mit Base64 encodiert, da readAsArrayBuffer im Ggs. zu readAsDataURL nicht vorkodiert
        await sendByteData(HOST + ':' + PORT + '/addImageToUser', window.localStorage.getItem('DatingApp-accessToken'), res);
    });

    // readAsDataURL bringt bereits Base64-encodeten String (also inklusive: data:image/png;base64)
    // readAsArrayBuffer bringt Array-Buffer
    // ArrayBuffer sind reine Binärdaten (mithilfe von Uint8Array können sie in Bytes zusammengefasst werden)
    fileReader.readAsArrayBuffer(fileName);
}

async function changeAllgemeineData() {
    const profileNutzernameField = document.getElementById('profile-allgemeinedaten-nutzername-field');
    const profileVornameField = document.getElementById('profile-allgemeinedaten-vorname-field');
    const profileGeburtsdatumField = document.getElementById('profile-allgemeinedaten-geburtsdatum-field');
    const profileLandcodeField = document.getElementById('profile-allgemeinedaten-landcode');
    const profilePlzField = document.getElementById('profile-allgemeinedaten-plz');
    const profileOrtField = document.getElementById('profile-allgemeinedaten-ort');
    const profileSuchumkreisField = document.getElementById('profile-allgemeinedaten-suchumkreis-field');
    const profileGeschlechtField = document.getElementById('profile-allgemeinedaten-geschlecht-field');
    const profilePartnergeschlechtField = document.getElementById('profile-allgemeinedaten-partnergeschlecht-field');
    const profileGroesseField = document.getElementById('profile-allgemeinedaten-groesse-field');
    const profileGewichtField = document.getElementById('profile-allgemeinedaten-gewicht-field');
    const profileKoerperbauField = document.getElementById('profile-allgemeinedaten-koerperbau-field');
    const profileHaarfarbeField = document.getElementById('profile-allgemeinedaten-haarfarbe-field');
    const profileAugenfarbeField = document.getElementById('profile-allgemeinedaten-augenfarbe-field');
    const profileGesichtszugField = document.getElementById('profile-allgemeinedaten-gesichtszug-field');

    const paramJson = {
        'nutzername': profileNutzernameField.value, 'vorname': profileVornameField.value, 'geburtsdatum': profileGeburtsdatumField.value,
        'landCode': profileLandcodeField.value, 'plz': profilePlzField.value, 'ortName': profileOrtField.value, 'suchumkreis': profileSuchumkreisField.value,
        'geschlecht': profileGeschlechtField.value, 'partnergeschlecht': profilePartnergeschlechtField.value
    };

    pushToParamList('groesse', profileGroesseField.value);
    pushToParamList('gewicht', profileGewichtField.value);
    pushToParamList('koerperbau', profileKoerperbauField.value);
    pushToParamList('haarfarbe', profileHaarfarbeField.value);
    pushToParamList('augenfarbe', profileAugenfarbeField.value);
    pushToParamList('gesichtszug', profileGesichtszugField.value);

    function pushToParamList(key, value) {
        if (value != '') {
            paramJson[key] = value;
        } else {
            paramJson[key] = null;
        }
    }

    const result = await sendJsonRequest(HOST + ':' + PORT + '/changeUserData', window.localStorage.getItem('DatingApp-accessToken'), paramJson);

    if ('Error' in result) {
        alert(result['Error']);
    }
}

async function changeInteressenData() {
    //TODO: Error-Handling
    changeWichtungTableData('profile-interessen-table', async function(bezeichnung, wichtung) {
        const paramJson = {'interesse' : bezeichnung, 'wichtung' : wichtung};
        const result = await sendJsonRequest(HOST + ':' + PORT + '/addInteresseToUser', window.localStorage.getItem('DatingApp-accessToken'), paramJson);
    }, async function(bezeichnung) {
        const paramJson = {'interesse' : bezeichnung};
        const result = await sendJsonRequest(HOST + ':' + PORT + '/removeInteresseFromUser', window.localStorage.getItem('DatingApp-accessToken'), paramJson);
    });
}

async function changeCharakterData() {
    //TODO: Error-Handling
    changeWichtungTableData('profile-charaktere-table', async function(bezeichnung, wichtung) {
        const paramJson = {'charakter' : bezeichnung, 'wichtung' : wichtung};
        const result = await sendJsonRequest(HOST + ':' + PORT + '/addCharakterToUser', window.localStorage.getItem('DatingApp-accessToken'), paramJson);
    }, async function(bezeichnung) {
        const paramJson = {'charakter' : bezeichnung};
        const result = await sendJsonRequest(HOST + ':' + PORT + '/removeCharakterFromUser', window.localStorage.getItem('DatingApp-accessToken'), paramJson);
    });
}