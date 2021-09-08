async function sendJsonRequest(url, accessToken, paramJson) {
    return (await sendHttpRequest(url, 'application/json', accessToken, JSON.stringify(paramJson))).json();
}

async function sendByteData(url, accessToken, byteData) {
    return await sendHttpRequest(url, 'application/octet-stream', accessToken, byteData);
}

async function sendHttpRequest(url, contentType, accessToken, param) {
    const response = await fetch(url, {
        'method': 'POST',
        'headers': {
            'Content-Type': contentType,
            'authorization': accessToken
        },
        'body': param
    });

    return response;
}