"use strict";
var core_1 = require('@angular/core');
var platform_browser_dynamic_1 = require('@angular/platform-browser-dynamic');
var app_module_1 = require('./app/app.module');
var environment_1 = require('./environments/environment');
if (environment_1.environment.production) {
    core_1.enableProdMode();
}
platform_browser_dynamic_1.platformBrowserDynamic().bootstrapModule(app_module_1.AppModule)
    .then(function (ref) {
    // Ensure Angular destroys itself on hot reloads.
    // This comes from a catch-refresh example at https://stackblitz.com/edit/angular-r6-detect-browser-refresh?file=src%2Fmain.ts 
    if (window['ngRef']) {
        window['ngRef'].destroy();
    }
    window['ngRef'] = ref;
    // Otherwise, log the boot error
})
    .catch(function (err) { return console.log(err); });
