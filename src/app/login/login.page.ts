import { Component } from '@angular/core';
import { DatabaseService } from '../services/db.service';
import { Router } from '@angular/router';
import { Message } from '../components/utilities/message';
import { Util } from '../components/utilities/utility';
import { Network } from '@ionic-native/network/ngx';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html'
})
export class LoginPage {
  public jj = this.n.type;
  constructor(private dbService: DatabaseService, private n: Network, private message: Message, private router: Router) {
  }
  public async walkInto() {
    if (Util.getNetworkStatus()) {
      let load = await this.message.createLoading("");
      load.present();
      this.dbService.syncAll().subscribe(() => {
        load.dismiss();
        this.router.navigateByUrl("/profiles");
      });
    } else {
      this.message.presentToast("¡Necesitamos conectarnos!");
    }
  }
}
