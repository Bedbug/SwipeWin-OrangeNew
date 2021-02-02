"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var core_1 = require('@angular/core');
var environment_1 = require('../../environments/environment');
var _ = require('lodash');
var FreetimegameComponent = (function () {
    function FreetimegameComponent(dataService, router, sessionService) {
        this.dataService = dataService;
        this.router = router;
        this.sessionService = sessionService;
        this._gameInited = false;
    }
    FreetimegameComponent.prototype.ngOnInit = function () {
        // user login validation check
        if (!this.sessionService.token || !this.sessionService.isSubscribed || !this.sessionService.isEligible) {
            // wanna inform the user here?
            // Redirect him to Home
            this.router.navigate(['/home'], { queryParams: { errorCode: 401 } });
        }
        else {
        }
    };
    FreetimegameComponent.prototype.loadGame = function (phaser) {
        var that = this;
        var document = this.dataService.getDocument();
        var window = that.dataService.getWindow();
        var js = document.getElementById("Phaser");
        if (!js) {
            js = document.createElement("script");
            js.type = "text/javascript";
            js.id = 'Phaser';
            js.src = 'assets/scripts/PhaserComboGame.min.js';
            document.body.appendChild(js);
            js.onload = function () {
                that._gameInited = true;
                that._phaser = window.__phaser;
                that._phaser.api = that.dataService;
                that._phaser._ = _;
                that._phaser.game.type = 'timefree';
                that._phaser.environment = environment_1.environment;
                that._phaser.game.init(phaser.container, this);
            };
            js.onerror = function (err) {
                console.error(err);
            };
        }
        else {
            that._gameInited = true;
            this._phaser = window.__phaser;
            this._phaser.api = that.dataService;
            this._phaser._ = _;
            this._phaser.game.type = 'timefree';
            this._phaser.environment = environment_1.environment;
            this._phaser.game.init(phaser.container, this);
        }
    };
    FreetimegameComponent.prototype.destroyGame = function () {
        if (this._phaser !== undefined && this._phaser !== null) {
            this._phaser.destroyGame(function () {
                // do something
            });
        }
    };
    //---------------
    //---------------
    FreetimegameComponent.prototype.ngOnDestroy = function () {
        if (this._gameInited)
            this.destroyGame();
    };
    FreetimegameComponent = __decorate([
        core_1.Component({
            selector: 'app-freetimegame',
            templateUrl: './freetimegame.component.html',
            styleUrls: ['./freetimegame.component.scss']
        })
    ], FreetimegameComponent);
    return FreetimegameComponent;
}());
exports.FreetimegameComponent = FreetimegameComponent;
