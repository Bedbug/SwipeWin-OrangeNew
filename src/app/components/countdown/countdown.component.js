"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var core_1 = require('@angular/core');
var CountdownComponent = (function () {
    function CountdownComponent() {
        var _this = this;
        this._timer = 3;
        this.timerStart = function () {
            var timerId = setInterval(function () {
                if (_this._timer === 1) {
                    clearInterval(timerId);
                }
                _this._timer--;
            }, 1000);
        };
    }
    Object.defineProperty(CountdownComponent.prototype, "timer", {
        get: function () {
            return this._timer;
        },
        enumerable: true,
        configurable: true
    });
    CountdownComponent.prototype.ngOnInit = function () {
        this.timerStart();
    };
    CountdownComponent = __decorate([
        core_1.Component({
            selector: 'app-countdown',
            templateUrl: './countdown.component.html',
            styleUrls: ['./countdown.component.scss']
        })
    ], CountdownComponent);
    return CountdownComponent;
}());
exports.CountdownComponent = CountdownComponent;
