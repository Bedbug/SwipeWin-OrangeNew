import {Component, Input, Output, EventEmitter, ElementRef} from '@angular/core';
import { Directive } from '@angular/core';
//import { phaser } from 'phaser';



@Directive({
  selector: 'phaser'
  //directives: [Directive]
})
export class Ng2PhaserDirective {

  public selfRef:any;
  private _phaser: any;

  @Output() phaser = new EventEmitter();
  @Input() settings:any;

  constructor(private el: ElementRef) { 
    this.selfRef = el.nativeElement;
  }


  ngOnInit(){
    var t = this;
    // var alreadyLoaded = false;
    // var allScripts = document.getElementsByTagName("script");

    if(t.settings == undefined){
      t.settings = {
        file: 'assets/scripts/phaser.min.js'
      }
    }
    
    var js = document.getElementById("PhaserLib") as any;
    
    if (!js) {
        js = document.createElement("script");
        js.type = "text/javascript";
        js.src = t.settings.file;
        js.id = 'PhaserLib';
        document.body.appendChild(js);
        js.onload = function(){
            t.phaser.emit({firstLoad: true, container: t.selfRef});
        }
    }
    else
      t.phaser.emit({firstLoad: false, container: t.selfRef});

  }
  //--------------

  //--------------
  initPhaser(){
    this.phaser.emit({container: this.selfRef})
  }
}
