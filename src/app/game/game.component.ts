import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Ng2PhaserDirective } from '../ng2-phaser.directive';
import { DataService } from '../data.service';
import { environment } from '../../environments/environment';
import { SessionService } from '../session.service';
import { Globals } from '../globals'
import * as _ from 'lodash';
import { DeviceDetectorService } from 'ngx-device-detector';
import {TranslateService} from '@ngx-translate/core';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html'
})
export class GameComponent implements OnInit {
  
  get tutorialOn(): boolean {
    return this._tutorialOn;
  }
  private _tutorialOn = false;
  
  private _gameInited: Boolean = false;
  private _phaser: any;
  
  constructor(
    private dataService: DataService, 
    private router: Router, 
    private sessionService: SessionService,
    public globals: Globals,
    private translate: TranslateService,
    private deviceService: DeviceDetectorService
    ) {
      this.epicFunction(); 
    }

  public deviceInfo;
  public isDesktopDevice;
  public isMobile;
  public isTablet;
  public isLandscape;
  public startAsLandscape;
  epicFunction() {
      console.log('hello `Home` component');
      this.deviceInfo = this.deviceService.getDeviceInfo();
      const isMobile = this.deviceService.isMobile();
      const isTablet = this.deviceService.isTablet();
      const isDesktopDevice = this.deviceService.isDesktop();
      console.log(this.deviceInfo);
      console.log("This is a Mobile: "+isMobile);  // returns if the device is a mobile device (android / iPhone / windows-phone etc)
      console.log("This is a Tablet: "+isTablet);  // returns if the device us a tablet (iPad etc)
      console.log("This is a Desktop: "+isDesktopDevice); // returns if the app is running on a Desktop browser.
      this.isDesktopDevice = isDesktopDevice;
      this.isMobile = isMobile;
      this.isTablet = isTablet;
      
      // First Check Of orientation
      if(window.innerWidth>window.innerHeight && isMobile || window.innerWidth>window.innerHeight && isTablet)
        this.isLandscape = true;
      else  
        this.isLandscape = false;
    }
  
  onResize(event) {
    // console.log(event);
    // console.log(event.target.innerWidth);
    
    if(event.target.innerWidth>event.target.innerHeight && this.isMobile || event.target.innerWidth>event.target.innerHeight && this.isTablet) {
      console.log("This is Landscape!!!")
      this.isLandscape = true;
    }else  {
      this.startAsLandscape = false;
      this.isLandscape = false;
    }
      
  }

  ngOnInit() {
    
    if(this.isLandscape){
      this.startAsLandscape = true;
    } else{
      this.startAsLandscape = false;
    }
    console.log("Start As Landscape: "+this.startAsLandscape);
    
    // user login validation check
    if (!this.sessionService.token || !this.sessionService.isSubscribed || !this.sessionService.isEligible) {
      // wanna inform the user here?
      
      // Redirect him to Home
      this.router.navigate(['/home'], { queryParams: { errorCode: 401 } });
    }else {
       // TO BE ERASED
      // localStorage.setItem('firstTime','yes');
      
      
      //check if first time and open tutorial
      // var isFirst = localStorage.getItem('firstTime');
      // if(isFirst != "no"){
      //   this.globals.isFirstDemo = true
      //   localStorage.setItem('firstTime','no');
      // }else {
      //   this.globals.isFirstDemo = false;
      // }
      this.globals.isFirstDemo = false;
    }
  }

  get GetWindow(){
    return window;
  }
  
  loadGame(phaser:any){

    let that = this;
    const window = that.dataService.getWindow() as any;
    
    var js = document.getElementById("Phaser") as any;
    if (js) {
      that._gameInited = true;
      that._phaser = window.__phaser;
      that._phaser.api = that.dataService;
      that._phaser._ = _;
      that._phaser.game.type = 'normal';
      that._phaser.environment = environment;
      that._phaser.game.init(phaser.container, this, that.translate.currentLang);
    }
    else {
      js = document.createElement("script");
      js.type = "text/javascript";
      js.id = 'Phaser';
      js.src = 'assets/scripts/PhaserComboGame.min.js';
      document.body.appendChild(js);
      js.onload = function() {
        that._gameInited = true;
        that._phaser = window.__phaser;
        that._phaser.api = that.dataService;
        that._phaser._ = _;
        that._phaser.game.type = 'normal';
        that._phaser.environment = environment;
        that._phaser.game.init(phaser.container, this, that.translate.currentLang);
      }
    }
  }
      
  destroyGame(){
    if (this._phaser !== undefined && this._phaser !== null) {
      this._phaser.destroyGame(function(){
             // do something
            // var js = document.getElementById('Phaser');
            // if (js)
            //   js.parentNode.removeChild(js);
       });
    }
  }
  //---------------

  //---------------
  ngOnDestroy() {
    if (this._gameInited)
      this.destroyGame();
  }     
  
}
