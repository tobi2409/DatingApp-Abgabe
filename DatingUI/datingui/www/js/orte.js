async function fillOrte(page) {
    const landCodeField = document.getElementById(page + '-landcode');
    const plzField = document.getElementById(page + '-plz');
    const ortField = document.getElementById(page + '-ort');
    const dataList = document.getElementById(page + '-ort-datalist');

    dataList.innerHTML = '';

    const paramJson = { 'landCode': landCodeField.value, 'plz': plzField.value, 'cityname': ortField.value };

    const result = await sendJsonRequest(HOST + ':' + PORT + '/searchCities', '', paramJson);

    result.forEach(function (element) {
        dataList.innerHTML += '<option>' + element['place_name'] + '</option>';
    });
}