import { Component, OnInit } from '@angular/core';
import { DataService } from '../../data.service';
import { SessionService } from '../../session.service';
import { Router } from '@angular/router';
import UIkit from 'uikit';

@Component({
  selector: 'app-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.scss']
})
export class HistoryComponent implements OnInit {

  public headers = ['Cashback', 'Date'];
  public data = [
    ['', ''],
    ['', ''],
    ['', ''],
    ['', ''],
  ];
  
  public errorMsg = "";
  
  constructor(private dataService: DataService, private sessionService: SessionService, private router: Router) { }

  

  ngOnInit() {
    window.scroll(0,0);
    // user login validation check
    if (!this.sessionService.token || !this.sessionService.isSubscribed || !this.sessionService.isEligible) {
      // wanna inform the user here?
      //this._cashback = this.sessionService.cashback;
      // Initiate user authentication
      // this.dataService.authenticateRedirect();
      let modal = UIkit.modal("#error");
      this.errorMsg = "Вы должны подписаться, чтобы войти в этот раздел";
      modal.show();
    }
    else {
      if(this.sessionService.user.wallet.transferredCashbacks.length > 0)
        this.data = [];
      for(var i=0; i < this.sessionService.user.wallet.transferredCashbacks.length; i++){
        
         var newDate = this.formatDate(this.sessionService.user.wallet.transferredCashbacks[i].cashbackWonAt);
         
        
        console.log(this.sessionService.user.wallet.transferredCashbacks[i].cashbackWonAt);
        this.data.push([this.sessionService.user.wallet.transferredCashbacks[i].cashbackWon, newDate.toString()]);
        // this.data.add([this.sessionService.user.wallet.transferredCashbacks[i].cashbackWon, this.sessionService.user.wallet.transferredCashbacks[i].cashbackWonAt])
      }
      
    }
  }

  formatDate (stringDate){
    var date = new Date(stringDate);
    return date.getDate() + '/' + (date.getMonth() + 1) + '/' +  date.getFullYear();
  }
  
  goHome() {
    this.router.navigate(['home']);
  }
}
