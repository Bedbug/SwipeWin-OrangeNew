import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { Routes, RouterModule } from '@angular/router';

import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
// import { environment } from 'src/environments/environment';
import { HomeComponent } from './home/home.component';
import { WinnersComponent } from './winners/winners.component';
import { FaqComponent } from './faq/faq.component';
import { ProfileComponent } from './profile/profile.component';
import { HowToPlayComponent } from './how-to-play/how-to-play.component';
import { PrizesComponent } from './prizes/prizes.component';
import { CashbackComponent } from './cashback/cashback.component';

import { InfoComponent } from './info/info.component';
import { AuthCallbackComponent } from './auth-callback/auth-callback.component';
import { TutorialComponent } from './tutorial/tutorial.component';

import { HttpClientModule } from '@angular/common/http';
import { StorageServiceModule } from 'ngx-webstorage-service';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { SessionService } from './session.service';
import { ReturnhomeComponent } from './returnhome/returnhome.component';
import { HistoryComponent } from './cashback/history/history.component';
import { TransferDialogComponent } from './cashback/transfer-dialog/transfer-dialog.component';
import { ButtonComponent } from './components/buttons/button/button.component';
import { TableComponent } from './components/table/table/table.component';
import { SettingsComponent } from './profile/settings/settings.component';
import { SubscribeDialogComponent } from './profile/subscribe-dialog/subscribe-dialog.component';
import { InputTextComponent } from './components/input/text-input/input-text.component';
import { GameComponent } from './game/game.component';
import { ResultComponent } from './game/result/result.component';
import { CountdownComponent } from './components/countdown/countdown.component';
import { Ng2PhaserDirective } from './ng2-phaser.directive';
import { DemogameComponent } from './demogame/demogame.component';
import { ResultdemoComponent } from './game/resultdemo/resultdemo.component';
import { MsisdnEnrichmentDetector } from './interceptors/msisdn-enrichment-detector';
import { Globals } from './globals';
// import { LottieAnimationViewModule } from 'ng-lottie';
// import { PhaserModule } from 'phaser-component-library';
//import { NG2_PHASER } from 'ang2-phaser/ng2phaser';
// Import your AvatarModule
// import { AvatarModule } from 'ngx-avatar';
import { GravatarModule } from  'ngx-gravatar';
import { Ng2ImgMaxModule } from 'ng2-img-max';
import { FreetimegameComponent } from './freetimegame/freetimegame.component';
import { FreetimeresultComponent } from './freetimegame/freetimeresult/freetimeresult.component';
import { LoginComponent } from './login/login.component';
import { CookieService } from 'ngx-cookie-service';
import { DeviceDetectorModule } from 'ngx-device-detector';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';

// Translate

import { HttpClient} from '@angular/common/http';
import {TranslateModule, TranslateLoader} from '@ngx-translate/core';
import {TranslateHttpLoader} from '@ngx-translate/http-loader';


// AoT requires an exported function for factories
export function HttpLoaderFactory(http: HttpClient) {
    return new TranslateHttpLoader(http);
}

const appRoutes: Routes = [
{
path: '', component: HomeComponent
},
{
path: 'home', component: HomeComponent
},
{
path: 'returnhome', component: ReturnhomeComponent
},
{
path: 'profile', component: ProfileComponent
},
{
path: 'settings', component: SettingsComponent
},
{
path: 'how-to-play', component: HowToPlayComponent
},
{
path: 'prizes', component: PrizesComponent
},
{
path: 'winners', component: WinnersComponent
},
{
path: 'cashback', component: CashbackComponent
},
{
path: 'faq', component: FaqComponent
},
{
path: 'info', component: InfoComponent
},
{
path: 'tutorial', component: TutorialComponent
},
{
path: 'result', component: ResultComponent
},
{
path: 'resultdemo', component: ResultdemoComponent
},
{
path: 'resultfreetime', component: FreetimeresultComponent
},
{
path: 'game', component: GameComponent
},
{
path: 'demogame', component: DemogameComponent
},
{
path: 'freetimegame', component: FreetimegameComponent
},
{
path: 'auth-callback', component: AuthCallbackComponent
},
{
path: 'login', component: LoginComponent
},
{
path: 'history', component: HistoryComponent
}

];

@NgModule({
    declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    HomeComponent,
    ProfileComponent,
    HowToPlayComponent,
    PrizesComponent,
    WinnersComponent,
    CashbackComponent,
    FaqComponent,
    InfoComponent,
    TutorialComponent,
    AuthCallbackComponent,
    ReturnhomeComponent,
    HistoryComponent,
    TransferDialogComponent,
    ButtonComponent,
    TableComponent,
    SettingsComponent,
    InputTextComponent,
    SubscribeDialogComponent,
    GameComponent,
    ResultComponent,
    CountdownComponent,
    Ng2PhaserDirective,
    DemogameComponent,
    ResultdemoComponent,
    FreetimegameComponent,
    FreetimeresultComponent,
    LoginComponent
    
],
imports: [
    BrowserModule,
    TranslateModule.forRoot({
        loader: {
            provide: TranslateLoader,
            useFactory: HttpLoaderFactory,
            deps: [HttpClient]
        }
    }),
    RouterModule.forRoot(appRoutes),
    HttpClientModule,
    StorageServiceModule,
    // AvatarModule,
    GravatarModule,
    Ng2ImgMaxModule,
    DeviceDetectorModule.forRoot(),
    // LottieAnimationViewModule.forRoot(),
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production })
],
providers: [
    SessionService,
    Globals,
    CookieService,
    // { provide: HTTP_INTERCEPTORS, useClass: MsisdnEnrichmentDetector, multi: true }
],
bootstrap: [AppComponent]
})
export class AppModule { }
