import { Component, OnInit } from '@angular/core';
import { DataService } from '../../data.service';
import { SessionService } from '../../session.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-subscribe-dialog',
  templateUrl: './subscribe-dialog.component.html',
  styleUrls: ['./subscribe-dialog.component.scss']
})
export class SubscribeDialogComponent implements OnInit {
  get isUnsubscribeConfirm(): boolean {
    return this._isUnsubscribeConfirm;
  }

  private _isUnsubscribeConfirm = false;

  public unsubscribe = () => {
    // this._isUnsubscribeConfirm = true;
    this.dataService.unsubscribe().then(
      (data) => {
        this.sessionService.reset();
        this.router.navigate(['/home']);
      },
      (err) => {
        
      });
  };

  constructor(
    private dataService: DataService,
    private sessionService: SessionService,
    private router: Router
    ) { }

  ngOnInit() {
  }

}
