"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var core_1 = require('@angular/core');
var router_1 = require('@angular/router');
var common_1 = require('@angular/common');
var AuthCallbackComponent = (function () {
    function AuthCallbackComponent(location, dataService, sessionService, router) {
        this.location = location;
        this.dataService = dataService;
        this.sessionService = sessionService;
        this.router = router;
    }
    AuthCallbackComponent.prototype.ngOnInit = function () {
        var urlSer = new router_1.DefaultUrlSerializer();
        console.log('incoming path: ' + this.location.path());
        var urlTree = urlSer.parse(this.location.path());
        //const urlParams = new URLSearchParams(window.location.href);
        var state = urlTree.queryParams['state'];
        var code = urlTree.queryParams['code'];
        var error = urlTree.queryParams['error'];
        var that = this;
        /*
        this.dataService.authenticateUserToken(code).subscribe(
            data => {
                const msisdn = '7' + data['mobile:phone'];
                this.sessionService.msisdn = msisdn;
                this.sessionService.mtsToken = data['accessToken'];
                this.sessionService.Serialize();
                
                this.checkUserSubscription();
            },
            err => {
              console.log("This");
                that.router.navigate(['/home'], { queryParams: { errorCode: 1010 } });
            }
        );
        */
        switch (code) {
            case "6970000001":
                this.sessionService.msisdn = "6970000001";
                break;
            case "6970000002":
                this.sessionService.msisdn = "6970000002";
                break;
            case "6970000003":
                this.sessionService.msisdn = "6970000003";
                break;
        }
        this.sessionService.Serialize();
        this.checkUserSubscription();
    };
    AuthCallbackComponent.prototype.checkUserSubscription = function () {
        var _this = this;
        this.dataService.authorizeUser().subscribe(function (resp) {
            // Get JWT token from response header and keep it for the session
            var userToken = resp.headers.get('X-Access-Token');
            if (userToken)
                _this.sessionService.token = userToken;
            // Deserialize payload
            var body = resp.body; // JSON.parse(response);
            if (body.isEligible !== undefined)
                _this.sessionService.isEligible = body.isEligible;
            if (body.isSubscribed != undefined)
                _this.sessionService.isSubscribed = body.isSubscribed;
            if (body.gamesPlayedToday !== undefined)
                _this.sessionService.gamesPlayed = body.gamesPlayedToday;
            _this.sessionService.Serialize();
            // Goto the returnHome page
            _this.router.navigate(['/returnhome']);
        }, function (err) {
            _this.router.navigate(['/home'], { queryParams: { errorCode: 1010 } });
        });
    };
    AuthCallbackComponent = __decorate([
        core_1.Component({
            selector: 'app-auth-callback',
            templateUrl: './auth-callback.component.html',
            styleUrls: ['./auth-callback.component.scss'],
            providers: [common_1.Location, { provide: common_1.LocationStrategy, useClass: common_1.PathLocationStrategy }]
        })
    ], AuthCallbackComponent);
    return AuthCallbackComponent;
}());
exports.AuthCallbackComponent = AuthCallbackComponent;
