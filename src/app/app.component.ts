import { Component } from '@angular/core';

import { MenuController, Platform, LoadingController } from '@ionic/angular';
import { NavigationEnd, Router, RouterEvent } from '@angular/router';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { DatabaseService } from './services/db.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html'
})
export class AppComponent {

  options = [{
    icon: 'microphone',
    title: 'Nosotros',
    url: '/roles'
  }];

  constructor(
    private dbService: DatabaseService,
    private loading: LoadingController,
    private menu: MenuController,
    private platform: Platform,
    private router: Router,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar
  ) { this.initializeApp(); }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
      this.createDB();
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
  async createDB() {
    const loading = await this.loading.create({ message: 'Sincronizando información' });
    this.dbService.createDB(() => loading.dismiss());
  }
}
