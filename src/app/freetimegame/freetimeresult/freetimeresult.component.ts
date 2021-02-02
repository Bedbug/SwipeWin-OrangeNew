import { Component, OnInit } from '@angular/core';
import { SessionService } from '../../session.service';
import { Router } from '@angular/router';
import UIkit from 'uikit';

@Component({
  selector: 'app-freetimeresult',
  templateUrl: './freetimeresult.component.html',
  styleUrls: ['./freetimeresult.component.scss']
})
export class FreetimeresultComponent implements OnInit {

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
      return "Ой…"
    if(this._rightAnswerCount == 1)
      return "Только…"
    if(this._rightAnswerCount >= 2 && this._rightAnswerCount <= 4)
      return "Хорошо!"
    if(this._rightAnswerCount >= 5 && this._rightAnswerCount <= 9)
      return "Замечательно!"
    if(this._rightAnswerCount >= 10)
      return "Прекрасно!"
  }
  
  get answerMessage(): string {
    if(this._rightAnswerCount == 0)
      return "Правильных ответов"
    if(this._rightAnswerCount == 1)
      return "Правильный ответ"
    if(this._rightAnswerCount >= 2 && this._rightAnswerCount <= 4)
      return "Правильных ответа"
    if(this._rightAnswerCount >= 5 )
      return "Правильных ответов"
    // if(this._rightAnswerCount >= 10)
    //   return "Прекрасно!"
  }
  
  private _firstTime = false;
  public _gamesPlayed = 2;
  private _rightAnswerCount = 10;
  private _cashbackAmount = 0;
  private _secondVariant = true;
  
  constructor(private session: SessionService, private router: Router) { }

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
   
    console.log("Goto Free Game!");
    this.router.navigate(['freetimegame']);
  }
  
  goHome() {
    console.log("Goto Return Home!");
    this.router.navigate(['returnhome']);
  }

}
