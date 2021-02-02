import { Component, OnInit } from '@angular/core';
import { DataService } from '../data.service';
import { SessionService } from '../session.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  constructor(private dataService: DataService, private sessionService: SessionService, private router: Router) { }

  ngOnInit() {
    
     if (!this.sessionService.token || !this.sessionService.isSubscribed || !this.sessionService.isEligible) {
      // wanna inform the user here?
      //this._cashback = this.sessionService.cashback;
      // Initiate user authentication
       this.router.navigate(['home']);
    } else {
      this.router.navigate(['/returnhome']);
    }
    
  }

}
