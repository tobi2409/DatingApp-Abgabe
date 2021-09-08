// In welcher DOM-Id soll welche Tabelle dargestellt werden?
function setUpWichtungTableEditor(table, domId) {
    const domElement = document.getElementById(domId);

    domElement.innerHTML = '';

    table.forEach(function (element) {
        domElement.appendChild(entry(domId, element['Bezeichnung'], element['Wichtung']));
    });

    domElement.appendChild(addRow(domId));

    function entry(domId, bezeichnung, wichtung) {
        const trId = domId + '_' + bezeichnung;

        const trElement = document.createElement('tr');
        trElement.id = trId;
        
        const tdElement = document.createElement('td');
        tdElement.align = 'right';
        trElement.appendChild(tdElement);

        const bElement = document.createElement('b');
        bElement.className = domId + '_Bezeichnung';
        bElement.innerText = bezeichnung;
        tdElement.appendChild(bElement);

        const tdElement2 = document.createElement('td');
        trElement.appendChild(tdElement2);

        const inputElement = document.createElement('input');
        inputElement.className = domId + '_Wichtung';
        inputElement.value = wichtung;
        tdElement2.appendChild(inputElement);

        const tdElement3 = document.createElement('td');
        trElement.appendChild(tdElement3);
        
        const buttonElement = document.createElement('button');
        buttonElement.onclick = function() { deleteEntryFromWichtungsTable(trId) };
        buttonElement.innerText = 'Löschen';
        tdElement3.appendChild(buttonElement);

        function deleteEntryFromWichtungsTable(entry) {
            const childRec = document.getElementById(entry).querySelectorAll('*');
            childRec.forEach(function(element) {
                element.style.display = 'none';
            });
        }

        return trElement;
    }

    function addRow(domId) {
        const trElement = document.createElement('tr');
        trElement.id = domId + '_AddRow';

        const tdElement1 = document.createElement('td');
        trElement.appendChild(tdElement1);
        
        const inputElement1 = document.createElement('input');
        inputElement1.id = 'New_' + domId + '_Bezeichnung';
        inputElement1.placeholder = 'Neuer Eintrag';
        inputElement1.setAttribute('list', 'New_' + domId + '_Bezeichnung-datalist');
        inputElement1.oninput = function() {
            fillBezeichnungen();
        }
        tdElement1.appendChild(inputElement1);

        const dataList = document.createElement('datalist');
        dataList.id = 'New_' + domId + '_Bezeichnung-datalist';
        tdElement1.appendChild(dataList);

        //TODO: VERBESSERN!!!
        async function fillBezeichnungen() {
            // bereits vorhandene Elemente in Tabelle
            let toIgnore = [];
            table.forEach(function (element) {
                toIgnore.push(element['Bezeichnung']);
            });

            //TODO: Konstanten!!!
            let tableName = '';
            if (domId == 'profile-interessen-table') {
                tableName = 'Interessen';
            } else if (domId == 'profile-charaktere-table') {
                tableName = 'Charaktere';
            }

            const paramJson = {'table' : tableName, 'subwort': inputElement1.value, 'toIgnore' : toIgnore};
            const result = await sendJsonRequest(HOST + ':' + PORT + '/searchNameOfWichtungen', window.localStorage.getItem('DatingApp-accessToken'), paramJson);

            dataList.innerHTML = '';

            result.forEach(function (element) {
                dataList.innerHTML += '<option>' + element + '</option>';
            });
        }

        const tdElement2 = document.createElement('td');
        trElement.appendChild(tdElement2);
        
        const inputElement2 = document.createElement('input');
        inputElement2.id = 'New_' + domId + '_Wichtung';
        inputElement2.placeholder = 'Wichtung';
        tdElement2.appendChild(inputElement2);

        const tdElement3 = document.createElement('td');
        trElement.appendChild(tdElement3);

        const buttonElement1 = document.createElement('button');
        buttonElement1.onclick = function() {
            addEntryToWichtungsTable(domId);
        }
        buttonElement1.innerText = 'Hinzufügen';
        tdElement3.appendChild(buttonElement1);

        return trElement;
    }

    function addEntryToWichtungsTable(domId) {
        const bezeichnung = document.getElementById('New_' + domId + '_Bezeichnung').value;
        const wichtung = document.getElementById('New_' + domId + '_Wichtung').value;
    
        document.getElementById(domId).appendChild(entry(domId, bezeichnung, wichtung));
    
        document.getElementById(domId + '_AddRow').remove();
        document.getElementById(domId).appendChild(addRow(domId));
    }
}

async function changeWichtungTableData(domId, onAdd, onRemove) {
    const bezeichnungen = document.querySelectorAll('.' + domId + '_Bezeichnung');
    const wichtungen = document.querySelectorAll('.' + domId + '_Wichtung');

    for (let i = 0 ; i < bezeichnungen.length ; i++) {
        const bezeichnung = bezeichnungen[i].innerText;
        const wichtung = wichtungen[i].value;

        //TODO: Error-Handling
        if (bezeichnungen[i].style.display != 'none') {
            onAdd(bezeichnung, wichtung);
        } else {
            onRemove(bezeichnung);
        }
    }
}