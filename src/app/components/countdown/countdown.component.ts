import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-countdown',
  templateUrl: './countdown.component.html',
  styleUrls: ['./countdown.component.scss']
})
export class CountdownComponent implements OnInit {
  get timer(): number {
    return this._timer;
  }

  private _timer = 3;

  public timerStart = () => {
    const timerId = setInterval(() => {
      if (this._timer === 1) { clearInterval(timerId); }
      this._timer--;
    }, 1000);
  };

  constructor() { }

  ngOnInit() {
    this.timerStart();
  }

}
