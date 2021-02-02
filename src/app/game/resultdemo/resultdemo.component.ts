import { Component, OnInit } from '@angular/core';
import { SessionService } from '../../session.service';
import { Router } from '@angular/router';
import { DataService } from '../../data.service';

import UIkit from 'uikit';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-resultdemo',
  templateUrl: './resultdemo.component.html',
  styleUrls: ['./resultdemo.component.scss']
})
export class ResultdemoComponent implements OnInit {

   get secondVariant(): boolean {
    return this._secondVariant;
  }
  get cashbackAmount(): number {
    return this._cashbackAmount;
  }
  get rightAnswerCount(): number {
    return this._rightAnswerCount;
  }
  get gamesPlayed(): number {
    return this._gamesPlayed;
  }
  
  
  
  get TopText(): string {
    if(this._rightAnswerCount == 0)
      return this.translate.instant('END.MES_01')
    if(this._rightAnswerCount == 1)
      return this.translate.instant('END.MES_02')
    if(this._rightAnswerCount >= 2 && this._rightAnswerCount <= 4)
      return this.translate.instant('END.MES_03')
    if(this._rightAnswerCount >= 5 && this._rightAnswerCount <= 9)
      return this.translate.instant('END.MES_04')
    if(this._rightAnswerCount >= 10)
      return this.translate.instant('END.MES_05')
  }
  
  get answerMessage(): string {
    if(this._rightAnswerCount == 0)
      return this.translate.instant('END.MES_06')
    if(this._rightAnswerCount == 1)
      return this.translate.instant('END.MES_06')
    if(this._rightAnswerCount >= 2 && this._rightAnswerCount <= 4)
      return this.translate.instant('END.MES_06')
    if(this._rightAnswerCount >= 5 )
      return this.translate.instant('END.MES_06')
    // if(this._rightAnswerCount >= 10)
    //   return "Прекрасно!"
  }
  
  // if(this._firstTime && this._cashbackAmount == 0)
  //     return "This is just the start!";
  //   if(this._firstTime && this._cashbackAmount > 0 && this._rightAnswerCount <= 5)
  //     return "Well done for taking that cash!";
  //   if(this._rightAnswerCount >= 10 && this._cashbackAmount > 0)
  //     return "Excellent!";
  //   if(this._rightAnswerCount <= 5 && this._cashbackAmount == 0)
  //     return "Not as good as last time...";
  
  private _firstTime = false;
  public _gamesPlayed = 5;
  public _hasCredits = 0;
  private _rightAnswerCount = 10;
  private _cashbackAmount = 0;
  private _secondVariant = true;
  
  constructor(private dataService : DataService, private session: SessionService, private router: Router, private translate: TranslateService) { }

  ngOnInit() {
    if (!this.session.lastGameResults)
      this.router.navigate(['home']);
      
    this._rightAnswerCount = this.session.lastGameResults.correctAnswers;
    this._cashbackAmount = this.session.lastGameResults.cashbackWon || 0;
    this._firstTime = this.session.gamesPlayed == 1;
    
    this._gamesPlayed = +localStorage.getItem('demoGamesPlayed');
    console.log("Games Played: "+ this._gamesPlayed);
    
    // If CashBack Won Set tothan
    this._cashbackAmount > 0
      localStorage.setItem('demoCashWon', "10");
    
    
    var modal = UIkit.modal("#result");
    setTimeout( () => { modal.show(); }, 1000 );
      
  }
  
  startGame() {
    this._gamesPlayed++;
    localStorage.setItem('demoGamesPlayed', this._gamesPlayed.toString());
    console.log("Goto Demo Game!");
    this.router.navigate(['demogame']);
  }
  
  goHome() {
    console.log("Goto Return Home!");
    this.router.navigate(['home']);
  }
  
  goHomeWithLogin() {
    console.log("Goto Return Home!");
    localStorage.setItem('loginOn', "1");
    this.router.navigate(['home']);
  }
  
  subscribe($event) {
    console.log('button is clicked');
    this.router.navigate(['home']);
    // $event.stopPropagation();
    // this.dataService.authenticateRedirect();
  }

}
