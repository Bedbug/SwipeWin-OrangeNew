import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Ng2PhaserDirective } from '../ng2-phaser.directive';
import { DataService } from '../data.service';
import { environment } from '../../environments/environment';
import { SessionService } from '../session.service';
import * as _ from 'lodash';
import { DeviceDetectorService } from 'ngx-device-detector';


@Component({
  selector: 'app-freetimegame',
  templateUrl: './freetimegame.component.html',
  styleUrls: ['./freetimegame.component.scss']
})
export class FreetimegameComponent implements OnInit {
  
  private _gameInited: Boolean = false;
  private _phaser: any;


  constructor(
    private dataService: DataService, 
    private router: Router, 
    private sessionService: SessionService,
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
    }
  }

  loadGame(phaser:any){

    let that = this;
    let document = this.dataService.getDocument() as any;
    const window = that.dataService.getWindow() as any;
    
    var js = document.getElementById("Phaser");
    if (!js) {

      js = document.createElement("script");
      js.type = "text/javascript";
      js.id = 'Phaser';
      js.src = 'assets/scripts/PhaserComboGame.min.js';
      // js.src = 'assets/scripts/PhaserComboGame.js';
      document.body.appendChild(js);
      js.onload = function(){
        that._gameInited = true;
        that._phaser = window.__phaser;
        that._phaser.api = that.dataService;
        that._phaser._ = _;
        that._phaser.game.type = 'timefree';
        that._phaser.environment = environment;
        that._phaser.game.init(phaser.container, this);
      }
      js.onerror = function(err) {
       console.error(err);
      }
    }
    else {
        that._gameInited = true;
        this._phaser = window.__phaser;
        this._phaser.api = that.dataService;
        this._phaser._ = _;
        this._phaser.game.type = 'timefree';
        this._phaser.environment = environment;
        this._phaser.game.init(phaser.container, this);
    }
  }
      
  destroyGame(){
    if (this._phaser !== undefined && this._phaser !== null) {
      this._phaser.destroyGame(function(){
             // do something
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
