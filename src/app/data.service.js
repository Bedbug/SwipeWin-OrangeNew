"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var core_1 = require('@angular/core');
var rxjs_1 = require('rxjs');
var environment_1 = require('../environments/environment');
//import { Location, LocationStrategy, PathLocationStrategy } from '@angular/common';
var DataService = (function () {
    function DataService(http, session, router) {
        this.http = http;
        this.session = session;
        this.router = router;
    }
    DataService.prototype.getWindow = function () {
        return window;
    };
    DataService.prototype.getDocument = function () {
        return document;
    };
    // A redirect to the Open Auth protocol endpoint to initiate the user authentication with the TelCo
    DataService.prototype.authenticateRedirect = function () {
        if (!this.session.gameSettings || !this.session.gameSettings.maintenance || this.session.gameSettings.maintenance.siteDown || this.session.gameSettings.maintenance.noGames)
            this.router.navigate(['/home']);
        else {
            var url = encodeURI(environment_1.environment.mtsAuthDomainProtocol + "://" + environment_1.environment.mtsAuthDomainUrl + "/amserver/oauth2/auth?client_id=" + environment_1.environment.mtsAuthClientId + "&scope=openid profile mobile&redirect_uri=" + environment_1.environment.mtsAuthCallbackUrl + "&response_type=code&display=page&state=1");
            window.location.href = url;
        }
    };
    // A redirect to the Open Auth protocol endpoint to initiate the user authentication with the TelCo
    DataService.prototype.logoutRedirect = function () {
        var home = environment_1.environment.mtsAuthCallbackUrl.replace(/\/auth-callback/, '');
        var url = encodeURI(environment_1.environment.mtsAuthDomainProtocol + "://" + environment_1.environment.mtsAuthDomainUrl + "/amserver/UI/Logout?goto=" + home);
        window.location.href = url;
    };
    DataService.prototype.logout = function () {
        if (!this.session.mtsToken)
            console.error('Logout failed, missing user token');
        var url = encodeURI(environment_1.environment.mtsAuthDomainProtocol + "://" + environment_1.environment.mtsAuthDomainUrl + "/amserver/oauth2/revoke?token=" + this.session.mtsToken);
        return this.http.post(url, {
            headers: { 'Accept': '*/*', 'Access-Control-Allow-Origin': '*', 'Authorization': 'Bearer ' + this.session.mtsToken }
        });
    };
    DataService.prototype.authenticateUserToken = function (code) {
        var url = encodeURI(environment_1.environment.gameServerDomainUrl + "/api/mts/" + code);
        return this.http.get(url, {
            headers: { 'Accept': 'application/json', 'Access-Control-Allow-Origin': '*' }
        });
    };
    // A call to the user status service to get user subscription status and basic data
    DataService.prototype.authorizeUser = function () {
        var url = environment_1.environment.gameServerDomainUrl + "/api/user/signup";
        return this.http.post(url, { msisdn: this.session.msisdn }, {
            headers: { 'Accept': 'application/json', 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
            observe: 'response'
        });
    };
    DataService.prototype.fetchGameSettings = function () {
        var url = environment_1.environment.gameServerDomainUrl + "/api/settings/game";
        return this.http.get(url, {
            headers: { 'Accept': 'application/json', 'Access-Control-Allow-Origin': '*' }
        }).toPromise();
    };
    DataService.prototype.getWinners = function () {
        var url = environment_1.environment.gameServerDomainUrl + "/api/prize-winners";
        return this.http.get(url, {
            headers: { 'Accept': 'application/json', 'Access-Control-Allow-Origin': '*' }
        }).toPromise();
    };
    DataService.prototype.getUserProfile = function () {
        var url = environment_1.environment.gameServerDomainUrl + "/api/user";
        return this.http.get(url, {
            headers: {
                'Accept': 'application/json',
                'Access-Control-Allow-Origin': '*',
                'X-Access-Token': this.session.token
            }
        }).toPromise();
    };
    DataService.prototype.saveUserProfile = function (newProfileObject) {
        var _this = this;
        var promise = new Promise(function (resolve, reject) {
            if (!_this.session || !_this.session.token)
                return reject(new Error('Invalid user data to update'));
            var url = environment_1.environment.gameServerDomainUrl + "/api/user";
            var objectToSave = newProfileObject; //this.session.user.toProfileDTO();
            return _this.http.put(url, objectToSave, {
                headers: {
                    'Accept': 'application/json',
                    'Access-Control-Allow-Origin': '*',
                    'X-Access-Token': _this.session.token,
                    'Content-Type': 'application/json'
                },
                observe: 'response'
            }).toPromise().then(function (res) {
                var token = res.headers.get('X-Access-Token');
                if (token)
                    _this.session.token = token;
                var body = res.body;
                resolve(body);
            }, function (err) {
                reject(err);
            });
        });
        return promise;
    };
    DataService.prototype.transferCashback = function () {
        var _this = this;
        var promise = new Promise(function (resolve, reject) {
            if (!_this.session || !_this.session.token)
                return reject(new Error('Invalid user data to update'));
            var url = environment_1.environment.gameServerDomainUrl + "/api/user/cashback";
            var objectToSave = {};
            return _this.http.post(url, objectToSave, {
                headers: {
                    'Accept': 'application/json',
                    'Access-Control-Allow-Origin': '*',
                    'X-Access-Token': _this.session.token,
                    'Content-Type': 'application/json'
                },
                observe: 'response'
            }).toPromise().then(function (res) {
                var token = res.headers.get('X-Access-Token');
                if (token)
                    _this.session.token = token;
                var body = res.body;
                resolve(body);
            }, function (err) {
                reject(err);
            });
        });
        return promise;
    };
    DataService.prototype.unsubscribe = function () {
        var _this = this;
        var promise = new Promise(function (resolve, reject) {
            if (!_this.session || !_this.session.token)
                return reject(new Error('Invalid user data to update'));
            var url = environment_1.environment.gameServerDomainUrl + "/api/user";
            return _this.http.delete(url, {
                headers: {
                    'Accept': 'application/json',
                    'Access-Control-Allow-Origin': '*',
                    'X-Access-Token': _this.session.token
                },
                observe: 'response'
            }).toPromise().then(function (res) {
                var token = res.headers.get('X-Access-Token');
                if (token)
                    _this.session.token = token;
                var body = res.body;
                resolve(body);
            }, function (err) {
                reject(err);
            });
        });
        return promise;
    };
    // A call to create a new session for the user and prefetch a bunch of session questions (no answers)
    // How to work with Promises with Angular HttpClient: https://codecraft.tv/courses/angular/http/http-with-promises/
    DataService.prototype.createSession = function (gameType) {
        var _this = this;
        var promise = new Promise(function (resolve, reject) {
            gameType = gameType || 'demo';
            var url = environment_1.environment.gameServerDomainUrl + "/api/" + (gameType === 'normal' ? '' : (gameType === 'demo' ? 'demo-' : 'timefree-')) + "session/swipewin";
            return _this.http.post(url, {}, {
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'X-Access-Token': _this.session.token || (new Date).getTime().toString(),
                    'Access-Control-Allow-Origin': '*'
                },
                observe: 'response'
            }).toPromise().then(function (res) {
                var token = res.headers.get('X-Access-Token');
                if (token)
                    _this.session.token = token;
                var body = res.body;
                // Get the new session's id and keep it
                _this.session.currentSessionId = body.ticket.id;
                resolve(body);
            }, function (err) {
                var status = err.status;
                if (err.error && err.error.errorCode)
                    _this.router.navigate(['home'], { queryParams: { errorCode: err.error.errorCode } });
                reject(err);
            });
        });
        return promise;
    };
    // A call to register the user answer of a question to the server 
    DataService.prototype.answerQuestion = function (questionId, answer, gameType) {
        var _this = this;
        var promise = new Promise(function (resolve, reject) {
            gameType = gameType || 'demo';
            var url = environment_1.environment.gameServerDomainUrl + "/api/" + (gameType === 'normal' ? '' : (gameType === 'demo' ? 'demo-' : 'timefree-')) + "session/swipewin/" + _this.session.currentSessionId;
            var body = {
                sessionId: _this.session.currentSessionId,
                questionId: questionId,
                userAnswer: answer.toString()
            };
            return _this.http.post(url, body, {
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'X-Access-Token': _this.session.token || (new Date).getTime().toString(),
                    'Access-Control-Allow-Origin': '*'
                },
                observe: 'response'
            }).toPromise().then(function (res) {
                var token = res.headers.get('X-Access-Token');
                if (token)
                    _this.session.token = token;
                // Deserialize payload
                var body = res.body; // JSON.parse(response);
                // Detect the session termination, in this case wait for 1 sec for the end cards animation
                if (body.sessionResult) {
                    _this.session.lastGameResults = body.sessionResult;
                    _this.session.Serialize();
                    rxjs_1.timer(1000).subscribe(function () { return gameType === 'normal' ? _this.router.navigate(['result']) : gameType === 'demo' ? _this.router.navigate(['resultdemo']) : _this.router.navigate(['resultfreetime']); });
                }
                resolve(body);
            }, function (err) {
                var status = err.status;
                if (err.error && err.error.errorCode)
                    _this.router.navigate(['home'], { queryParams: { errorCode: err.error.errorCode } });
                reject(err);
            });
        });
        return promise;
    };
    DataService = __decorate([
        core_1.Injectable({
            providedIn: 'root'
        })
    ], DataService);
    return DataService;
}());
exports.DataService = DataService;
