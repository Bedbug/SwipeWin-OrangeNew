import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

if (environment.production) {
  enableProdMode();
}

platformBrowserDynamic().bootstrapModule(AppModule)
  .then(ref => {
    // Ensure Angular destroys itself on hot reloads.
    // This comes from a catch-refresh example at https://stackblitz.com/edit/angular-r6-detect-browser-refresh?file=src%2Fmain.ts 
    if (window['ngRef']) {
      window['ngRef'].destroy();
    }
    window['ngRef'] = ref;
  
    // Otherwise, log the boot error
  })
  .catch(err => console.log(err));
