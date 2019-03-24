import { Component, OnInit, Input } from '@angular/core';
import { Entities } from 'src/app/entities/Entities';
import { Mock } from 'src/app/entities/Mock';
import { IonSearchbar, ToastController } from '@ionic/angular';
import { Util } from 'src/app/components/utilities/utility';

@Component({
  selector: 'app-permits-option',
  templateUrl: './permits-option.page.html'
})
export class PermitsByOptionPage implements OnInit {
  @Input() optionId: Number;
  @Input() close: any;
  allProfiles: Entities.Profile[] = new Array();
  option: Entities.Option;
  profiles: Entities.Profile[] = new Array();
  constructor(public toast: ToastController) { }
  async modifyPermission(profile: Entities.Profile) {
    let permission = profile.options.length > 0;
    let toast = await Util.createToast(profile.toString() + " ahora " + (permission ? "sin" : "con") + " permiso para " + this.option.toString().toLowerCase(), this.toast);
    toast.present();
    this.allProfiles.filter(p => {
      if (p.id == profile.id) {
        p.options = permission ? [] : [new Entities.Option(this.option)];
      }
    });
    this.profiles = this.allProfiles;
  }
  cleanProfiles() { this.profiles = this.allProfiles; }
  closeModal() { close() }
  ngOnInit() {
    let profilesId: Number[] = new Array();
    this.allProfiles = [];
    this.option = Mock.options.find(o => o.id == this.optionId);
    this.option.profiles.forEach(p => profilesId.push(p.id));
    Mock.profiles.forEach(p => {
      p.options = [];
      if (profilesId.includes(p.id)) p.options.push(new Entities.Option());
      this.allProfiles.push(new Entities.Profile(p))
    });
    this.cleanProfiles();
  }
  search(searchbar: IonSearchbar) { this.profiles = Util.search(this.allProfiles, searchbar.value); }
}
