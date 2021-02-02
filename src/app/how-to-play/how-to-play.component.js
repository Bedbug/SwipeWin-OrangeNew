"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var core_1 = require('@angular/core');
var HowToPlayComponent = (function () {
    function HowToPlayComponent(dataService, sessionService, router) {
        this.dataService = dataService;
        this.sessionService = sessionService;
        this.router = router;
        this.isActive = false;
        this._gamesPlayed = 0;
    }
    HowToPlayComponent.prototype.ngOnInit = function () {
        window.scroll(0, 0);
        if (!this.sessionService.token || !this.sessionService.isSubscribed || !this.sessionService.isEligible) {
            // wanna inform the user here?
            this.isActive = true;
        }
        else {
            this.isActive = false;
            this._gamesPlayed = this.sessionService.gamesPlayed;
        }
    };
    HowToPlayComponent.prototype.subscribe = function ($event) {
        console.log('button is clicked');
        $event.stopPropagation();
        this.dataService.authenticateRedirect();
    };
    HowToPlayComponent.prototype.startGame = function () {
        console.log("Play Main Game!");
        this.sessionService.gamesPlayed++;
        this.router.navigate(['game']);
    };
    HowToPlayComponent.prototype.startFreeGame = function () {
        this.router.navigate(['freetimegame']);
    };
    HowToPlayComponent = __decorate([
        core_1.Component({
            selector: 'app-how-to-play',
            templateUrl: './how-to-play.component.html',
            styleUrls: ['./how-to-play.component.scss']
        })
    ], HowToPlayComponent);
    return HowToPlayComponent;
}());
exports.HowToPlayComponent = HowToPlayComponent;
