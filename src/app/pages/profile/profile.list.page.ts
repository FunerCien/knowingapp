import { AdminProfilePage } from './admin/admin-profile.page';
import { Component, OnInit } from '@angular/core';
import { Entities } from 'src/app/entities/Entities';
import { IonSearchbar } from '@ionic/angular';
import { Message } from 'src/app/components/utilities/message';
import { Util } from 'src/app/components/utilities/utility';
import { ProfileService } from './profile.service';

@Component({
  selector: 'app-profile-list',
  templateUrl: 'profile.list.page.html'
})
export class ProfileListPage implements OnInit {
  private allProfiles: Entities.Profile[] = new Array();
  public profiles: Entities.Profile[] = new Array();
  constructor(private message: Message, private service: ProfileService) { }
  public async adminProfile(profile?: Entities.Profile) { (await this.message.presentModal(AdminProfilePage, { 'profile': new Entities.Profile(profile) }, (() => this.getAll()))).present(); }
  public cleanSearchbar() { this.profiles = this.allProfiles; }
  public getAll(event?: any) {
    this.service.getAll().subscribe(p => {
      if (event) event.target.complete();
      this.allProfiles = p;
      this.profiles = Util.sort(this.allProfiles);
    })
  }
  public info() { this.message.presentAlertConfirm('Perfiles', 'A los siervos se le asignan <b>perfiles</b> para definir sus coordinadores y gestionar sus permisos dentro de la aplicación.'); }
  public ngOnInit() { this.getAll() }
  public search(searchbar: IonSearchbar) { this.profiles = Util.search(this.allProfiles, searchbar.value); }
}
