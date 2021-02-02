// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
    production: false,
    
    name: 'development',

    // the path to the game server for the game DataService calls
    //gameServerDomainUrl: 'http://localhost:3030',
    gameServerDomainUrl: 'https://swipewin-orange-server.herokuapp.com',
    // gameServerDomainUrl: 'https://swipewin-beeline-server.herokuapp.com',
    // the path to MTS Authentication API for WebSSO user authentication
    mtsAuthDomainUrl: 'login.mts.ru',
    
    // the http protocol of the MTS Authentication API for WebSSO user authentication
    mtsAuthDomainProtocol: 'https',
    
    mtsAuthClientId: 'test@b2b.mts.ru',
    
    // the MTS WebSSO authentication callback url
    mtsAuthCallbackUrl: 'https://swipr-themisbrink.c9users.io/auth-callback'
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
 import 'zone.js/dist/zone-error';  // Included with Angular CLI.
