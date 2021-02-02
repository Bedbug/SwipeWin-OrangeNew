import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { throwError, timer } from 'rxjs';
import { environment } from '../environments/environment';
import { SessionService } from './session.service';
import { Router } from '@angular/router';
import { User } from '../models/User';
//import { Location, LocationStrategy, PathLocationStrategy } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  constructor(
    private http: HttpClient, 
    private session: SessionService,
    private router: Router
    ) { 
    }
  
  
  getWindow() {
    return window;
  }
  
  getDocument() {
    return document;
  }


  authenticate(msisdn) {

    if (!this.session.gameSettings || !this.session.gameSettings.maintenance || this.session.gameSettings.maintenance.siteDown || this.session.gameSettings.maintenance.noGames) {
      this.router.navigate(['/home']);
      return throwError('Game is unavailable or under maintenance');
    }
    else {
      const url = encodeURI(`${environment.gameServerDomainUrl}/api/user/signin`);
      const headers = {
        'Accept': 'application/json', 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'
      };
      if (this.session && this.session.token)
        headers['x-access-token'] = this.session.token;

      return this.http.post(url, { msisdn: msisdn }, {
        headers: headers,
        observe: 'response'
      });
    }
  }

  authenticateVerify(msisdn, pin) {

    if (!this.session.gameSettings || !this.session.gameSettings.maintenance || this.session.gameSettings.maintenance.siteDown || this.session.gameSettings.maintenance.noGames) {
      this.router.navigate(['/home']);
      return throwError('Game is unavailable or under maintenance');
    }
    else {
      const url = encodeURI(`${environment.gameServerDomainUrl}/api/user/verify`);
      const headers = {
        'Accept': 'application/json', 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'
      };
      if (this.session && this.session.token)
        headers['x-access-token'] = this.session.token;

      return this.http.post(url, { msisdn: msisdn, pin: pin }, {
        headers: headers,
        observe: 'response'
      });
    }
  }


  requestPin(msisdn) {

    let promise = new Promise((resolve, reject) => {

      if (!this.session.gameSettings || !this.session.gameSettings.maintenance || this.session.gameSettings.maintenance.siteDown || this.session.gameSettings.maintenance.noGames) {
        this.router.navigate(['/home']);
        return reject(new Error('Game is unavailable or under maintenance'));
      }
      else {
        const url = encodeURI(`${environment.gameServerDomainUrl}/api/user/otp`);

        return this.http.post(url, { msisdn: msisdn }, {
          headers: { 'Accept': 'application/json', 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
          observe: 'response'
        }).toPromise();
      }
    });

    return promise;
  }

  authenticateOrangeSSO(msisdnCode) {

    if (!this.session.gameSettings || !this.session.gameSettings.maintenance || this.session.gameSettings.maintenance.siteDown || this.session.gameSettings.maintenance.noGames) {
      this.router.navigate(['/home']);
      return throwError('Game is unavailable or under maintenance');
    }
    else {
      const url = encodeURI(`${environment.gameServerDomainUrl}/api/user/single-signon`);
      const headers = {
        'Accept': 'application/json', 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'
      };

      return this.http.post(url, { msisdnCode: msisdnCode }, {
        headers: headers,
        observe: 'response'
      });
    }
  }


  subscribeOrangeSSO(msisdnCode) {

    if (!this.session.gameSettings || !this.session.gameSettings.maintenance || this.session.gameSettings.maintenance.siteDown || this.session.gameSettings.maintenance.noGames) {
      this.router.navigate(['/home']);
      return throwError('Game is unavailable or under maintenance');
    }
    else {
      const url = encodeURI(`${environment.gameServerDomainUrl}/api/user/subscribe`);
      const headers = {
        'Accept': 'application/json', 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'
      };

      return this.http.post(url, { msisdnCode: msisdnCode }, {
        headers: headers,
        observe: 'response'
      });
    }
  }

    
    
  fetchGameSettings() {
    
    const url = `${environment.gameServerDomainUrl}/api/settings/game`;
      
    return this.http.get(url, {
      headers: { 'Accept': 'application/json', 'Access-Control-Allow-Origin': '*' }
    }).toPromise();
  }
    
    
  getWinners() {
    
    const url = `${environment.gameServerDomainUrl}/api/prize-winners`;
      
    return this.http.get(url, {
      headers: { 'Accept': 'application/json', 'Access-Control-Allow-Origin': '*' }
    }).toPromise();
  }


  getUserProfile() {
    
    const url = `${environment.gameServerDomainUrl}/api/user?d=${new Date().getTime()}`;

    const headers: HttpHeaders = new HttpHeaders({
      'Accept': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'x-access-token': this.session.token
    });

    const options = {
      headers: headers
    };
      
    return this.http.get(url, options);
  }
  
  
  saveUserProfile(newProfileObject) {
    
    let promise = new Promise((resolve, reject) => {
      
      if (!this.session || !this.session.token)
        return reject(new Error('Invalid user data to update'));
        
      const url = `${environment.gameServerDomainUrl}/api/user`;
      const objectToSave = newProfileObject; //this.session.user.toProfileDTO();
        
      return this.http.put(url, objectToSave, {
        headers: { 
          'Accept': 'application/json', 
          'Access-Control-Allow-Origin': '*', 
          'x-access-token': this.session.token,
          'Content-Type': 'application/json', 
          },
        observe: 'response'
      }).toPromise().then( 
        res => {
          const token = res.headers.get('x-access-token');
          if (token)
            this.session.token = token;
          
          const body:any = res.body;
          resolve(body);
        },
        err => {
          reject(err);
        });
    });
    
    return promise;
  }
  

  purchaseCreditRequest = function () {

    const url = `${environment.gameServerDomainUrl}/api/user/credit`;

    return this.http.post(url,
      { },
      {
        headers: {
          'Accept': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'x-access-token': this.session.token
        }
      });
  }

  purchaseCredit = function (pin) {

    const url = `${environment.gameServerDomainUrl}/api/user/credit`;

    return this.http.put(url,
      { pin: pin },
      {
        headers: {
          'Accept': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'x-access-token': this.session.token
        }, observe: 'response'
      });
  }


  transferCashback() {
    
    let promise = new Promise((resolve, reject) => {
      
      if (!this.session || !this.session.token)
        return reject(new Error('Invalid user data to update'));
        
      const url = `${environment.gameServerDomainUrl}/api/user/cashback`;
      const objectToSave = {};
        
      return this.http.post(url, objectToSave, {
        headers: { 
          'Accept': 'application/json', 
          'Access-Control-Allow-Origin': '*', 
          'x-access-token': this.session.token,
          'Content-Type': 'application/json', 
          },
        observe: 'response'
      }).toPromise().then( 
        res => {
          const token = res.headers.get('x-access-token');
          if (token)
            this.session.token = token;
          
          const body:any = res.body;
          resolve(body);
        },
        err => {
          reject(err);
        });
    });
    
    return promise;
  }
  
  
  unsubscribe() {
    
    let promise = new Promise((resolve, reject) => {
      
      if (!this.session || !this.session.token)
        return reject(new Error('Invalid user data to update'));
        
      const url = `${environment.gameServerDomainUrl}/api/user`;

      return this.http.delete(url, {
        headers: { 
          'Accept': 'application/json', 
          'Access-Control-Allow-Origin': '*', 
          'x-access-token': this.session.token
          },
        observe: 'response'
      }).toPromise().then( 
        res => {
          const token = res.headers.get('x-access-token');
          if (token)
            this.session.token = token;
          
          const body:any = res.body;
          resolve(body);
        },
        err => {
          reject(err);
        });
    });
    
    return promise;
  }
  
    
  // A call to create a new session for the user and prefetch a bunch of session questions (no answers)
  // How to work with Promises with Angular HttpClient: https://codecraft.tv/courses/angular/http/http-with-promises/
  createSession(gameType) {
      
    let promise = new Promise((resolve, reject) => {
      gameType = gameType || 'demo';
      
      const url = `${environment.gameServerDomainUrl}/api/${gameType === 'normal' ? '' : (gameType === 'demo' ? 'demo-' : 'timefree-')}session/swipewin`;
  
      return this.http.post(url, { }, {
        headers: { 
          'Accept': 'application/json', 
          'Content-Type': 'application/json', 
          'x-access-token': this.session.token || (new Date).getTime().toString(),
          'Access-Control-Allow-Origin': '*'
          },
        observe: 'response'
      }).toPromise().then(
        res => { // Success
        
          const token = res.headers.get('x-access-token');
          if (token)
            this.session.token = token;
          
          const body:any = res.body;

          // Get the new session's id and keep it
          this.session.currentSessionId = body.ticket.id;

          resolve(body);
        },
        err => { // Error
          const status: number = err.status;
          
          if (err.error && err.error.errorCode) 
            this.router.navigate(['home'], { queryParams: { errorCode: err.error.errorCode } })
            
          reject(err);
        }
      );
    });
    
    return promise;
  }
    
    
  // A call to register the user answer of a question to the server 
  answerQuestion(questionId, answer, gameType) {
    
    let promise = new Promise((resolve, reject) => {
      gameType = gameType || 'demo';
  
      const url = `${environment.gameServerDomainUrl}/api/${gameType === 'normal' ? '' : (gameType === 'demo' ? 'demo-' : 'timefree-')}session/swipewin/${this.session.currentSessionId}`;
      
      const body = {
                sessionId: this.session.currentSessionId,
                questionId: questionId,
                userAnswer: answer.toString()
            };
  
      return this.http.post(url, body, {
        headers: { 
          'Accept': 'application/json', 
          'Content-Type': 'application/json', 
          'x-access-token': this.session.token || (new Date).getTime().toString(),
          'Access-Control-Allow-Origin': '*'
          },
        observe: 'response'
      }).toPromise().then(
        res => { // Success
        
          const token = res.headers.get('x-access-token');
          if (token)
            this.session.token = token;
          
          // Deserialize payload
          const body:any = res.body; // JSON.parse(response);
          
          // Detect the session termination, in this case wait for 1 sec for the end cards animation
          if (body.sessionResult) {
            this.session.lastGameResults = body.sessionResult;
            this.session.Serialize();
            timer(1000).subscribe(() => gameType === 'normal' ? this.router.navigate(['result']) : gameType === 'demo' ? this.router.navigate(['resultdemo']) : this.router.navigate(['resultfreetime']));
          }

          resolve(body);
        },
        err => { // Error
          const status: number = err.status;
          
          if (err.error && err.error.errorCode) 
            this.router.navigate(['home'], { queryParams: { errorCode: err.error.errorCode } })
            
          reject(err);
        }
      );
    });
    
    return promise;
  }
  
}
