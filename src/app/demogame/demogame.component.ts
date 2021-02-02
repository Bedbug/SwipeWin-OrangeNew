import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Ng2PhaserDirective } from '../ng2-phaser.directive';
import { DataService } from '../data.service';
import { SessionService } from '../session.service';
import { environment } from '../../environments/environment';
import { Globals } from '../globals'
import * as _ from 'lodash';
import { DeviceDetectorService } from 'ngx-device-detector';

//declare var __phaser:any;



@Component({
  selector: 'app-demogame',
  templateUrl: './demogame.component.html',
  styleUrls: ['./demogame.component.scss']
})
export class DemogameComponent implements OnInit {

  // get tutorialOn(): boolean {
  //   return this._tutorialOn;
  // }
  // private _tutorialOn = false;
  private _phaser: any;

  constructor(
    private dataService: DataService, 
    private router: Router,
    private sessionService: SessionService,
    public globals: Globals,
    private deviceService: DeviceDetectorService
    ) {
      this.epicFunction();
    // this.globals.isFirstDemo.subscribe((value) => {
    //         this._tutorialOn = value
    //     });
    // this._tutorialOn = globals.isFirstDemo;
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
    // TO BE ERASED
    // localStorage.setItem('firstTime','yes');
    if (!this.sessionService.gameSettings || !this.sessionService.gameSettings.maintenance || this.sessionService.gameSettings.maintenance.siteDown || this.sessionService.gameSettings.maintenance.noGames)
      this.router.navigate(['/home']);
    else {
    
      if(this.isLandscape){
        this.startAsLandscape = true;
      } else{
        this.startAsLandscape = false;
      }
      console.log("Start As Landscape: "+this.startAsLandscape);
      
      
      //check if first time and open tutorial
      var isFirst = localStorage.getItem('firstTime');
      if (isFirst != "no") {
        this.globals.isFirstDemo = true
        localStorage.setItem('firstTime','no');
      } else {
        this.globals.isFirstDemo = false;
      }
    }
  }
  
  loadDemo(phaser:any){
    var that = this;
    
    console.log("Loading Game!!!"); 
    
    
    const window = that.dataService.getWindow() as any;
    
    var js = document.getElementById("Phaser") as any;
    if (!js) {
     js = document.createElement("script");
     js.type = "text/javascript";
     js.id = 'Phaser';
      js.src = 'assets/scripts/PhaserComboGame.min.js';
      // js.src = 'assets/scripts/PhaserComboGame.js';
     document.body.appendChild(js);
     js.onload = function() {
       
        that._phaser = window.__phaser;
        that._phaser.api = that.dataService;
        that._phaser._ = _;
        that._phaser.environment = environment;
        that._phaser.game.type = 'demo';
        that._phaser.game.init(phaser.container, this);
     }
    }
    else {
      
        this._phaser = window.__phaser;
        this._phaser.api = this.dataService;
        this._phaser._ = _;
        this._phaser.environment = environment;
        this._phaser.game.type = 'demo';
        this._phaser.game.init(phaser.container, this);
      
    }
  }
      
  destroyGame(){
    if (this._phaser)
     this._phaser.destroyGame(function(){
           // do something
     });
  }
  //---------------

  //---------------
  ngOnDestroy() {
    this.destroyGame();
  }      
}
