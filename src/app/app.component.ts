import { Component } from '@angular/core';

import { Platform, MenuController } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { Router, RouterEvent, NavigationEnd } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html'
})
export class AppComponent {
  constructor(private platform: Platform, private splashScreen: SplashScreen, private statusBar: StatusBar, private menu: MenuController, private router: Router) { this.initializeApp(); }

  options = [{
    icon: 'microphone',
    title: 'Nosotros',
    url: '/roles'
  }];
  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }
  ngOnInit() {
    this.router.events.subscribe((event: RouterEvent) => {
      if (event instanceof NavigationEnd) {
        this.menu.enable(event.url !== '/');
        this.options.map(o => o['active'] = (event.url.split("/")[1] === o.url.split("/")[1]));
      }
    });
  }
}
