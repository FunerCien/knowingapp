import { Component } from '@angular/core';
import { DatabaseService } from '../services/db.service';
import { SynchroizationService } from '../services/synchronization.service';
import { Entities } from '../entities/Entities';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html'
})
export class LoginPage {
  list = new Array();
  constructor(private dbService: DatabaseService, private service: SynchroizationService) {
  }

  async crea() {
    this.dbService.openDB().then(() => {
      this.dbService.syncUp((s: Entities.Synchronization) => {
        this.service.syncUp(s).subscribe(r => {
          this.dbService.syncOptions(r.options).then(() => console.log(r))
        });
      });
    });
    //
    this.dbService.syncUp
  }
  async opt() {
    this.dbService.optionsFindAll().then((l) => console.log(l));
  }
  async pro() {
    this.dbService.profilesFindAll().then((l) => console.log(l));
  }

}
