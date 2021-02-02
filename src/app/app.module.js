"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var platform_browser_1 = require('@angular/platform-browser');
var core_1 = require('@angular/core');
var router_1 = require('@angular/router');
var app_component_1 = require('./app.component');
var header_component_1 = require('./header/header.component');
var footer_component_1 = require('./footer/footer.component');
var home_component_1 = require('./home/home.component');
var winners_component_1 = require('./winners/winners.component');
var faq_component_1 = require('./faq/faq.component');
var profile_component_1 = require('./profile/profile.component');
var how_to_play_component_1 = require('./how-to-play/how-to-play.component');
var prizes_component_1 = require('./prizes/prizes.component');
var cashback_component_1 = require('./cashback/cashback.component');
var info_component_1 = require('./info/info.component');
var auth_callback_component_1 = require('./auth-callback/auth-callback.component');
var tutorial_component_1 = require('./tutorial/tutorial.component');
var http_1 = require('@angular/common/http');
var ngx_webstorage_service_1 = require('ngx-webstorage-service');
var session_service_1 = require('./session.service');
var returnhome_component_1 = require('./returnhome/returnhome.component');
var history_component_1 = require('./cashback/history/history.component');
var transfer_dialog_component_1 = require('./cashback/transfer-dialog/transfer-dialog.component');
var button_component_1 = require('./components/buttons/button/button.component');
var table_component_1 = require('./components/table/table/table.component');
var settings_component_1 = require('./profile/settings/settings.component');
var subscribe_dialog_component_1 = require('./profile/subscribe-dialog/subscribe-dialog.component');
var input_text_component_1 = require('./components/input/text-input/input-text.component');
var game_component_1 = require('./game/game.component');
var result_component_1 = require('./game/result/result.component');
var countdown_component_1 = require('./components/countdown/countdown.component');
var ng2_phaser_directive_1 = require('./ng2-phaser.directive');
var demogame_component_1 = require('./demogame/demogame.component');
var resultdemo_component_1 = require('./game/resultdemo/resultdemo.component');
var globals_1 = require('./globals');
// import { PhaserModule } from 'phaser-component-library';
//import { NG2_PHASER } from 'ang2-phaser/ng2phaser';
// Import your AvatarModule
// import { AvatarModule } from 'ngx-avatar';
var ngx_gravatar_1 = require('ngx-gravatar');
var ng2_img_max_1 = require('ng2-img-max');
var freetimegame_component_1 = require('./freetimegame/freetimegame.component');
var freetimeresult_component_1 = require('./freetimegame/freetimeresult/freetimeresult.component');
var login_component_1 = require('./login/login.component');
var appRoutes = [
    {
        path: '', component: home_component_1.HomeComponent
    },
    {
        path: 'home', component: home_component_1.HomeComponent
    },
    {
        path: 'returnhome', component: returnhome_component_1.ReturnhomeComponent
    },
    {
        path: 'profile', component: profile_component_1.ProfileComponent
    },
    {
        path: 'settings', component: settings_component_1.SettingsComponent
    },
    {
        path: 'how-to-play', component: how_to_play_component_1.HowToPlayComponent
    },
    {
        path: 'prizes', component: prizes_component_1.PrizesComponent
    },
    {
        path: 'winners', component: winners_component_1.WinnersComponent
    },
    {
        path: 'cashback', component: cashback_component_1.CashbackComponent
    },
    {
        path: 'faq', component: faq_component_1.FaqComponent
    },
    {
        path: 'info', component: info_component_1.InfoComponent
    },
    {
        path: 'tutorial', component: tutorial_component_1.TutorialComponent
    },
    {
        path: 'result', component: result_component_1.ResultComponent
    },
    {
        path: 'resultdemo', component: resultdemo_component_1.ResultdemoComponent
    },
    {
        path: 'resultfreetime', component: freetimeresult_component_1.FreetimeresultComponent
    },
    {
        path: 'game', component: game_component_1.GameComponent
    },
    {
        path: 'demogame', component: demogame_component_1.DemogameComponent
    },
    {
        path: 'freetimegame', component: freetimegame_component_1.FreetimegameComponent
    },
    {
        path: 'auth-callback', component: auth_callback_component_1.AuthCallbackComponent
    },
    {
        path: 'login', component: login_component_1.LoginComponent
    },
    {
        path: 'history', component: history_component_1.HistoryComponent
    }
];
var AppModule = (function () {
    function AppModule() {
    }
    AppModule = __decorate([
        core_1.NgModule({
            declarations: [
                app_component_1.AppComponent,
                header_component_1.HeaderComponent,
                footer_component_1.FooterComponent,
                home_component_1.HomeComponent,
                profile_component_1.ProfileComponent,
                how_to_play_component_1.HowToPlayComponent,
                prizes_component_1.PrizesComponent,
                winners_component_1.WinnersComponent,
                cashback_component_1.CashbackComponent,
                faq_component_1.FaqComponent,
                info_component_1.InfoComponent,
                tutorial_component_1.TutorialComponent,
                auth_callback_component_1.AuthCallbackComponent,
                returnhome_component_1.ReturnhomeComponent,
                history_component_1.HistoryComponent,
                transfer_dialog_component_1.TransferDialogComponent,
                button_component_1.ButtonComponent,
                table_component_1.TableComponent,
                settings_component_1.SettingsComponent,
                input_text_component_1.InputTextComponent,
                subscribe_dialog_component_1.SubscribeDialogComponent,
                game_component_1.GameComponent,
                result_component_1.ResultComponent,
                countdown_component_1.CountdownComponent,
                ng2_phaser_directive_1.Ng2PhaserDirective,
                demogame_component_1.DemogameComponent,
                resultdemo_component_1.ResultdemoComponent,
                freetimegame_component_1.FreetimegameComponent,
                freetimeresult_component_1.FreetimeresultComponent,
                login_component_1.LoginComponent
            ],
            imports: [
                platform_browser_1.BrowserModule,
                router_1.RouterModule.forRoot(appRoutes),
                http_1.HttpClientModule,
                ngx_webstorage_service_1.StorageServiceModule,
                // AvatarModule,
                ngx_gravatar_1.GravatarModule,
                ng2_img_max_1.Ng2ImgMaxModule
            ],
            providers: [
                session_service_1.SessionService,
                globals_1.Globals
            ],
            bootstrap: [app_component_1.AppComponent]
        })
    ], AppModule);
    return AppModule;
}());
exports.AppModule = AppModule;
