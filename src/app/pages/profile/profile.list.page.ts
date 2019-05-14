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
  private allProfiles: Entities.Profile[] = new Array();
  public profiles: Entities.Profile[] = new Array();
  constructor(private message: Message, private service: ProfileService) { }
  public async adminProfile(profile?: Entities.Profile) { (await this.message.presentModal(AdminProfilePage, { 'profile': new Entities.Profile(profile) }, (() => this.getAll()))).present(); }
  public cleanSearchbar() { this.profiles = this.allProfiles; }
  public getAll(event?: any) {
    this.service.getAll().subscribe(p => {
      if (event) event.target.complete();
      this.allProfiles = new Array();
      p.forEach(o => this.allProfiles.push(new Entities.Profile(o)));
      this.profiles = this.allProfiles;
    })
  }
  public ionViewWillEnter() { this.getAll() }
  public search(searchbar: IonSearchbar) { this.profiles = Util.search(this.allProfiles, searchbar.value); }
}
