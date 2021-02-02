"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var core_1 = require('@angular/core');
var core_2 = require('@angular/core');
//import { phaser } from 'phaser';
var Ng2PhaserDirective = (function () {
    function Ng2PhaserDirective(el) {
        this.el = el;
        this.phaser = new core_1.EventEmitter();
        this.selfRef = el.nativeElement;
    }
    Ng2PhaserDirective.prototype.ngOnInit = function () {
        var t = this;
        // var alreadyLoaded = false;
        // var allScripts = document.getElementsByTagName("script");
        if (t.settings == undefined) {
            t.settings = {
                file: 'assets/scripts/phaser.min.js'
            };
        }
        var js = document.getElementById("PhaserLib");
        if (!js) {
            js = document.createElement("script");
            js.type = "text/javascript";
            js.src = t.settings.file;
            js.id = 'PhaserLib';
            document.body.appendChild(js);
            js.onload = function () {
                t.phaser.emit({ firstLoad: true, container: t.selfRef });
            };
        }
        else
            t.phaser.emit({ firstLoad: false, container: t.selfRef });
    };
    //--------------
    //--------------
    Ng2PhaserDirective.prototype.initPhaser = function () {
        this.phaser.emit({ container: this.selfRef });
    };
    __decorate([
        core_1.Output()
    ], Ng2PhaserDirective.prototype, "phaser");
    __decorate([
        core_1.Input()
    ], Ng2PhaserDirective.prototype, "settings");
    Ng2PhaserDirective = __decorate([
        core_2.Directive({
            selector: 'phaser'
        })
    ], Ng2PhaserDirective);
    return Ng2PhaserDirective;
}());
exports.Ng2PhaserDirective = Ng2PhaserDirective;
