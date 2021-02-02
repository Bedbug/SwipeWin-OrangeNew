"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var core_1 = require('@angular/core');
var HeaderComponent = (function () {
    function HeaderComponent(session, router) {
        this.session = session;
        this.router = router;
        this.pushed = false;
        this.mobileMenuState = false;
        this.menuIconPath = 'menu';
        // this.url = router.url;
    }
    HeaderComponent.prototype.ngOnInit = function () {
        var that = this;
        UIkit.util.on('#offcanvas-nav', 'hide', function (e) {
            // do something
            var currentClass = this
                .parentElement
                .getElementsByClassName('hamburger-menu')[0]
                .children[0]
                .className;
            if (currentClass.includes('pushed')) {
                that.toggleClass();
            }
        });
    };
    HeaderComponent.prototype.toggleClass = function () {
        console.log("Toggleing!!!");
        this.pushed = !this.pushed;
    };
    HeaderComponent.prototype.changeMenuState = function (event) {
        this.mobileMenuState = !this.mobileMenuState;
        console.log(this.mobileMenuState);
        if (this.menuIconPath === 'menu') {
            this.menuIconPath = 'close';
        }
        else {
            this.menuIconPath = 'menu';
        }
    };
    HeaderComponent.prototype.closeOffcanvas = function () {
        UIkit.offcanvas('#offcanvas-nav').hide();
    };
    HeaderComponent.prototype.gotoProfile = function () {
        this.router.navigate(['/profile']);
    };
    HeaderComponent.prototype.gotoHome = function () {
        if (!this.session.token) {
            // Redirect him to Home
            this.router.navigate(['/home']);
        }
        else {
            this.router.navigate(['/returnhome']);
        }
    };
    HeaderComponent = __decorate([
        core_1.Component({
            selector: 'app-header',
            templateUrl: './header.component.html',
            styleUrls: ['./header.component.scss']
        })
    ], HeaderComponent);
    return HeaderComponent;
}());
exports.HeaderComponent = HeaderComponent;
