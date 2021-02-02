import {Component, forwardRef, Input, Output, EventEmitter, OnInit, OnChanges, SimpleChange} from '@angular/core';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from '@angular/forms';

declare const require: any;
const R = require('ramda');

@Component({
  selector: 'app-input-text',
  templateUrl: './input-text.component.html',
  styleUrls: ['./input-text.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InputTextComponent),
      multi: true
    }
  ]
})
export class InputTextComponent implements OnInit {
  @Input() inputPlaceholder = '';
  @Input() inputType = 'text'; // password
  @Input() disabled = false;
  @Input() label: boolean;
  @Input() placeholder = '';
  @Output() blur: EventEmitter<any> = new EventEmitter();
  @Output() change: EventEmitter<any> = new EventEmitter();
  @Output() focus: EventEmitter<any> = new EventEmitter();
  @Output() keyup: EventEmitter<any> = new EventEmitter();

  public data;

  private isLabelPulled = false;

  public hideErrors = true;

  private propagateChange = (_: any) => {};

  public onTouched: any = () => { /*Empty*/ };

  public registerOnTouched(fn: any) {
    this.onTouched = fn;
  }

  public registerOnChange(fn: any) {
    this.propagateChange = fn;
  }

  public setDisabledState(isDisabled: boolean) {
    this.disabled = isDisabled;
  }

  public onChange = (e, input) => {
    this.data = e.target.value;
    this.updateLabel();

    if (this.data === '') {
      this.isLabelPulled = true;
    }

    this.change.emit(e.target.value);
    this.keyup.emit({event: e, data: input});

    this.propagateChange(this.data); // .replace(/[^0-9,]/g, '')
  }

  public onFocus = () => {
    this.focus.emit(this.data);
    this.isLabelPulled = true;
    this.hideErrors = true;
  }

  public onBlur = ($e) => {
    this.blur.emit($e);
    this.updateLabel();
    this.hideErrors = false;
  }

  public updateLabel() {
    if (this.label) {
      this.isLabelPulled = !!this.data;
    }
  }

  public setBlur() {
    this.hideErrors = false;
  }

  ngOnInit() {
  }
}
