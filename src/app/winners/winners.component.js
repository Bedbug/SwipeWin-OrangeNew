"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var core_1 = require('@angular/core');
var WinnersComponent = (function () {
    function WinnersComponent(data) {
        this.data = data;
        this.dailyWinners$ = [];
        this.monthlyWinners$ = [];
        this.showDay = true;
        this.sliceNum = 5;
    }
    WinnersComponent.prototype.doAlert = function () {
        this.showDay = !this.showDay;
        console.log(this.showDay); // black
    };
    WinnersComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.data.getWinners().then(function (data) {
            _this.dailyWinners$ = data.dailyWinners;
            if (_this.dailyWinners$ == null)
                _this.dailyWinners$ = [{ id: "", username: "", msisdn: "", winDate: "", winSum: "" }, { id: "", username: "", msisdn: "", winDate: "", winSum: "" }, { id: "", username: "", msisdn: "", winDate: "", winSum: "" }, { id: "", username: "", msisdn: "", winDate: "", winSum: "" }];
            else if (_this.dailyWinners$[0].winDate != "") {
                for (var i = 0; i < _this.dailyWinners$.length; i++) {
                    var newDate = _this.formatDate(_this.dailyWinners$[i].winDate);
                    _this.dailyWinners$[i].winDate = newDate.toString();
                }
            }
            _this.monthlyWinners$ = data.monthlyWinners$;
            if (_this.monthlyWinners$ == null)
                _this.monthlyWinners$ = [{ id: "", username: "", msisdn: "", winDate: "" }, { id: "", username: "", msisdn: "", winDate: "" }, { id: "", username: "", msisdn: "", winDate: "" }, { id: "", username: "", msisdn: "", winDate: "" }];
            if (_this.monthlyWinners$ == null)
                _this.monthlyWinners$ = [];
            else if (_this.monthlyWinners$[0].winDate != "") {
                for (var i = 0; i < _this.monthlyWinners$.length; i++) {
                    var newDate = _this.formatDate(_this.monthlyWinners$[i].winDate);
                    _this.monthlyWinners$[i].winDate = newDate.toString();
                }
            }
        }, function (err) {
            console.error(err);
        });
    };
    WinnersComponent.prototype.formatDate = function (stringDate) {
        var date = new Date(stringDate);
        return date.getDate() + '/' + (date.getMonth() + 1) + '/' + date.getFullYear();
    };
    WinnersComponent = __decorate([
        core_1.Component({
            selector: 'app-winners',
            templateUrl: './winners.component.html',
            styleUrls: ['./winners.component.scss']
        })
    ], WinnersComponent);
    return WinnersComponent;
}());
exports.WinnersComponent = WinnersComponent;
