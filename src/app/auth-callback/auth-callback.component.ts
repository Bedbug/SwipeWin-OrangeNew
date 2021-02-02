import { Component, OnInit } from '@angular/core';
import { DefaultUrlSerializer, Router } from '@angular/router';
import { Location, LocationStrategy, PathLocationStrategy } from '@angular/common';
import { UrlTree } from '@angular/router';
import { DataService } from '../data.service';
import { SessionService } from '../session.service';

@Component({
  selector: 'app-auth-callback',
  templateUrl: './auth-callback.component.html',
  styleUrls: ['./auth-callback.component.scss'],
  providers: [Location, { provide: LocationStrategy, useClass: PathLocationStrategy }]
})
export class AuthCallbackComponent implements OnInit {

  constructor(
    private location: Location, 
    private dataService: DataService,
    private sessionService: SessionService,
    private router: Router) { }

  ngOnInit() {
    var urlSer= new DefaultUrlSerializer();
    console.log('incoming path: ' + this.location.path());
    var urlTree: UrlTree = urlSer.parse(this.location.path());
    
    //const urlParams = new URLSearchParams(window.location.href);
    const state = urlTree.queryParams['state'];
    const code = urlTree.queryParams['code'];
    const error = urlTree.queryParams['error'];
    const that = this;

    /*
    this.dataService.authenticateUserToken(code).subscribe(
        data => {
            const msisdn = '7' + data['mobile:phone'];
            this.sessionService.msisdn = msisdn;
            this.sessionService.mtsToken = data['accessToken'];
            this.sessionService.Serialize();
            
            this.checkUserSubscription();
        },
        err => {
          console.log("This");
            that.router.navigate(['/home'], { queryParams: { errorCode: 1010 } });
        }
    );
    */
    
    switch (code) {
      case "6970000001":
        this.sessionService.msisdn = "6970000001";
        break;
      case "6970000002":
        this.sessionService.msisdn = "6970000002";
        break;
      case "6970000003":
        this.sessionService.msisdn = "6970000003";
        break;
      case "6970000004":
        this.sessionService.msisdn = "6970000004";
        break;
      case "6970000005":
        this.sessionService.msisdn = "6970000005";
        break;
      case "6970000006":
        this.sessionService.msisdn = "6970000006";
        break;
      case "6970000007":
        this.sessionService.msisdn = "6970000007";
        break;
      case "6970000008":
        this.sessionService.msisdn = "6970000008";
        break;
      case "6970000009":
        this.sessionService.msisdn = "6970000009";
        break;
    }
    this.sessionService.Serialize();
    this.checkUserSubscription();
  }
  
  checkUserSubscription() {
    /*
     * Obsolete in this project
     * 
    this.dataService.authorizeUser().subscribe( resp => {
    
      // Get JWT token from response header and keep it for the session
      const userToken = resp.headers.get('X-Access-Token');
      if (userToken)  // if exists, keep it
          this.sessionService.token = userToken;
          
      // Deserialize payload
      const body:any = resp.body; // JSON.parse(response);
      if (body.isEligible !== undefined)
          this.sessionService.isEligible = body.isEligible;
      if (body.isSubscribed != undefined)
          this.sessionService.isSubscribed = body.isSubscribed;
      if (body.gamesPlayedToday !== undefined)
          this.sessionService.gamesPlayed = body.gamesPlayedToday;
      this.sessionService.Serialize();

      // Goto the returnHome page
      this.router.navigate(['/returnhome']);
    },
    err => {
      this.router.navigate(['/home'], { queryParams: { errorCode: 1010 } });
    });
    */
  }

}
