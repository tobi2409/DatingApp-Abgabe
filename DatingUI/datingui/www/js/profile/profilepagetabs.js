function setUpProfileAllgemeineDaten() {
    document.getElementById('profile-allgemeinedaten').style.display = 'flex';
    document.getElementById('profile-interessen').style.display = 'none';
    document.getElementById('profile-charaktere').style.display = 'none';
    document.getElementById('profile-chat').style.display = 'none';
}

function setUpProfileInteressen() {
    document.getElementById('profile-allgemeinedaten').style.display = 'none';
    document.getElementById('profile-interessen').style.display = 'flex';
    document.getElementById('profile-charaktere').style.display = 'none';
    document.getElementById('profile-chat').style.display = 'none';
}

function setUpProfileCharaktere() {
    document.getElementById('profile-allgemeinedaten').style.display = 'none';
    document.getElementById('profile-interessen').style.display = 'none';
    document.getElementById('profile-charaktere').style.display = 'flex';
    document.getElementById('profile-chat').style.display = 'none';
}

function setUpChatPage(partnerName) {
    document.getElementById('profile-allgemeinedaten').style.display = 'none';
    document.getElementById('profile-interessen').style.display = 'none';
    document.getElementById('profile-charaktere').style.display = 'none';
    document.getElementById('profile-chat').style.display = 'flex';

    runChat(partnerName);
}