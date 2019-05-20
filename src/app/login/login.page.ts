import { Component } from '@angular/core';
import { DatabaseService } from '../services/db.service';
import { Router } from '@angular/router';
import { Message } from '../components/utilities/message';
import { Util } from '../components/utilities/utility';
import { SynchroizationService } from '../services/synchronization.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html'
})
export class LoginPage {
  public updated: Boolean = false;
  constructor(private dbService: DatabaseService, private message: Message, private router: Router, private synchronization: SynchroizationService) { }
  public async ngOnInit() {
    let loading = await this.message.createLoading("Verificando");
    loading.present();
    this.synchronization.verifyVersion().subscribe(() => {
      loading.dismiss();
      this.updated = true;
    });
  }
  public async walkInto() {
    if (Util.NETWORK_STATUS) {
      let load = await this.message.createLoading("Sincronizando");
      load.present();
      this.dbService.dropDB().subscribe(() => this.dbService.openDb().subscribe(() => this.dbService.syncAll().subscribe(() => {
        load.dismiss();
        this.router.navigateByUrl("/permits");
      })));
    } else this.router.navigateByUrl("/permits");//this.message.presentToast("¡Necesitamos conectarnos!");
  }
}
