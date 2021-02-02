"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var core_1 = require('@angular/core');
var environment_1 = require('../../environments/environment');
var _ = require('lodash');
//declare var __phaser:any;
var DemogameComponent = (function () {
    function DemogameComponent(dataService, router, sessionService, globals, deviceService) {
        this.dataService = dataService;
        this.router = router;
        this.sessionService = sessionService;
        this.globals = globals;
        this.deviceService = deviceService;
        this.epicFunction();
        // this.globals.isFirstDemo.subscribe((value) => {
        //         this._tutorialOn = value
        //     });
        // this._tutorialOn = globals.isFirstDemo;
    }
    DemogameComponent.prototype.epicFunction = function () {
        console.log('hello `Home` component');
        this.deviceInfo = this.deviceService.getDeviceInfo();
        var isMobile = this.deviceService.isMobile();
        var isTablet = this.deviceService.isTablet();
        var isDesktopDevice = this.deviceService.isDesktop();
        console.log(this.deviceInfo);
        console.log("This is a Mobile: " + isMobile); // returns if the device is a mobile device (android / iPhone / windows-phone etc)
        console.log("This is a Tablet: " + isTablet); // returns if the device us a tablet (iPad etc)
        console.log("This is a Desktop: " + isDesktopDevice); // returns if the app is running on a Desktop browser.
        this.isDesktopDevice = isDesktopDevice;
        this.isMobile = isMobile;
        this.isTablet = isTablet;
        // First Check Of orientation
        if (window.innerWidth > window.innerHeight && isMobile || window.innerWidth > window.innerHeight && isTablet)
            this.isLandscape = true;
        else
            this.isLandscape = false;
    };
    DemogameComponent.prototype.onResize = function (event) {
        // console.log(event);
        // console.log(event.target.innerWidth);
        if (event.target.innerWidth > event.target.innerHeight && this.isMobile || event.target.innerWidth > event.target.innerHeight && this.isTablet) {
            console.log("This is Landscape!!!");
            this.isLandscape = true;
        }
        else {
            this.startAsLandscape = false;
            this.isLandscape = false;
        }
    };
    DemogameComponent.prototype.ngOnInit = function () {
        // TO BE ERASED
        // localStorage.setItem('firstTime','yes');
        if (!this.sessionService.gameSettings || !this.sessionService.gameSettings.maintenance || this.sessionService.gameSettings.maintenance.siteDown || this.sessionService.gameSettings.maintenance.noGames)
            this.router.navigate(['/home']);
        else {
            if (this.isLandscape) {
                this.startAsLandscape = true;
            }
            else {
                this.startAsLandscape = false;
            }
            console.log("Start As Landscape: " + this.startAsLandscape);
            //check if first time and open tutorial
            var isFirst = localStorage.getItem('firstTime');
            if (isFirst != "no") {
                this.globals.isFirstDemo = true;
                localStorage.setItem('firstTime', 'no');
            }
            else {
                this.globals.isFirstDemo = false;
            }
        }
    };
    DemogameComponent.prototype.loadDemo = function (phaser) {
        var that = this;
        console.log("Loading Game!!!");
        var window = that.dataService.getWindow();
        var js = document.getElementById("Phaser");
        if (!js) {
            js = document.createElement("script");
            js.type = "text/javascript";
            js.id = 'Phaser';
            js.src = 'assets/scripts/PhaserComboGame.min.js';
            // js.src = 'assets/scripts/PhaserComboGame.js';
            document.body.appendChild(js);
            js.onload = function () {
                that._phaser = window.__phaser;
                that._phaser.api = that.dataService;
                that._phaser._ = _;
                that._phaser.environment = environment_1.environment;
                that._phaser.game.type = 'demo';
                that._phaser.game.init(phaser.container, this);
            };
        }
        else {
            this._phaser = window.__phaser;
            this._phaser.api = this.dataService;
            this._phaser._ = _;
            this._phaser.environment = environment_1.environment;
            this._phaser.game.type = 'demo';
            this._phaser.game.init(phaser.container, this);
        }
    };
    DemogameComponent.prototype.destroyGame = function () {
        if (this._phaser)
            this._phaser.destroyGame(function () {
                // do something
            });
    };
    //---------------
    //---------------
    DemogameComponent.prototype.ngOnDestroy = function () {
        this.destroyGame();
    };
    DemogameComponent = __decorate([
        core_1.Component({
            selector: 'app-demogame',
            templateUrl: './demogame.component.html',
            styleUrls: ['./demogame.component.scss']
        })
    ], DemogameComponent);
    return DemogameComponent;
}());
exports.DemogameComponent = DemogameComponent;
