import { Component, OnInit } from '@angular/core';
// import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { SessionService } from '../session.service';
import { Router } from '@angular/router';
import {TranslateService} from '@ngx-translate/core';

declare const UIkit: any;

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  url: string;
  pushed = false;
  alignAllLeft = true;

  public mobileMenuState = false;
  public menuIconPath = 'menu';

  constructor(private session: SessionService, private router: Router,public translate: TranslateService) 
  {
    // this.url = router.url;
  }

  ngOnInit() {
    // Checking Lang
    if(this.translate.currentLang == "ar") {
      this.alignAllLeft = false;
    } else {
      this.alignAllLeft = true;
    }
    let offcanvas = UIkit.offcanvas("#offcanvas-nav");
    console.log(offcanvas);
    offcanvas.$props.flip =  this.alignAllLeft;


    const that = this;
    UIkit.util.on('#offcanvas-nav', 'hide', function (e) {
      // do something
      const currentClass = this
                            .parentElement
                            .getElementsByClassName('hamburger-menu')[0]
                            .children[0]
                            .className;

      if (currentClass.includes('pushed')) {
        that.toggleClass();
      }
    });

  }

  public toggleClass() {
    console.log("Toggleing!!!");
    this.pushed = !this.pushed;
  }

  public changeMenuState(event) {
    this.mobileMenuState = !this.mobileMenuState;
    console.log(this.mobileMenuState);
    if (this.menuIconPath === 'menu') {
      this.menuIconPath = 'close';
    } else {
      this.menuIconPath = 'menu';
    }
  }
  closeOffcanvas() {
    UIkit.offcanvas('#offcanvas-nav').hide();
  }
  
  gotoProfile(){
    this.router.navigate(['/profile']);
  }
  
   gotoHome() {
     if (!this.session.token) {
      // Redirect him to Home
      this.router.navigate(['/home']);
      } else {
        this.router.navigate(['/returnhome']);
      }
   }

   changeLanguage() {
     this.alignAllLeft = !this.alignAllLeft;
     let offcanvas = UIkit.offcanvas("#offcanvas-nav");
     offcanvas.flip =  this.alignAllLeft;
     console.log( offcanvas);
    //  const browserLang = this.translate.getBrowserLang();
    //  console.log(browserLang);
    //  this.translate.use(browserLang.match(/en|ar/) ? browserLang : 'en');
    if(this.alignAllLeft)
      this.translate.use("en");
      else
      this.translate.use("ar");
   }

}
