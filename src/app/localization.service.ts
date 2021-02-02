import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LocalizationService {

  private locale: string = 'en';
  private dictionary: object = {};
  
  constructor() { }
  
  init(dictionary) {
    this.dictionary = dictionary;
  }
  
  Translate(term) {
    const localeDictionary = this.dictionary[this.locale] || this.dictionary['en'];
    if (localeDictionary)
        return localeDictionary[term] || `[${term}]`;
    else
        return `[${term}]`;
  }
  
  TranslateQuestion(question) {
    return question[this.locale] || question['en'];
  }
}
