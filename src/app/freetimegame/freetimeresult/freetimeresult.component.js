"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var core_1 = require('@angular/core');
var uikit_1 = require('uikit');
var FreetimeresultComponent = (function () {
    function FreetimeresultComponent(session, router) {
        this.session = session;
        this.router = router;
        this._firstTime = false;
        this._gamesPlayed = 2;
        this._rightAnswerCount = 10;
        this._cashbackAmount = 0;
        this._secondVariant = true;
    }
    Object.defineProperty(FreetimeresultComponent.prototype, "secondVariant", {
        get: function () {
            return this._secondVariant;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(FreetimeresultComponent.prototype, "cashbackAmount", {
        get: function () {
            return this._cashbackAmount;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(FreetimeresultComponent.prototype, "rightAnswerCount", {
        get: function () {
            return this._rightAnswerCount;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(FreetimeresultComponent.prototype, "gamesPlayed", {
        get: function () {
            return this._gamesPlayed;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(FreetimeresultComponent.prototype, "TopText", {
        get: function () {
            if (this._rightAnswerCount == 0)
                return "Ой…";
            if (this._rightAnswerCount == 1)
                return "Только…";
            if (this._rightAnswerCount >= 2 && this._rightAnswerCount <= 4)
                return "Хорошо!";
            if (this._rightAnswerCount >= 5 && this._rightAnswerCount <= 9)
                return "Замечательно!";
            if (this._rightAnswerCount >= 10)
                return "Прекрасно!";
        },
        enumerable: true,
        configurable: true
    });
    FreetimeresultComponent.prototype.ngOnInit = function () {
        if (!this.session.lastGameResults)
            this.router.navigate(['home']);
        this._rightAnswerCount = this.session.lastGameResults.correctAnswers;
        this._cashbackAmount = this.session.lastGameResults.cashbackWon || 0;
        this._firstTime = this.session.gamesPlayed == 1;
        this._gamesPlayed = +localStorage.getItem('demoGamesPlayed');
        console.log("Games Played: " + this._gamesPlayed);
        // If CashBack Won Set tothan
        this._cashbackAmount > 0;
        localStorage.setItem('demoCashWon', "10");
        var modal = uikit_1["default"].modal("#result");
        setTimeout(function () { modal.show(); }, 1000);
    };
    FreetimeresultComponent.prototype.startGame = function () {
        console.log("Goto Free Game!");
        this.router.navigate(['freetimegame']);
    };
    FreetimeresultComponent.prototype.goHome = function () {
        console.log("Goto Return Home!");
        this.router.navigate(['returnhome']);
    };
    FreetimeresultComponent = __decorate([
        core_1.Component({
            selector: 'app-freetimeresult',
            templateUrl: './freetimeresult.component.html',
            styleUrls: ['./freetimeresult.component.scss']
        })
    ], FreetimeresultComponent);
    return FreetimeresultComponent;
}());
exports.FreetimeresultComponent = FreetimeresultComponent;
