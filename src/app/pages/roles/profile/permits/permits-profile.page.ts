import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Entities } from 'src/app/entities/Entities';
import { Mock } from 'src/app/entities/Mock';
import { IonSearchbar, ToastController } from '@ionic/angular';
import { Util } from 'src/app/components/utility';

@Component({
  selector: 'app-permits-profile',
  templateUrl: './permits-profile.page.html'
})
export class PermitsByProfilePage implements OnInit {
  @Input() profileId: Number;
  @Input() close: any;
  profile: Entities.Profile;
  allOptions: Entities.Option[] = new Array()
  options: Entities.Option[] = new Array();
  constructor(public toast: ToastController) { }
  async modifyPermission(option: Entities.Option) {
    let permission = option.profiles.length > 0;
    let toast = await Util.createToast(this.profile.toString() + " ahora " + (permission ? "sin" : "con") + " permiso para " + option.toString().toLowerCase(), this.toast);
    toast.present();
    this.allOptions.filter(o => {
      if (o.id == option.id) {
        o.profiles = permission ? [] : [new Entities.Profile(this.profile)];
      }
    });
    this.options = this.allOptions;
  }
  cleanSearchbar() { this.options = this.allOptions; }
  closeModal() { close() }
  ngOnInit() {
    this.profile = Mock.profiles.find(p => p.id == this.profileId);
    Mock.options.forEach(o => this.allOptions.push(new Entities.Option(o)));
    this.allOptions.filter(o => o.profiles = o.profiles.filter(p => p.id == this.profile.id));
    this.options = this.allOptions;
  }
  search(searchbar: IonSearchbar) { this.options = Util.search(this.allOptions, searchbar.value); }
}
