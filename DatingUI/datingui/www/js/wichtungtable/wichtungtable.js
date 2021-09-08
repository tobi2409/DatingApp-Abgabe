// In welcher DOM-Id soll welche Tabelle dargestellt werden?
function setUpWichtungTable(table, domId) {
    const domElement = document.getElementById(domId);

    domElement.innerHTML = '';

    table.forEach(function (element) {
        domElement.appendChild(entry(domId, element['Bezeichnung'], element['Wichtung']));
    });

    function entry(domId, bezeichnung, wichtung) {
        const trId = domId + '_' + bezeichnung;

        const trElement1 = document.createElement('tr');
        trElement1.id = trId;

        const tdElement1 = document.createElement('td');
        tdElement1.align = 'right';
        trElement1.appendChild(tdElement1);

        const bElement1 = document.createElement('b');
        bElement1.innerText = bezeichnung;
        tdElement1.appendChild(bElement1);

        const tdElement2 = document.createElement('td');
        tdElement2.innerText = wichtung;
        trElement1.appendChild(tdElement2);
        
        return trElement1;
    }
}