"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var core_1 = require('@angular/core');
var SubscribeDialogComponent = (function () {
    function SubscribeDialogComponent(dataService, sessionService, router) {
        var _this = this;
        this.dataService = dataService;
        this.sessionService = sessionService;
        this.router = router;
        this._isUnsubscribeConfirm = false;
        this.unsubscribe = function () {
            // this._isUnsubscribeConfirm = true;
            _this.dataService.unsubscribe().then(function (data) {
                _this.sessionService.reset();
                _this.router.navigate(['/home']);
            }, function (err) {
            });
        };
    }
    Object.defineProperty(SubscribeDialogComponent.prototype, "isUnsubscribeConfirm", {
        get: function () {
            return this._isUnsubscribeConfirm;
        },
        enumerable: true,
        configurable: true
    });
    SubscribeDialogComponent.prototype.ngOnInit = function () {
    };
    SubscribeDialogComponent = __decorate([
        core_1.Component({
            selector: 'app-subscribe-dialog',
            templateUrl: './subscribe-dialog.component.html',
            styleUrls: ['./subscribe-dialog.component.scss']
        })
    ], SubscribeDialogComponent);
    return SubscribeDialogComponent;
}());
exports.SubscribeDialogComponent = SubscribeDialogComponent;
