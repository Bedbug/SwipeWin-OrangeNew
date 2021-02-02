"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var core_1 = require('@angular/core');
var uikit_1 = require('uikit');
var ReturnhomeComponent = (function () {
    function ReturnhomeComponent(dataService, sessionService, router) {
        this.dataService = dataService;
        this.sessionService = sessionService;
        this.router = router;
        // Check if already a subscribed player
        this._isSubscribed = false;
        // Check if he has cashback waiting
        this._cashBackAmount = 0;
        // Check if check is checked so he can click the button
        this._isChecked = false;
        // How many (1st free or billable) games the user has played
        this._gamesPlayed = 0;
        this.errorMsg = "";
        this.noMoreRealGames = "К несчастью ваш текущий тарифный план не соответствует требованиям игры «Правда или ложь». Попробуйте воспользоваться другим телефонным номером МТС.";
        this.noMoreDemoGames = "No more demo games available! \n Why don't you try the real thing?";
    }
    Object.defineProperty(ReturnhomeComponent.prototype, "hasCashback", {
        get: function () {
            return this._cashBackAmount;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ReturnhomeComponent.prototype, "isSubscribed", {
        get: function () {
            return this._isSubscribed;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ReturnhomeComponent.prototype, "isChecked", {
        get: function () {
            return this._isChecked;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ReturnhomeComponent.prototype, "gamesPlayed", {
        get: function () {
            return this._gamesPlayed;
        },
        enumerable: true,
        configurable: true
    });
    ReturnhomeComponent.prototype.checkCheckBoxvalue = function (event) {
        console.log(event.target.checked);
        this._isChecked = event.target.checked;
    };
    ReturnhomeComponent.prototype.GoSubscribe = function () {
    };
    ReturnhomeComponent.prototype.startGame = function () {
        console.log("Games Played: " + this.gamesPlayed);
        if (this._gamesPlayed >= 3) {
            // popup modal with error
            var modal = uikit_1["default"].modal("#error");
            this.errorMsg = this.noMoreRealGames;
            modal.show();
        }
        else {
            console.log("Play Main Game!");
            this.sessionService.gamesPlayed++;
            this.router.navigate(['game']);
        }
    };
    ReturnhomeComponent.prototype.startFreeGame = function () {
        this.router.navigate(['freetimegame']);
    };
    ReturnhomeComponent.prototype.ngOnInit = function () {
        var _this = this;
        // user login validation check
        if (!this.sessionService.token || !this.sessionService.isSubscribed || !this.sessionService.isEligible) {
            // wanna inform the user here?
            // Redirect him to Home
            this.router.navigate(['/home'], { queryParams: { errorCode: 401 } });
        }
        else if (!this.sessionService.isEligible) {
            this.router.navigate(['/home'], { queryParams: { errorCode: 1026 } });
        }
        else {
            this._isSubscribed = this.sessionService.isSubscribed;
            console.log(this.sessionService.msisdn);
            // this._cashBackAmount = this.sessionService._cashBackAmount;
            // this._cashBackAmount = 500;
            // TOBE ERASED
            // This resets the games played every time
            this.dataService.getUserProfile().then(function (data) {
                _this.sessionService.user = data;
                _this._gamesPlayed = _this.sessionService.gamesPlayed;
                console.log("this._gamesPlayed " + _this._gamesPlayed);
                console.log("this.sessionService.gamesPlayed " + _this.sessionService.gamesPlayed);
                // this._gamesPlayed = 3;
                _this._cashBackAmount = _this.sessionService.user.wallet.pendingMaturityCashback + _this.sessionService.user.wallet.pendingTransferCashback;
            }, function (err) {
            });
        }
    };
    ReturnhomeComponent = __decorate([
        core_1.Component({
            selector: 'app-returnhome',
            templateUrl: './returnhome.component.html',
            styleUrls: ['./returnhome.component.scss']
        })
    ], ReturnhomeComponent);
    return ReturnhomeComponent;
}());
exports.ReturnhomeComponent = ReturnhomeComponent;
