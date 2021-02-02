import { Component, OnInit } from '@angular/core';
import { DataService } from '../data.service';
import { SessionService } from '../session.service';
import { Router } from '@angular/router';
import { User } from '../../models/User';
import UIkit from 'uikit';

@Component({
  selector: 'app-returnhome',
  templateUrl: './returnhome.component.html',
  styleUrls: ['./returnhome.component.scss']
})

export class ReturnhomeComponent implements OnInit {
  credits: number;
  loggedin: boolean = true;
  openVerify: true;
  lblShow:boolean = true;
  passType: string = "password";
  verErrorMes: boolean = false;

  get hasCashback(): number {
    return this._cashBackAmount;
  }
  get isSubscribed(): boolean {
    return this._isSubscribed;
  }
  
  get isChecked(): boolean {
    return this._isChecked;
  }
  
  get gamesPlayed(): number {
    return this._gamesPlayed;
  }
  
  // Check if already a subscribed player
  private _isSubscribed = false;
  // Check if he has cashback waiting
  public _cashBackAmount = 0;
  // Check if check is checked so he can click the button
  private _isChecked = false;
  // How many (1st free or billable) games the user has played
  public _gamesPlayed = 0;

  public errorMsg = "";
  public noMoreRealGames = "Unfortunately, your current plan is not allowed to participate.\nTry using another number.";
  public noMoreDemoGames = "No more demo games available! \n Why don't you try the real thing?";

  checkCheckBoxvalue(event){
   //console.log(event.target.checked);
    this._isChecked = event.target.checked;
  }
  
  GoSubscribe() {
    
  }

  startGame() {
   //console.log("Games Played: "+ this.gamesPlayed);
    // if(this._gamesPlayed >= 3) {
    //   // popup modal with error
    //   var modal = UIkit.modal("#error");
    //   this.errorMsg = this.noMoreRealGames;
    //   modal.show();
      
    // }else{
     //console.log("Play Main Game!");
      this.sessionService.gamesPlayed++;
      this.sessionService.credits--;
      
     //console.log("this.sessionService.credits: "+this.sessionService.credits);
      this.router.navigate(['game']);
      // this.router.navigate(['freetimegame']);
      //this.router.navigate(['demogame']);
    // }
  }
  
  startFreeGame() {
    this.router.navigate(['freetimegame']);
  }

  constructor(private dataService: DataService, private sessionService: SessionService, private router: Router) { }

  ngOnInit() {

    // user login validation check
    if (!this.sessionService.token || !this.sessionService.isSubscribed || !this.sessionService.isEligible) {
      // wanna inform the user here?
      
      // Redirect him to Home
      this.router.navigate(['/home'], { queryParams: { errorCode: 401 } });
    }
    else if (!this.sessionService.isEligible) {
      this.router.navigate(['/home'], { queryParams: { errorCode: 1026 } });
    }
    else {
      
      this._isSubscribed = this.sessionService.isSubscribed;
     //console.log(this.sessionService.msisdn);
     //console.log("this.session "+this.sessionService.token);
      // this._cashBackAmount = this.sessionService._cashBackAmount;
      // this._cashBackAmount = 500;
      
     //console.log( "Has Credit: " + this.sessionService.hasCredit() );
     //console.log( "Played Games: " + this.sessionService.gamesPlayed );
      // TOBE ERASED
      // This resets the games played every time
      
      
      this.dataService.getUserProfile().subscribe( 
        (data: any) => {

          // console.log("response.body "+response.body);
          // const data:User = response.body;
         //console.log("data "+ data);
          this.sessionService.user = data;
          this._gamesPlayed = this.sessionService.gamesPlayed;

         //console.log("this.sessionService.user "+this.sessionService.user);
          
         //console.log("this._gamesPlayed "+this._gamesPlayed);
         //console.log("this.sessionService.gamesPlayed "+this.sessionService.gamesPlayed);

          this.CheckCredits();
          // Set Properties here
          // this._gamesPlayed = 3;
          // this._cashBackAmount = this.sessionService.user.wallet.pendingMaturityCashback + this.sessionService.user.wallet.pendingTransferCashback;
        },
        (err) => {
          
        }
        
      );
    }
  }

  CheckCredits() {
   //console.log("Checking Credits!");
    
      this.sessionService.hasCredit();
    
  }

  OpenOTPPurchase() {
   //console.log("Open OTP Modal!");
    // Start OTP proccess for new game purchace
    // Send PIN
    // Verify user Input
    // If success purchaceCredit
    this.dataService.purchaseCreditRequest().subscribe((resp: any) => {

      // Open Modal
      let modal = UIkit.modal("#otp");
      modal.show();
    },
      (err: any) => {
       //console.log("Error with Sending purchase Pin!!!");
        let modal = UIkit.modal("#error");
        modal.show();
      });
  }

  
  OpenPass(){
    this.lblShow = !this.lblShow;
   //console.log("Hide/Show Password: " + this.lblShow);
    if(this.lblShow)
      this.passType = "password";
    else
      this.passType = "test";
  }

  verify(pass: string) {

    this.dataService.purchaseCredit(pass).subscribe((resp: any) => {

      // Get JWT token from response header and keep it for the session
      const userToken = resp.headers.get('x-access-token');
      if (userToken)  // if exists, keep it
        this.sessionService.token = userToken;

     // Close the modal if pin & purchase are success
      let modal = UIkit.modal("#otp");
      modal.hide();
    
      // Deserialize payload
      const body: any = resp.body; // JSON.parse(response);
         
      if (body.credits > 0)
        this.sessionService.credits = body.credits;
      
     //console.log("hasCredit: " +body.credits+" "+ this.sessionService.hasCredit());
    
      this.sessionService.user = body;
      this._gamesPlayed = this.sessionService.gamesPlayed;
     //console.table(body);
        
      if (this.sessionService.credits > 0) {
        // Burn Credit
            this.startGame();
      }      
    },
      (err: any) => {
        // If Purchase is not Success Open Error Modal and close OTP modal (Then return to home) 
       //console.log("Error With Purchase!!!", err);

        if (err.error) {
          const errorCode = err.error.errorCode;

          if (errorCode === 1007) {
            // pin verification problem, pin invalid or wrong
           //console.log("Error With Pin!!!");
            // If PIN is incorect show a text error
            this.verErrorMes = true;
          }
          else if (errorCode === 1004) {
            // user is not eligible to buy credits
          }
          else {
            // transaction could not be completed by the system, system error
            let modal = UIkit.modal("#error");
            modal.show();
          }
        } else {
          let modal = UIkit.modal("#error");
          modal.show();
        }

      });
  }
  
  resetPin() {
   //console.log("Reset PIN!");
  }
  returnHome() {
    this.router.navigate(['returnhome']);
  }
}
