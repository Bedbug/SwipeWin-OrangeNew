"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var core_1 = require('@angular/core');
var LocalizationService = (function () {
    function LocalizationService() {
        this.locale = 'en';
        this.dictionary = {};
    }
    LocalizationService.prototype.init = function (dictionary) {
        this.dictionary = dictionary;
    };
    LocalizationService.prototype.Translate = function (term) {
        var localeDictionary = this.dictionary[this.locale] || this.dictionary['en'];
        if (localeDictionary)
            return localeDictionary[term] || "[" + term + "]";
        else
            return "[" + term + "]";
    };
    LocalizationService.prototype.TranslateQuestion = function (question) {
        return question[this.locale] || question['en'];
    };
    LocalizationService = __decorate([
        core_1.Injectable({
            providedIn: 'root'
        })
    ], LocalizationService);
    return LocalizationService;
}());
exports.LocalizationService = LocalizationService;
