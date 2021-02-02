"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var core_1 = require('@angular/core');
var TutorialComponent = (function () {
    function TutorialComponent(globals) {
        this.globals = globals;
        this.isFirstDemo = globals.isFirstDemo;
    }
    TutorialComponent.prototype.ngOnInit = function () {
        console.log("Change globals.isFirstDemo to: " + this.globals.isFirstDemo);
    };
    TutorialComponent.prototype.changeTutorialFlag = function () {
        this.isFirstDemo = false;
        this.globals.isFirstDemo = this.isFirstDemo;
        console.log("Change isFirstDemo to: " + this.isFirstDemo);
        console.log("Change globals.isFirstDemo to: " + this.globals.isFirstDemo);
    };
    TutorialComponent = __decorate([
        core_1.Component({
            selector: 'app-tutorial',
            templateUrl: './tutorial.component.html',
            styleUrls: ['./tutorial.component.scss']
        })
    ], TutorialComponent);
    return TutorialComponent;
}());
exports.TutorialComponent = TutorialComponent;
