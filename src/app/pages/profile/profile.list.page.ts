import { AdminProfilePage } from './admin/admin-profile.page';
import { Component } from '@angular/core';
import { Entities } from 'src/app/entities/Entities';
import { IonSearchbar } from '@ionic/angular';
import { Message } from 'src/app/components/utilities/message';
import { Util } from 'src/app/components/utilities/utility';
import { ProfileService } from './profile.service';

@Component({
  selector: 'app-profile-list',
  templateUrl: 'profile.list.page.html'
})
export class ProfileListPage {
  private allProfiles: Entities.Profile[];
  public profiles: Entities.Profile[];
  constructor(private message: Message, private service: ProfileService) { }
  public async adminProfile(profile?: Entities.Profile) {
    let modal = await this.message.presentModal(AdminProfilePage, { 'profile': new Entities.Profile(profile) }, (() => this.ionViewWillEnter()));
    modal.present();
  }
  public cleanSearchbar() { this.profiles = this.allProfiles; }
  public ionViewWillEnter() {
    this.service.getAll().subscribe(p => {
      this.allProfiles = new Array();
      p.forEach(o => this.allProfiles.push(new Entities.Profile(o)));
      this.profiles = this.allProfiles;
    })
  }
  public search(searchbar: IonSearchbar) { this.profiles = Util.search(this.allProfiles, searchbar.value); }
}
