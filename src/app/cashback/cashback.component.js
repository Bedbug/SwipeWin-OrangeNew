"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var core_1 = require('@angular/core');
var VIEW_STATES = {
    KASHBACK: 'SHOW_KASHBACK',
    HISTORY: 'SHOW_HISTORY'
};
var CashbackComponent = (function () {
    function CashbackComponent(dataService, sessionService, router) {
        var _this = this;
        this.dataService = dataService;
        this.sessionService = sessionService;
        this.router = router;
        // Get Info From Server and Add to balance
        // If more than 0 button will be available and sum available to transfer
        //
        this.state = VIEW_STATES.KASHBACK;
        this.isOpenDialog = false;
        this.amountPending = 0;
        this.hoursRemain = 0;
        this.balance = 0;
        this.message = 'Будут доступны через ХХ часов';
        this.error = true;
        // public showHistory = () => this.state = VIEW_STATES.HISTORY;
        this.isHistoryShowable = function () { return _this.state === VIEW_STATES.HISTORY; };
        this.transferToAccount = function () { return _this.isOpenDialog = true; };
    }
    CashbackComponent.prototype.DoTransfer = function () {
        var _this = this;
        console.log("Transferring Money!!!");
        this.dataService.transferCashback().then(function (data) {
            _this.sessionService.user = data;
            _this.error = false;
        }, function (err) {
            console.error('Cashback transfer error: ' + err.body || err);
            _this.error = true; // or false // opens diferent state of modal
        });
    };
    CashbackComponent.prototype.ngOnInit = function () {
        window.scroll(0, 0);
        // user login validation check
        if (!this.sessionService.token || !this.sessionService.isSubscribed || !this.sessionService.isEligible) {
            this.dataService.authenticateRedirect();
        }
        else {
            this.state = VIEW_STATES.KASHBACK;
            this.balance = this.sessionService.user.wallet.pendingTransferCashback;
            this.amountPending = this.sessionService.user.wallet.pendingMaturityCashback;
            // TEST ////////////////////
            // this.balance = 0;
            // this.amountPending = 40;
            ////////////////////////////
            this.hoursRemain = this.sessionService.user.wallet.pendingMaturityCashbackHoursToMature;
            // console.log(this.hoursRemain);
            this.message = "Будет доступно через: " + this.hoursRemain + " ч.";
        }
    };
    CashbackComponent.prototype.showHistory = function () {
        this.router.navigate(['/history']);
    };
    CashbackComponent = __decorate([
        core_1.Component({
            selector: 'app-cashback',
            templateUrl: './cashback.component.html',
            styleUrls: ['./cashback.component.scss']
        })
    ], CashbackComponent);
    return CashbackComponent;
}());
exports.CashbackComponent = CashbackComponent;
