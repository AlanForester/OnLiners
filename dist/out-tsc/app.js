import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { AppModule } from './app/app.module';
import { environment } from './environments/environment.app';
if (environment.production) {
    enableProdMode();
}
const q = platformBrowserDynamic().bootstrapModule(AppModule)
    .catch(err => console.error(err));
Promise.apply(q);
//# sourceMappingURL=app.js.map