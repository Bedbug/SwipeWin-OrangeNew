import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-transfer-dialog',
  templateUrl: './transfer-dialog.component.html',
  styleUrls: ['./transfer-dialog.component.scss']
})
export class TransferDialogComponent implements OnInit {

  public error = true;

  constructor() { }

  ngOnInit() {
  }

}
