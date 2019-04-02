import { Component } from '@angular/core';
import { DatabaseService } from '../services/db.service';
import { SynchroizationService } from '../services/synchronization.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html'
})
export class LoginPage {
  list = new Array();
  constructor(private dbService: DatabaseService, private service: SynchroizationService) {
  }

  async crea() {
    this.dbService.openDB().then(() => this.dbService.syncUp().then((l) => this.service.syncUp(l).subscribe(r => console.log(r))).catch(e => console.log(e)));
  }
  async opt() {
    this.dbService.optionsFindAll().then((l) => console.log(l));
  }
  async pro() {
    this.dbService.profilesFindAll().then((l) => console.log(l));
  }

}
