"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var core_1 = require('@angular/core');
var FaqComponent = (function () {
    function FaqComponent(dataService, sessionService, router) {
        this.dataService = dataService;
        this.sessionService = sessionService;
        this.router = router;
        this.isActive = false;
        this._gamesPlayed = 0;
    }
    FaqComponent.prototype.ngOnInit = function () {
        if (!this.sessionService.token || !this.sessionService.isSubscribed || !this.sessionService.isEligible) {
            // wanna inform the user here?
            this.isActive = true;
        }
        else {
            this.isActive = false;
            this._gamesPlayed = this.sessionService.gamesPlayed;
        }
    };
    FaqComponent.prototype.subscribe = function ($event) {
        console.log('button is clicked');
        $event.stopPropagation();
        this.dataService.authenticateRedirect();
    };
    FaqComponent.prototype.startGame = function () {
        console.log("Play Main Game!");
        this.sessionService.gamesPlayed++;
        this.router.navigate(['game']);
    };
    FaqComponent.prototype.startFreeGame = function () {
        this.router.navigate(['freetimegame']);
    };
    FaqComponent = __decorate([
        core_1.Component({
            selector: 'app-faq',
            templateUrl: './faq.component.html',
            styleUrls: ['./faq.component.scss']
        })
    ], FaqComponent);
    return FaqComponent;
}());
exports.FaqComponent = FaqComponent;
