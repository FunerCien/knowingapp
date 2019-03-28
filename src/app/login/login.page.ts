import { Component } from '@angular/core';
import { DatabaseService } from '../services/db.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html'
})
export class LoginPage {
  list = new Array();
  constructor(private dbService: DatabaseService) {
  }

  async crea() {
    this.dbService.openDB().then(() => this.dbService.syncUp().then((l) => console.log(l)));
  }
  async opt() {
    this.dbService.optionsFindAll().then((l) => console.log(l));
  }
  async pro() {
    this.dbService.profilesFindAll().then((l) => console.log(l));
  }

}
