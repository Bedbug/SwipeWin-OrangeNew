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
var GameComponent = (function () {
    function GameComponent(dataService, router, sessionService, globals) {
        this.dataService = dataService;
        this.router = router;
        this.sessionService = sessionService;
        this.globals = globals;
        this._tutorialOn = false;
        this._gameInited = false;
    }
    Object.defineProperty(GameComponent.prototype, "tutorialOn", {
        get: function () {
            return this._tutorialOn;
        },
        enumerable: true,
        configurable: true
    });
    GameComponent.prototype.ngOnInit = function () {
        // user login validation check
        if (!this.sessionService.token || !this.sessionService.isSubscribed || !this.sessionService.isEligible) {
            // wanna inform the user here?
            // Redirect him to Home
            this.router.navigate(['/home'], { queryParams: { errorCode: 401 } });
        }
        else {
            // TO BE ERASED
            // localStorage.setItem('firstTime','yes');
            //check if first time and open tutorial
            var isFirst = localStorage.getItem('firstTime');
            if (isFirst != "no") {
                this.globals.isFirstDemo = true;
                localStorage.setItem('firstTime', 'no');
            }
            else {
                this.globals.isFirstDemo = false;
            }
        }
    };
    GameComponent.prototype.loadGame = function (phaser) {
        var that = this;
        var window = that.dataService.getWindow();
        var js = document.getElementById("Phaser");
        if (js) {
            that._gameInited = true;
            that._phaser = window.__phaser;
            that._phaser.api = that.dataService;
            that._phaser._ = _;
            that._phaser.game.type = 'normal';
            that._phaser.environment = environment_1.environment;
            that._phaser.game.init(phaser.container, this);
        }
        else {
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
                that._phaser.game.type = 'normal';
                that._phaser.environment = environment_1.environment;
                that._phaser.game.init(phaser.container, this);
            };
        }
    };
    GameComponent.prototype.destroyGame = function () {
        if (this._phaser !== undefined && this._phaser !== null) {
            this._phaser.destroyGame(function () {
                // do something
                // var js = document.getElementById('Phaser');
                // if (js)
                //   js.parentNode.removeChild(js);
            });
        }
    };
    //---------------
    //---------------
    GameComponent.prototype.ngOnDestroy = function () {
        if (this._gameInited)
            this.destroyGame();
    };
    GameComponent = __decorate([
        core_1.Component({
            selector: 'app-game',
            templateUrl: './game.component.html'
        })
    ], GameComponent);
    return GameComponent;
}());
exports.GameComponent = GameComponent;
