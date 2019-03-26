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

  async opt() {
    this.dbService.optionsFindAll().then((l) => console.log(l));
  }
  async pro() {
    this.dbService.profilesFindAll().then((l) => console.log(l));
  }

}
