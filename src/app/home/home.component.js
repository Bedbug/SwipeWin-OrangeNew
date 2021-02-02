"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var core_1 = require('@angular/core');
var uikit_1 = require('uikit');
var HomeComponent = (function () {
    function HomeComponent(dataService, sessionService, localizationService, router, activatedRoute, cookieService) {
        this.dataService = dataService;
        this.sessionService = sessionService;
        this.localizationService = localizationService;
        this.router = router;
        this.activatedRoute = activatedRoute;
        this.cookieService = cookieService;
        this._isSubscribed = true;
        this._isHasCashback = false;
        this.demoGamesPlayed = 0;
        this.errorMsg = "";
        this.noMoreRealGames = "К несчастью ваш текущий тарифный план не соответствует требованиям игры «Правда или ложь». Попробуйте воспользоваться другим телефонным номером МТС.";
        this.noMoreDemoGames = "Доступных Демо игр нет! \n Почему бы вам не попробовать сыграть в реальную игру?";
        this.authError = "Согласно Правилам, ваш тарифный план не даёт право на участие в игре Правда или Ложь.\n Попробуйте играть с другого номера МТС";
        this.logOut = "Сеанс недействителен или завершен.\nПожалуйста, выполните повторный вход в систему";
        this.blackListed = "Номер заблокирован.\n К сожалению вы не можете участвовать с данного или любого другого номера";
        this.noCredits = "Недостаточно средств для участия в игре Правда или Ложь";
        this.logOutBtn = true;
        this.gotofaqBtn = false;
        this.now = new Date();
        this.showLogin = false;
    }
    Object.defineProperty(HomeComponent.prototype, "isHasCashback", {
        // get this form the User object
        get: function () {
            return this._isHasCashback;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(HomeComponent.prototype, "isSubscribed", {
        // get this form the User objectusername
        get: function () {
            return this._isSubscribed;
        },
        enumerable: true,
        configurable: true
    });
    HomeComponent.prototype.ngOnInit = function () {
        var _this = this;
        // CLEAR THIS, JUST FOR TESTING
        // This Resets Every time the demo games played
        // localStorage.setItem('demoGamesPlayed', "0");
        this.lastDemoPlayed = new Date((localStorage.getItem('lastDemoPlayed')));
        console.log("Last Time Played: " + this.lastDemoPlayed);
        console.log("Now: " + this.now);
        var hours = Math.abs((this.now.getTime() - this.lastDemoPlayed.getTime()) / 3600000);
        if (hours > 1)
            localStorage.setItem('demoGamesPlayed', "0");
        console.log("Substract Dates: " + hours);
        // Check if we have any errorCode in the url, coming from another angular state
        this.activatedRoute.queryParams.subscribe(function (params) {
            var errorCode = params["errorCode"];
            var modal = uikit_1["default"].modal("#error");
            if (errorCode) {
                switch (errorCode) {
                    case '401':
                        _this.errorMsg = _this.authError;
                        _this.logOutBtn = true;
                        _this.gotofaqBtn = true;
                        console.log('401');
                        break;
                    case '1010':
                        _this.errorMsg = _this.authError;
                        _this.logOutBtn = true;
                        _this.gotofaqBtn = true;
                        console.log('1010');
                        break;
                    case '1026':
                        _this.errorMsg = _this.blackListed;
                        _this.logOutBtn = true;
                        _this.gotofaqBtn = true;
                        console.log('1026');
                        break;
                    case '1023':
                        _this.errorMsg = _this.noMoreRealGames;
                        _this.gotofaqBtn = false;
                        _this.logOutBtn = false;
                        break;
                    case '1021':
                        _this.errorMsg = _this.noCredits;
                        _this.gotofaqBtn = false;
                        _this.logOutBtn = false;
                        break;
                    case '1025':
                        _this.errorMsg = _this.noCredits;
                        _this.gotofaqBtn = false;
                        _this.logOutBtn = false;
                        break;
                }
                if (_this.sessionService.user)
                    _this.sessionService.reset();
                if (_this.errorMsg !== '' && modal != null) {
                    modal.show();
                }
            }
        });
        // Load the game settings
        this.dataService.fetchGameSettings().then(function (data) {
            _this.sessionService.gameSettings = data;
            _this.localizationService.init(_this.sessionService.gameSettings.localization);
        }, function (err) { });
    };
    HomeComponent.prototype.playGame = function ($event) {
        // console.log('button is clicked');
        // $event.stopPropagation();
        // this.dataService.authenticateRedirect();
        this.showLogin = true;
    };
    // public playGame($event) {
    //   console.log('button is clicked');
    //   $event.stopPropagation();
    //   this.dataService.authenticateRedirect();
    // }
    HomeComponent.prototype.logOutUser = function () {
        console.log("LoggingOut!");
        var allCookies = this.cookieService.getAll();
        console.log(allCookies);
        this.cookieService.deleteAll('/');
        // Trying the updated MTS logout redirect with the logout parameter
        this.sessionService.reset();
        this.router.navigate(['/home']);
        // this.dataService.logoutRedirect();
    };
    HomeComponent.prototype.gotoFaqPage = function () {
        this.logOutUser();
        this.router.navigate(['/faq']);
    };
    HomeComponent.prototype.login = function (user, pass) {
        console.log("username: " + user);
        console.log("password: " + pass);
        // Run or Go to returnHome
        this.router.navigate(['/auth-callback'], { queryParams: { code: user } });
    };
    // Check the number of games played in demo mode
    HomeComponent.prototype.playDemoGame = function ($event) {
        console.log('Demo button is clicked');
        if (!this.sessionService.gameSettings || !this.sessionService.gameSettings.maintenance || this.sessionService.gameSettings.maintenance.siteDown || this.sessionService.gameSettings.maintenance.noGames)
            return;
        // this.router.navigate(['demogame']);
        this.demoGamesPlayed = +localStorage.getItem('demoGamesPlayed');
        // Check games count
        console.log("demoGamesPlayed " + this.demoGamesPlayed);
        if (this.demoGamesPlayed >= 2) {
            // popup modal with error
            var modal = uikit_1["default"].modal("#error");
            this.errorMsg = this.noMoreDemoGames;
            modal.show();
        }
        else {
            // Add one and play the demo game
            this.demoGamesPlayed++;
            localStorage.setItem('demoGamesPlayed', this.demoGamesPlayed.toString());
            localStorage.setItem('lastDemoPlayed', (new Date()).toString());
            // this.router.navigate(['demogame']);
            this.router.navigate(['demogame']);
        }
    };
    HomeComponent = __decorate([
        core_1.Component({
            selector: 'app-home',
            templateUrl: './home.component.html',
            styleUrls: ['./home.component.scss']
        })
    ], HomeComponent);
    return HomeComponent;
}());
exports.HomeComponent = HomeComponent;
