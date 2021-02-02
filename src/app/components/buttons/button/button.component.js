"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var core_1 = require('@angular/core');
var ButtonComponent = (function () {
    function ButtonComponent() {
        this.type = 'button';
        this.disabled = false;
        this.submit = false;
        this.primary = false;
        this.secondary = false;
        this.link_button = false;
        this.outlined = false;
        this.link_button_white = false;
        this.clicked = new core_1.EventEmitter();
    }
    ButtonComponent.prototype.onClick = function (e) {
        if (!this.disabled) {
            this.clicked.emit();
        }
        else {
            e.preventDefault();
            e.stopImmediatePropagation();
            e.stopPropagation();
            return false;
        }
    };
    ButtonComponent.prototype.ngOnInit = function () {
    };
    __decorate([
        core_1.Input()
    ], ButtonComponent.prototype, "type");
    __decorate([
        core_1.Input()
    ], ButtonComponent.prototype, "disabled");
    __decorate([
        core_1.Input()
    ], ButtonComponent.prototype, "submit");
    __decorate([
        core_1.Input()
    ], ButtonComponent.prototype, "primary");
    __decorate([
        core_1.Input()
    ], ButtonComponent.prototype, "secondary");
    __decorate([
        core_1.Input()
    ], ButtonComponent.prototype, "link_button");
    __decorate([
        core_1.Input()
    ], ButtonComponent.prototype, "outlined");
    __decorate([
        core_1.Input()
    ], ButtonComponent.prototype, "link_button_white");
    __decorate([
        core_1.Output()
    ], ButtonComponent.prototype, "clicked");
    ButtonComponent = __decorate([
        core_1.Component({
            selector: 'app-button',
            templateUrl: './button.component.html',
            styleUrls: ['./button.component.scss']
        })
    ], ButtonComponent);
    return ButtonComponent;
}());
exports.ButtonComponent = ButtonComponent;
