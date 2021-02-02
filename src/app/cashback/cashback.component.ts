import { Component, OnInit } from '@angular/core';
import { DataService } from '../data.service';
import { SessionService } from '../session.service';
import { Router } from '@angular/router';
import { User } from '../../models/User';
import UIkit from 'uikit';

const VIEW_STATES = {
  KASHBACK: 'SHOW_KASHBACK',
  HISTORY: 'SHOW_HISTORY',
};

@Component({
  selector: 'app-cashback',
  templateUrl: './cashback.component.html',
  styleUrls: ['./cashback.component.scss']
})
export class CashbackComponent implements OnInit {

  // Get Info From Server and Add to balance
  // If more than 0 button will be available and sum available to transfer
  //

  private state = VIEW_STATES.KASHBACK;
  private isOpenDialog = false;
  public amountPending = 0;
  public hoursRemain = 0;
  public balance = 0;
  public message = 'Будут доступны через ХХ часов';
  public error = false;
  
  public errorMsg = "";
  // public showHistory = () => this.state = VIEW_STATES.HISTORY;

  public isHistoryShowable = () => this.state === VIEW_STATES.HISTORY;

  public transferToAccount = () => this.isOpenDialog = true;
  
  DoTransfer() {
    
    console.log("Transferring Money!!!");
    
    this.dataService.transferCashback().then(
      (data: User) => { 
        this.sessionService.user = data;
        this.error = false;
      },
      (err: any) => {
        console.error('Cashback transfer error: ' + err.body || err);
        this.error = true; // or false // opens diferent state of modal
      }
    );
  }
  
  constructor(private dataService: DataService, private sessionService: SessionService, private router: Router) { }

  ngOnInit() {
    window.scroll(0,0);
    // user login validation check
    if (!this.sessionService.token || !this.sessionService.isSubscribed || !this.sessionService.isEligible) {
      // this.dataService.authenticateRedirect();
      let modal = UIkit.modal("#error");
      this.errorMsg = "Вы должны подписаться, чтобы войти в этот раздел";
      modal.show();
    }
    else {
      this.state = VIEW_STATES.KASHBACK;
      this.balance = this.sessionService.user.wallet.pendingTransferCashback;
      this.amountPending = this.sessionService.user.wallet.pendingMaturityCashback;
      
      // TEST ////////////////////
      // this.balance = 0;
      // this.amountPending = 40;
      ////////////////////////////
      
      this.hoursRemain = this.sessionService.user.wallet.pendingMaturityCashbackHoursToMature;
      // console.log(this.hoursRemain);
      
      this.message = "Available in: "+this.hoursRemain+" h.";
    }
  }
  
  showHistory() {
    this.router.navigate(['/history']);
  }
  
  goHome() {
    this.router.navigate(['home']);
  }
}
