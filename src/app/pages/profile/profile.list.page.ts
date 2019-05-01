import { AdminProfilePage } from './admin/admin-profile.page';
import { Component } from '@angular/core';
import { DatabaseService } from 'src/app/services/db.service';
import { Entities } from 'src/app/entities/Entities';
import { IonSearchbar } from '@ionic/angular';
import { Message } from 'src/app/components/utilities/message';
import { Table } from 'src/app/services/db.sql';
import { Util } from 'src/app/components/utilities/utility';

@Component({ selector: 'app-profile-list', templateUrl: 'profile.list.page.html' })
export class ProfileListPage {
  private allProfiles: Entities.Profile[];
  public profiles: Entities.Profile[];
  constructor(private message: Message, private dbService: DatabaseService) { }
  public async adminProfile(profile?: Entities.Profile) {
    let modal = await this.message.presentModal(AdminProfilePage, { 'profile': new Entities.Profile(profile) }, (() => this.ionViewWillEnter()));
    modal.present();
  }
  public cleanSearchbar() { this.profiles = this.allProfiles; }
  public ionViewWillEnter() {
    this.dbService.selectAll(Table.profiles, ((op: Entities.Profile[]) => {
      this.allProfiles = new Array();
      op.forEach(o => this.allProfiles.push(new Entities.Profile(o)));
      this.profiles = this.allProfiles;
    }));
  }
  public search(searchbar: IonSearchbar) { this.profiles = Util.search(this.allProfiles, searchbar.value); }
}
