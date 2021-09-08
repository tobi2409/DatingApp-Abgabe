const assert = require('assert');
const loginLogic = require('../datingapp_modules/features/login/LoginLogic');

describe('Test LoginLogic!', function() {
    it('the same password, original password is encrypted, should return an accessToken', async function() {
        const result = await loginLogic.login
            ({ 'UUID' : '2a5c8590-cb7d-447f-b279-ede79714e1fa', 'passwort' : '$2b$10$9sJDiTZVyUYsMwkuc9y85.zdnm2QSS4pIqtdywWwVJEDVbycRTreO' }, 'test');
        assert.notEqual(result['accessToken'], '');
    });

    it('the same password, both unencrypted, should return an empty accessToken', async function() {
        const result = await loginLogic.login
            ({ 'UUID' : '2a5c8590-cb7d-447f-b279-ede79714e1fa', 'passwort' : 'test' }, 'test');
        assert.equal(result['accessToken'], '');
    });

    it('the same password, original password is encrypted, should return an accessToken', async function() {
        const result = await loginLogic.login
            ({ 'UUID' : '2a5c8590-cb7d-447f-b279-ede79714e1fa', 'passwort' : '$2b$10$yJ6kcdnfrNw2X/5KIHn/6e4SQhfE5LyelmCNrXulzzhqhByfLCW2e' }, 'test');
        assert.notEqual(result['accessToken'], '');
    });

    it('different passwords, original password is encrypted, should return an empty accessToken', async function() {
        const result = await loginLogic.login
            ({ 'UUID' : '2a5c8590-cb7d-447f-b279-ede79714e1fa', 'passwort' : '$2b$10$9sJDiTZVyUYsMwkuc9y85.zdnm2QSS4pIqtdywWwVJEDVbycRTreO' }, 'mypassword');
        assert.equal(result['accessToken'], '');
    });

    it('different passwords, both unencrypted, should return an empty accessToken', async function() {
        const result = await loginLogic.login
            ({ 'UUID' : '2a5c8590-cb7d-447f-b279-ede79714e1fa', 'passwort' : 'test' }, 'mypassword');
        assert.equal(result['accessToken'], '');
    });
});