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

  crea() { this.dbService.openDb().subscribe(() => console.log("Created")); }

  syn() {
    this.dbService.syncAll().subscribe(() => console.log("Synchronizated"));
  }

  opt() { this.dbService.selectOptions().subscribe(s => console.log(s)) }

  de() { this.dbService.dropDB(); }

}
