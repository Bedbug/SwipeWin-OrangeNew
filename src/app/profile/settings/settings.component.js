"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var core_1 = require('@angular/core');
var environment_1 = require('../../../environments/environment');
var common_1 = require('@angular/common');
var uikit_1 = require('uikit');
var SettingsComponent = (function () {
    function SettingsComponent(sessionService, dataService, ng2ImgMax, router, cookieService) {
        this.sessionService = sessionService;
        this.dataService = dataService;
        this.ng2ImgMax = ng2ImgMax;
        this.router = router;
        this.cookieService = cookieService;
        this.sex = true;
        this.avatarPic = "assets/images/avatar.svg";
        // public userName="themis brink";
        this._name = "User #636";
        this._sex = "";
        this._age = 0;
        this.showAvatar = true;
    }
    SettingsComponent.prototype.doAlert = function () {
        this.sex = !this.sex;
        console.log(this.sex); // black
    };
    SettingsComponent.prototype.OnFileSelected = function (event) {
        var _this = this;
        console.log(event.target.files);
        // event.target.files
        if (event.target.files && event.target.files.length > 0) {
            this.selectedFile = event.target.files[0];
            console.log(this.selectedFile);
            this.ng2ImgMax.resizeImage(this.selectedFile, 120, 120).subscribe(function (result) {
                _this.selectedFile = result;
                var reader = new FileReader();
                reader.readAsDataURL(_this.selectedFile);
                reader.onload = function () {
                    var body = {
                        filename: _this.selectedFile.name,
                        filetype: _this.selectedFile.type,
                        value: reader.result.split(',')[1]
                    };
                    _this.dataService.saveUserProfile({
                        picture: body
                    }).then(function (res) {
                        if (_this.sessionService.user)
                            _this.sessionService.user.picture = res.picture;
                        _this.avatarPic = environment_1.environment.gameServerDomainUrl + '/' + res.picture + "?" + common_1.formatDate(new Date(), 'yyyy/MM/dd', 'en');
                        _this.refreshDiv();
                    }, function (err) { });
                };
            }, function (error) {
                console.log('😢 Oh no!', error);
            });
        }
    };
    SettingsComponent.prototype.ngOnInit = function () {
        // document.cookie = "MTSWebSSO=AQIC5wM2LY4SfcyG6qac3fbx5zt3ahcEyy7DWu13-YAK7YU.*AAJTSQACMDQAAlNLABQtMzg3NzQ5NzM0NjgyODcyNTUyMgACUzEAAjI0*; expires=Thu, 18 Dec 2023 12:00:00 UTC"
        // document.cookie = "username=John Doe";  
        // user login validation check
        if (!this.sessionService.token || !this.sessionService.isSubscribed || !this.sessionService.isEligible) {
            // wanna inform the user here?
            //this._cashback = this.sessionService.cashback;
            // Initiate user authentication
            this.dataService.authenticateRedirect();
        }
        else {
            this.token = this.sessionService.token;
            this.data$ = this.sessionService.user;
            // this._name =  "Paul Macartney"; //this.data$.username;
            // this._age = 22; //this.data$.age;
            // this._sex = "female"; //this.data$.gender;
            // this.data$ = this.sessionService.user;
            this.avatarPic = environment_1.environment.gameServerDomainUrl + '/' + this.data$.picture;
            this._name = this.data$.username;
            this._age = this.data$.age;
            this._sex = this.data$.gender;
            this.sex = this._sex == "male" ? this.sex = true : this.sex = false;
            if (this.data$.picture == null) {
                this.avatarPic = "assets/images/avatar.svg";
            }
            else
                this.refreshDiv();
        }
    };
    SettingsComponent.prototype.refreshDiv = function () {
        var _this = this;
        console.log("Refreshing Avatar!!!");
        this.showAvatar = false;
        this.avatarPic = "assets/images/avatar.svg";
        // setTimeout(()=>{
        //       this.avatarPic = "assets/images/avatar.svg";
        //       this.showAvatar = true
        //       // this.avatarPic =  environment.gameServerDomainUrl + '/' + this.data$.picture;
        //       }, 1000);
        setTimeout(function () {
            _this.showAvatar = true;
            _this.avatarPic = environment_1.environment.gameServerDomainUrl + '/' + _this.data$.picture;
            console.log(_this.avatarPic);
            !;
        }, 1000);
    };
    SettingsComponent.prototype.saveData = function () {
        var modal = uikit_1["default"].modal("#error");
        this.dataService.saveUserProfile({
            username: this._name,
            gender: this.sex ? 'male' : 'female',
            age: this._age
        }).then(function (res) { modal.show(); }, function (err) { });
    };
    SettingsComponent.prototype.goProfile = function () {
        this.router.navigate(['/profile']);
    };
    SettingsComponent.prototype.logOut = function () {
        console.log("LoggingOut!");
        var allCookies = this.cookieService.getAll();
        console.log(allCookies);
        // Trying the updated MTS logout redirect with the logout parameter
        this.sessionService.reset();
        this.router.navigate(['/home']);
        // this.dataService.logoutRedirect();
        // Trying the MTS revoke endpoint
        // this.dataService.logout().subscribe(
        //   (data: any) => {
        //     console.log(JSON.stringify(data));
        //     this.sessionService.reset();
        //     this.router.navigate(['/home']);
        //   },
        //   (error: any) => {
        //     console.error(error);
        //   }
        // )
        // for( var i = 0; i< allCookies.count; i++) {
        //   this.cookieService.delete(allCookies[i]);
        // }
        // this.cookieService.deleteAll('/');
        // // this.cookieService.deleteAll();
        // var cookies = document.cookie.split(";");
        //   for (var i = 0; i < cookies.length; i++) {
        //       var cookie = cookies[i];
        //       console.log(cookie);
        //       var eqPos = cookie.indexOf("=");
        //       var name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
        //       document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT";
        //   }
        // document.cookie.split(";").forEach(function(c) { document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/"); });
        // // window.open('https://login.mts.ru/amserver/UI/Logout', '_blank');
        // var tempUrl = 'https://login.mts.ru/amserver/oauth2/revoke?token='+this.token;
        // window.open(tempUrl);
        // this.dataService.logoutRedirect();
        //this.router.navigate(['/home']);
    };
    SettingsComponent.prototype.sendMail = function () {
        window.location.href = "mailto:support.mts@gu-group.ru?Subject=Help";
    };
    SettingsComponent.prototype.onKeyName = function (event) {
        this._name = event.data;
        console.log(this._name);
    };
    SettingsComponent.prototype.onKeyAge = function (event) {
        this._age = event.data;
        console.log(this._age);
    };
    SettingsComponent = __decorate([
        core_1.Component({
            selector: 'app-settings',
            templateUrl: './settings.component.html',
            styleUrls: ['./settings.component.scss']
        })
    ], SettingsComponent);
    return SettingsComponent;
}());
exports.SettingsComponent = SettingsComponent;
