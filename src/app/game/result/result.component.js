"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var core_1 = require('@angular/core');
var uikit_1 = require('uikit');
var ResultComponent = (function () {
    function ResultComponent(session, router) {
        this.session = session;
        this.router = router;
        this._firstTime = false;
        this._gamesPlayed = 2;
        this._rightAnswerCount = 10;
        this._cashbackAmount = 0;
        this._secondVariant = true;
        this._firstGameEver = true;
        this._firstGameToday = true;
        this._isInTop = true;
        this._bestWeekScore = 0;
    }
    Object.defineProperty(ResultComponent.prototype, "secondVariant", {
        get: function () {
            return this._secondVariant;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ResultComponent.prototype, "cashbackAmount", {
        get: function () {
            return this._cashbackAmount;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ResultComponent.prototype, "rightAnswerCount", {
        get: function () {
            return this._rightAnswerCount;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ResultComponent.prototype, "gamesPlayed", {
        get: function () {
            return this._gamesPlayed;
        },
        enumerable: true,
        configurable: true
    });
    ResultComponent.prototype.ngOnInit = function () {
        if (!this.session.lastGameResults)
            this.router.navigate(['home']);
        this._rightAnswerCount = this.session.lastGameResults.correctAnswers;
        this._cashbackAmount = this.session.lastGameResults.cashbackWon || 0;
        this._firstTime = this.session.gamesPlayed == 1;
        this._gamesPlayed = this.session.gamesPlayed;
        this._bestWeekScore = this.session.lastGameResults.isBestScoreLastWeek;
        this._isInTop = this.session.lastGameResults.isTop100;
        // Check Best Score Today
        var bestScore = this.session.user.bestScore;
        var bestScoreToday = this.session.user.bestScoreToday;
        if (this._rightAnswerCount > bestScoreToday)
            this.session.user.bestScoreToday = this._rightAnswerCount;
        if (this._rightAnswerCount > bestScore)
            this.session.user.bestScore = this._rightAnswerCount;
        console.log("Games Played: " + this._gamesPlayed);
        console.log("cashBack Won: " + this._cashbackAmount);
        var modal = uikit_1["default"].modal("#result");
        setTimeout(function () { modal.show(); }, 1000);
    };
    ResultComponent.prototype.startGame = function () {
        if (this._gamesPlayed >= 3) {
            // popup modal with error
            this.router.navigate(['returnhome']);
        }
        else {
            console.log("Play Main Game!");
            this.session.gamesPlayed++;
            this.router.navigate(['game']);
        }
    };
    ResultComponent.prototype.returnHome = function () {
        this.router.navigate(['returnhome']);
    };
    ResultComponent.prototype.startFreeGame = function () {
        this.router.navigate(['freetimegame']);
    };
    Object.defineProperty(ResultComponent.prototype, "TopText", {
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
    Object.defineProperty(ResultComponent.prototype, "FooterText", {
        get: function () {
            if (this._firstGameEver) {
                return "Станьте ближе к 25 000 ₽\nПолучите дополнительную игру сейчас!";
            }
            else if (this._firstGameToday) {
                return "Первая игра завершена!\nПродолжайте играть и бороться за 25 000 ₽";
            }
            else if (this._rightAnswerCount <= this._bestWeekScore) {
                return "В прошлый раз у вас получилось лучше…\nВпереди ждёт приз 25 000 ₽";
            }
            else if (this._isInTop) {
                if (this._gamesPlayed <= 2)
                    return "Вы среди лучших игроков!\n25 000 ₽ становятся всё ближе";
                else
                    return "Вы среди лидеров!\nВозвращайтесь в игру завтра";
            }
            else if (this._rightAnswerCount > this._bestWeekScore) {
                if (this._gamesPlayed <= 2)
                    return "Это ваш лучший результат за последние 7 дней.\nПродолжайте бороться за 25 000 ₽.";
                else
                    return "Это ваш лучший результат за последние 7 дней!\nЗавтра вы сможете сыграть еще лучше!";
            }
            else {
                if (this._gamesPlayed <= 2)
                    return "Продолжайте бороться за приз дня 25 000 ₽\nИграйте дополнительную игру сейчас!";
                else
                    return "Вы приложили много усилий!\nЗавтра вы сможете сыграть ещё лучше.";
            }
        },
        enumerable: true,
        configurable: true
    });
    ResultComponent = __decorate([
        core_1.Component({
            selector: 'app-result',
            templateUrl: './result.component.html',
            styleUrls: ['./result.component.scss']
        })
    ], ResultComponent);
    return ResultComponent;
}());
exports.ResultComponent = ResultComponent;
