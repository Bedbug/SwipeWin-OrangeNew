"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var core_1 = require('@angular/core');
var environment_1 = require('../../environments/environment');
//import { User } from '../../models/User';
var VIEW_STATES = {
    PROFILE: 'SHOW_PROFILE',
    SETTINGS: 'SHOW_SETTINGS'
};
var ProfileComponent = (function () {
    function ProfileComponent(dataService, sessionService, router) {
        var _this = this;
        this.dataService = dataService;
        this.sessionService = sessionService;
        this.router = router;
        this._phone = "+7 (915) 000-00-00";
        this._totalGamesCount = 0;
        this._bestResultAllTime = 23;
        this._bestResultToday = 13;
        this._cashBackAmount = 0;
        this._daysInGame = 0;
        this.showAvatar = true;
        this.avatarPic = "assets/images/avatar.svg";
        this.userName = "themis brink";
        this.state = VIEW_STATES.PROFILE;
        // public showSettingsView = () => this.state = VIEW_STATES.SETTINGS;
        this.isSettingsShowable = function () { return _this.state === VIEW_STATES.SETTINGS; };
    }
    Object.defineProperty(ProfileComponent.prototype, "bestResultToday", {
        get: function () {
            return this._bestResultToday;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ProfileComponent.prototype, "totalGamesCount", {
        get: function () {
            return this._totalGamesCount;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ProfileComponent.prototype, "bestResultAllTime", {
        get: function () {
            return this._bestResultAllTime;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ProfileComponent.prototype, "getCahback", {
        get: function () {
            return this._cashBackAmount;
        },
        enumerable: true,
        configurable: true
    });
    ProfileComponent.prototype.ngOnInit = function () {
        // this.state = VIEW_STATES.PROFILE;
        var _this = this;
        // user login validation check
        if (!this.sessionService.token || !this.sessionService.isSubscribed || !this.sessionService.isEligible) {
            // wanna inform the user here?
            //this._cashback = this.sessionService.cashback;
            // Initiate user authentication
            this.dataService.authenticateRedirect();
        }
        else {
            this.dataService.getUserProfile().then(function (data) {
                _this.sessionService.user = data;
                _this.userName = data.username;
                _this._totalGamesCount = data.gamesPlayed;
                _this._bestResultAllTime = data.bestScore;
                _this._bestResultToday = data.bestScoreToday;
                _this._daysInGame = data.totalDaysPlaying;
                if (_this._daysInGame == null)
                    _this._daysInGame = 0;
                // this._totalDays = data.totalDaysPlaying;
                _this._cashBackAmount = data.wallet.pendingMaturityCashback + data.wallet.pendingTransferCashback;
                if (data.picture != null) {
                    _this.avatarPic = environment_1.environment.gameServerDomainUrl + '/' + data.picture;
                }
                else {
                    _this.avatarPic = "assets/images/avatar.svg";
                }
                // console.log()
                // if(this.avatarPic == null && this.userName == null) {
                // }
                _this.refreshDiv();
                _this._phone = data.msisdn;
                console.log(_this.sessionService.user);
            }, function (err) {
            });
        }
    };
    ProfileComponent.prototype.refreshDiv = function () {
        var _this = this;
        console.log("Refreshing Avatar!!!");
        this.showAvatar = false;
        setTimeout(function () {
            _this.showAvatar = true;
        }, 50);
    };
    ProfileComponent.prototype.showSettingsView = function () {
        this.router.navigate(['settings']);
    };
    ProfileComponent.prototype.gotoCashback = function () {
        this.router.navigate(['cashback']);
    };
    ProfileComponent = __decorate([
        core_1.Component({
            selector: 'app-profile',
            templateUrl: './profile.component.html',
            styleUrls: ['./profile.component.scss']
        })
    ], ProfileComponent);
    return ProfileComponent;
}());
exports.ProfileComponent = ProfileComponent;
