"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var core_1 = require('@angular/core');
var HistoryComponent = (function () {
    function HistoryComponent(dataService, sessionService) {
        this.dataService = dataService;
        this.sessionService = sessionService;
        this.headers = ['Кэшбэк рубли', 'Дата'];
        this.data = [
            ['', ''],
            ['', ''],
            ['', ''],
            ['', ''],
        ];
    }
    HistoryComponent.prototype.ngOnInit = function () {
        window.scroll(0, 0);
        // user login validation check
        if (!this.sessionService.token || !this.sessionService.isSubscribed || !this.sessionService.isEligible) {
            // wanna inform the user here?
            //this._cashback = this.sessionService.cashback;
            // Initiate user authentication
            this.dataService.authenticateRedirect();
        }
        else {
            this.data = [];
            for (var i = 0; i < this.sessionService.user.wallet.transferredCashbacks.length; i++) {
                var newDate = this.formatDate(this.sessionService.user.wallet.transferredCashbacks[i].cashbackWonAt);
                console.log(this.sessionService.user.wallet.transferredCashbacks[i].cashbackWonAt);
                this.data.push([this.sessionService.user.wallet.transferredCashbacks[i].cashbackWon, newDate.toString()]);
            }
        }
    };
    HistoryComponent.prototype.formatDate = function (stringDate) {
        var date = new Date(stringDate);
        return date.getDate() + '/' + (date.getMonth() + 1) + '/' + date.getFullYear();
    };
    HistoryComponent = __decorate([
        core_1.Component({
            selector: 'app-history',
            templateUrl: './history.component.html',
            styleUrls: ['./history.component.scss']
        })
    ], HistoryComponent);
    return HistoryComponent;
}());
exports.HistoryComponent = HistoryComponent;
