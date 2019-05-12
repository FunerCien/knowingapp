import { Component } from '@angular/core';
import { DatabaseService } from './services/db.service';
import { Message } from './components/utilities/message';
import { MenuController, Platform } from '@ionic/angular';
import { NavigationEnd, Router, RouterEvent } from '@angular/router';
import { Network } from "@ionic-native/network/ngx";
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { Util } from './components/utilities/utility';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html'
})
export class AppComponent {
  options = [{
    icon: 'paper',
    title: 'Permisos',
    url: '/permits'
  }];
  constructor(private dbService: DatabaseService, private menu: MenuController, private message: Message, private network: Network, private platform: Platform, private router: Router, private splashScreen: SplashScreen, private statusBar: StatusBar) { this.initializeApp(); }
  public initializeApp() {
    this.platform.ready().then(() => {
      this.splashScreen.hide();
      this.statusBar.hide();
    });
  }
  public ngOnInit() {
    Util.setNetworkStatus(this.network.type != "none");
    this.dbService.openDb().subscribe();
    this.network.onConnect().subscribe(() => Util.setNetworkStatus(true));
    this.network.onDisconnect().subscribe(() => Util.setNetworkStatus(false));
    this.router.events.subscribe((event: RouterEvent) => {
      if (event instanceof NavigationEnd) {
        this.menu.enable(event.url !== '/');
        this.options.map(o => o['active'] = (event.url.split("/")[1] === o.url.split("/")[1]));
      }
    });
  }
  public signOff() {
    this.message.presentAlertConfirm('¿Cerrar sesión?', Util.getNetworkStatus() ? '' : 'Los datos que no se hayan sincronizado se perderán', [{
      cssClass: 'danger',
      text: 'Salir',
      handler: () => {
        this.dbService.dropDB().subscribe(() => this.dbService.openDb().subscribe());
        this.router.navigateByUrl("/");
      }
    }]);
  }
  public version() { this.message.presentAlertConfirm('v0.0.001'); }
}
