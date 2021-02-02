"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var core_1 = require('@angular/core');
var forms_1 = require('@angular/forms');
var R = require('ramda');
var InputTextComponent = (function () {
    function InputTextComponent() {
        var _this = this;
        this.inputPlaceholder = '';
        this.inputType = 'text'; // password
        this.disabled = false;
        this.placeholder = '';
        this.blur = new core_1.EventEmitter();
        this.change = new core_1.EventEmitter();
        this.focus = new core_1.EventEmitter();
        this.keyup = new core_1.EventEmitter();
        this.isLabelPulled = false;
        this.hideErrors = true;
        this.propagateChange = function (_) { };
        this.onTouched = function () { };
        this.onChange = function (e, input) {
            _this.data = e.target.value;
            _this.updateLabel();
            if (_this.data === '') {
                _this.isLabelPulled = true;
            }
            _this.change.emit(e.target.value);
            _this.keyup.emit({ event: e, data: input });
            _this.propagateChange(_this.data); // .replace(/[^0-9,]/g, '')
        };
        this.onFocus = function () {
            _this.focus.emit(_this.data);
            _this.isLabelPulled = true;
            _this.hideErrors = true;
        };
        this.onBlur = function ($e) {
            _this.blur.emit($e);
            _this.updateLabel();
            _this.hideErrors = false;
        };
    }
    InputTextComponent.prototype.registerOnTouched = function (fn) {
        this.onTouched = fn;
    };
    InputTextComponent.prototype.registerOnChange = function (fn) {
        this.propagateChange = fn;
    };
    InputTextComponent.prototype.setDisabledState = function (isDisabled) {
        this.disabled = isDisabled;
    };
    InputTextComponent.prototype.updateLabel = function () {
        if (this.label) {
            this.isLabelPulled = !!this.data;
        }
    };
    InputTextComponent.prototype.setBlur = function () {
        this.hideErrors = false;
    };
    InputTextComponent.prototype.ngOnInit = function () {
    };
    __decorate([
        core_1.Input()
    ], InputTextComponent.prototype, "inputPlaceholder");
    __decorate([
        core_1.Input()
    ], InputTextComponent.prototype, "inputType");
    __decorate([
        // password
        core_1.Input()
    ], InputTextComponent.prototype, "disabled");
    __decorate([
        core_1.Input()
    ], InputTextComponent.prototype, "label");
    __decorate([
        core_1.Input()
    ], InputTextComponent.prototype, "placeholder");
    __decorate([
        core_1.Output()
    ], InputTextComponent.prototype, "blur");
    __decorate([
        core_1.Output()
    ], InputTextComponent.prototype, "change");
    __decorate([
        core_1.Output()
    ], InputTextComponent.prototype, "focus");
    __decorate([
        core_1.Output()
    ], InputTextComponent.prototype, "keyup");
    InputTextComponent = __decorate([
        core_1.Component({
            selector: 'app-input-text',
            templateUrl: './input-text.component.html',
            styleUrls: ['./input-text.component.scss'],
            providers: [
                {
                    provide: forms_1.NG_VALUE_ACCESSOR,
                    useExisting: core_1.forwardRef(function () { return InputTextComponent; }),
                    multi: true
                }
            ]
        })
    ], InputTextComponent);
    return InputTextComponent;
}());
exports.InputTextComponent = InputTextComponent;
