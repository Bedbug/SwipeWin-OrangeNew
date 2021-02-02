"use strict";
exports.environment = {
    // Static environment variables
    production: true,
    // the path to the game server for the game DataService calls
    gameServerDomainUrl: 'https://pravda.mts.ru',
    // the path to MTS Authentication API for WebSSO user authentication
    mtsAuthDomainUrl: 'login.mts.ru',
    // the http protocol of the MTS Authentication API for WebSSO user authentication
    mtsAuthDomainProtocol: 'https',
    mtsAuthClientId: 'nem2izciin74r8ccy6gxzeb1pdtxz00xjt3mqv103jvmj8oic87co1mypabhe9c3@app.b2b.mts.ru',
    // the MTS WebSSO authentication callback url
    mtsAuthCallbackUrl: 'https://pravda.mts.ru/auth-callback'
};
