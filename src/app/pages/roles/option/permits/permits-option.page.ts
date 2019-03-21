import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Entities } from 'src/app/entities/Entities';
import { Mock } from 'src/app/entities/Mock';
import { IonSearchbar, ToastController } from '@ionic/angular';
import { Util } from 'src/app/components/utility';

@Component({
  selector: 'app-permits-option', templateUrl: './permits-option.page.html'
})
export class PermitsByOptionPage implements OnInit {

  option: Entities.Option;
  allProfiles: Entities.Profile[] = new Array()
  profiles: Entities.Profile[] = new Array();

  constructor(public route: ActivatedRoute, public toast: ToastController) { }

  cleanSearchbar() { this.profiles = this.allProfiles; }

  async modifyPermission(profile: Entities.Profile) {
    let permission = profile.options.length > 0;
    const toast = await this.toast.create({
      message: profile.toString() + " ahora " + (permission ? "sin" : "con") + " permiso para " + this.option.toString().toLowerCase(),
      duration: 3000,
      showCloseButton: true,
      closeButtonText: 'Ok'
    });
    toast.present();

    this.allProfiles.filter(p => {
      if (p.id == profile.id) {
        p.options = permission ? [] : [new Entities.Option(this.option)];
      }
    });
    this.profiles = this.allProfiles;
  }

  ngOnInit() {
    this.option = Mock.options.find(o => o.id == this.route.snapshot.params.id);
    Mock.profiles.forEach(p => this.allProfiles.push(new Entities.Profile(p)));
    this.allProfiles.filter(p => p.options = p.options.filter(o => o.id == this.option.id));
    this.profiles = this.allProfiles;
  }

  search(searchbar: IonSearchbar) { this.profiles = Util.search(this.allProfiles, searchbar.value); }

}
