import { Component, OnInit, Input } from '@angular/core';
import { Entities } from 'src/app/entities/Entities';
import { IonSearchbar, ToastController } from '@ionic/angular';
import { Util } from 'src/app/components/utilities/utility';
import { FormGroup, FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-admin-profile',
  templateUrl: './admin-profile.page.html'
})
export class AdminProfilePage implements OnInit {
 // @Input() profile: Entities.Profile;
  @Input() close: any;
  allOptions: Entities.Option[] = new Array();
  form: FormGroup;
  options: Entities.Option[] = new Array();
  constructor(public formBuilder: FormBuilder, public toast: ToastController) { }
  managePermits(option: Entities.Option) {
  //  let permission: Boolean = option.profiles.length > 0;
   // if (!permission) this.profile.options.push(option)
  //  else this.profile.options.splice(this.profile.options.indexOf(option), 1);
    this.allOptions.filter(o => {
  //    if (o.id == option.id) o.profiles = permission ? [] : [new Entities.Profile(this.profile)];
    });
  }
  cleanOptions() { this.options = this.allOptions; }
  async saveProfile() {
    if (this.form.invalid) {
    } else {
   //   this.profile = Forms.setBasicDataToProfile(this.profile, this.form);
    //  let toast = await Util.createToast( this.profile + " guardado.", this.toast);
   //   toast.present();
      this.close();
    }
  }
  ngOnInit() {
    let optionsId: Number[] = new Array();
  //  this.form = Forms.createProfile(this.profile);
  //  this.profile.options.forEach(o => optionsId.push(o.id));
    for (let index = 0; index < 50; index++) {
      this.allOptions.push(new Entities.Option());
      
    }
    //Mock.options.forEach(o => {
    //  o.profiles = [];
    //  if (optionsId.includes(o.id)) o.profiles.push(new Entities.Profile());
    //  this.allOptions.push(new Entities.Option(o))
    //});
    this.cleanOptions();
  }
  searchOptions(searchbar: IonSearchbar) { this.options = Util.search(this.allOptions, searchbar.value); }
}
