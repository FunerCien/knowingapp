import { Component } from '@angular/core';
import { DatabaseService } from '../services/db.service';
import { Router } from '@angular/router';
import { Message } from '../components/utilities/message';
import { Util } from '../components/utilities/utility';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html'
})
export class LoginPage {
  constructor(private dbService: DatabaseService, private message: Message, private router: Router) { }
  public async walkInto() {
    if (Util.getNetworkStatus()) {
      let load = await this.message.createLoading("Sincronizando");
      load.present();
      this.dbService.syncAll().subscribe(() => {
        load.dismiss();
        this.router.navigateByUrl("/permits");
      });
    } else { this.message.presentToast("¡Necesitamos conectarnos!"); }
  }
}
