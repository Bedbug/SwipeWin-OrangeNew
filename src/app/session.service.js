"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var core_1 = require('@angular/core');
// Optimizing lodash importing for just the methods we need: https://medium.com/@armno/til-importing-lodash-into-angular-the-better-way-aacbeaa40473
var assign_1 = require('lodash/assign');
// Mechanism for detecting page refreshes
// This comes from a catch-refresh example at https://stackblitz.com/edit/angular-r6-detect-browser-refresh?file=src%2Fmain.ts 
var router_1 = require('@angular/router');
// Local and Session storage provider, see: https://medium.com/@tiagovalverde/how-to-save-your-app-state-in-localstorage-with-angular-ce3f49362e31
var ngx_webstorage_service_1 = require('ngx-webstorage-service');
var SessionService = (function () {
    // injects StorageServiceModule. For its API, see: https://www.npmjs.com/package/ngx-webstorage-service
    function SessionService(storage, localStorage, router) {
        var _this = this;
        this.storage = storage;
        this.localStorage = localStorage;
        this.router = router;
        this.mtsToken = null;
        this.user = null;
        // the main user identification property, the user's mobile number. 
        // If present, this signifies that the user has already logged in through MyMTS WebSSO login page
        //msisdn: null,
        this.msisdn = null; // hard-coded here for testing by circumventing the WebSSO MyMTS Russian OAuth Service
        // The JWT token received by the game server, after user (Open Auth) authentication
        // If present, this signifies that the user has already signed in the game server
        this.token = null;
        // The game settings object as fetched from the server
        this.gameSettings = {};
        // date of reference, defaults to the current date
        this.today = new Date();
        // tells whether the user has ever subscribed to the service
        this.isSubscribed = false;
        // tells whether the user has enough credit to buy a game
        this.hasCredit = false;
        // tells whether the user has enough financial balance to buy the game
        this.hasBalance = false;
        // tells whether the user is eligible to play the game
        this.isEligible = false;
        // how many games the user has played today
        this.gamesPlayed = 0;
        // how many Demo games the user has played today
        this.demoGamesPlayed = 0;
        // whether the user has won any cashback on the last demo game they played
        this.demoGameCashbackWon = false;
        // what is the user's total points
        this.points = 0;
        // the id of the current (demo) game session, if any
        this.currentSessionId = null;
        // mtsToken: boolean = true;
        this.lastGameResults = null;
        this.subscription = router.events.subscribe(function (event) {
            if (event instanceof router_1.NavigationStart && event.url.substring(0, 14) === '/auth-callback') {
                _this.reset();
            }
        });
    }
    // a method to properly check and advance the number of demo games played on the same date (current day)
    SessionService.prototype.playDemoGame = function () {
        var now = new Date();
        if (SessionService.GetDateIntoMoscowTimezone(this.today) == SessionService.GetDateIntoMoscowTimezone(now)) {
            this.demoGamesPlayed++;
        }
        else {
            this.demoGamesPlayed = 1;
            this.today = now;
        }
        //this.Serialize();
    };
    SessionService.GetDateIntoMoscowTimezone = function (date) {
        // Moscow timezone is +3:00 from +0:00 (UTC)
        return Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(), 3, 0, 0);
    };
    SessionService.prototype.reset = function () {
        this.token = null;
        this.msisdn = null;
        this.today = null;
        this.mtsToken = null;
        this.user = null;
        this.isSubscribed = false;
        this.storage.remove("user");
    };
    // a method to serialize the user object in Local Storage
    SessionService.prototype.Serialize = function () {
        //const userObject = pick(this, ['msisdn', 'token', 'today', 'demoGamesPlayed', 'demoGameCashbackWon']);  // only these properties of userObject are saved
        var userObject = {
            msisdn: this.msisdn,
            token: this.token,
            today: this.today,
            demoGameCashbackWon: this.demoGameCashbackWon,
            demoGamesPlayed: this.demoGamesPlayed
        };
        this.storage.set('user', userObject);
    };
    // a method to deserialize the user object from Local Storage
    SessionService.prototype.Deserialize = function () {
        //const localStorage = window['localStorage'];
        var userObject = this.storage.get('user');
        if (userObject) {
            // Convert today from string to Date object
            if (userObject && userObject.today) {
                userObject.today = new Date(userObject.today);
                // Check validity and invalidate if necessary
                var now = new Date();
                if (SessionService.GetDateIntoMoscowTimezone(now) !== SessionService.GetDateIntoMoscowTimezone(userObject.today)) {
                    // userObject.demoGamesPlayed = 0; // count of demo games should not reset on new day start
                    userObject.today = now;
                }
            }
            // Copy userObject property values back to User object
            assign_1.assign(this, userObject);
        }
    };
    SessionService.prototype.ngOnDestroy = function () {
        this.subscription.unsubscribe();
    };
    SessionService = __decorate([
        core_1.Injectable({
            providedIn: 'root'
        }),
        __param(0, core_1.Inject(ngx_webstorage_service_1.SESSION_STORAGE)),
        __param(1, core_1.Inject(ngx_webstorage_service_1.LOCAL_STORAGE))
    ], SessionService);
    return SessionService;
}());
exports.SessionService = SessionService;
