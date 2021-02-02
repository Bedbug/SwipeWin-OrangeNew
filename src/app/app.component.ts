import { Component } from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import { ActivatedRoute } from "@angular/router";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'swipr';
  lang: string;
  constructor(public translate: TranslateService, private activatedRoute: ActivatedRoute) {
    translate.addLangs(['ar', 'en']);
    translate.setDefaultLang('ar');

    const browserLang = translate.getBrowserLang();
    translate.use(browserLang.match(/ar|er/) ? browserLang : 'ar');

    this.activatedRoute.queryParams.subscribe(params => {
      // console.table(params);
      this.lang = params["lang"];
      if(this.lang != null)
      this.translate.setDefaultLang(this.lang);
      
      console.log("Language Selected: "+this.lang);
    })
  }
}
