import { Inject, Injectable, OnDestroy } from '@angular/core';

// Optimizing lodash importing for just the methods we need: https://medium.com/@armno/til-importing-lodash-into-angular-the-better-way-aacbeaa40473
import { assign } from 'lodash/assign';
import { pick } from 'lodash/pick';

// Mechanism for detecting page refreshes
// This comes from a catch-refresh example at https://stackblitz.com/edit/angular-r6-detect-browser-refresh?file=src%2Fmain.ts 
import { NavigationStart, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { User } from '../models/User';

// Local and Session storage provider, see: https://medium.com/@tiagovalverde/how-to-save-your-app-state-in-localstorage-with-angular-ce3f49362e31
import { SESSION_STORAGE, LOCAL_STORAGE, StorageService } from 'ngx-webstorage-service';

@Injectable({
  providedIn: 'root'
})
export class SessionService implements OnDestroy {
  
  mtsToken: string = null;
  
  user: User = null;

  // A crypto-signed MSISDN code that should be incuded in the request header (header enrichment) if the user is connected through a mobile network
  msisdnCode: string = null;
  
  // the main user identification property, the user's mobile number. 
  // If present, this signifies that the user has already logged in through MyMTS WebSSO login page
  //msisdn: null,
  msisdn: string = null;    // hard-coded here for testing by circumventing the WebSSO MyMTS Russian OAuth Service
  
  // The JWT token received by the game server, after user (Open Auth) authentication
  // If present, this signifies that the user has already signed in the game server
  token: string = null;
  
  // The game settings object as fetched from the server
  gameSettings: any = {};
  
  // date of reference, defaults to the current date
  today: Date = new Date();
  
  // tells whether the user has ever subscribed to the service
  isSubscribed: boolean = false;
  
  // tells how many credits the user has
  credits: number = 0;
  
  // tells whether the user has enough credit to buy a game
  hasCredit(): boolean { return this.credits > 0; }

  // tells whether the user has enough financial balance to buy the game
  hasBalance: boolean = false;
  
  // tells whether the user is eligible to play the game
  isEligible: boolean = false;
  
  // how many games the user has played today
  gamesPlayed: number = 0;
  
  // how many Demo games the user has played today
  demoGamesPlayed: number = 0;
  
  // whether the user has won any cashback on the last demo game they played
  demoGameCashbackWon: boolean = false;
  
  // what is the user's total points
  points: number = 0;
  
  // the id of the current (demo) game session, if any
  currentSessionId: string = null;
  
  // mtsToken: boolean = true;
  lastGameResults: any = null;
  
  
  subscription: Subscription;



  // injects StorageServiceModule. For its API, see: https://www.npmjs.com/package/ngx-webstorage-service
  constructor(
    @Inject(SESSION_STORAGE) private storage: StorageService,
    @Inject(LOCAL_STORAGE) private localStorage: StorageService,
    private router: Router
    ) { 
      this.subscription = router.events.subscribe((event) => {
          if (event instanceof NavigationStart && event.url.substring(0, 14) === '/auth-callback') {
            this.reset();
          }
      });
    }
  
    // a method to properly check and advance the number of demo games played on the same date (current day)
  playDemoGame() {
      const now = new Date();
      if (SessionService.GetDateIntoMoscowTimezone(this.today) == SessionService.GetDateIntoMoscowTimezone(now)) {
          this.demoGamesPlayed++ ;
      } else {
          this.demoGamesPlayed = 1;
          this.today = now;
      }
      
      //this.Serialize();
  }
  
  static GetDateIntoMoscowTimezone(date) {
      // Moscow timezone is +3:00 from +0:00 (UTC)
      return Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(), 3, 0, 0);
  }
  
  reset() {
    this.token = null;
    this.msisdn = null;
    this.today = null;
    this.mtsToken = null;
    this.user = null;
    this.isSubscribed = false;
    
    this.storage.remove("user");
  }
  
  // a method to serialize the user object in Local Storage
  Serialize() {

      //const userObject = pick(this, ['msisdn', 'token', 'today', 'demoGamesPlayed', 'demoGameCashbackWon']);  // only these properties of userObject are saved
      const userObject = {
        msisdn: this.msisdn,
        token: this.token,
        today: this.today,
        demoGameCashbackWon: this.demoGameCashbackWon,
        demoGamesPlayed: this.demoGamesPlayed
      };
      
      this.storage.set('user', userObject);
  }
  
  // a method to deserialize the user object from Local Storage
  Deserialize() {
      //const localStorage = window['localStorage'];
      const userObject = this.storage.get('user');
      if (userObject) {
          // Convert today from string to Date object
          if (userObject && userObject.today) {
              userObject.today = new Date(userObject.today);
              
              // Check validity and invalidate if necessary
              const now = new Date();
              if (SessionService.GetDateIntoMoscowTimezone(now) !== SessionService.GetDateIntoMoscowTimezone(userObject.today)) {
                  // userObject.demoGamesPlayed = 0; // count of demo games should not reset on new day start
                  userObject.today = now;
              }
          }
          
          // Copy userObject property values back to User object
          assign(this, userObject);
      }
  }
  
  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

}
