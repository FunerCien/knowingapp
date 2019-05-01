import { Component, OnInit, Input } from '@angular/core';
import { Entities } from 'src/app/entities/Entities';
import { IonSearchbar, ToastController, ModalController } from '@ionic/angular';
import { Util } from 'src/app/components/utilities/utility';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Forms } from 'src/app/components/utilities/form';

@Component({ selector: 'app-admin-profile', templateUrl: './admin-profile.page.html' })
export class AdminProfilePage implements OnInit {
  @Input() profile: Entities.Profile;
  public allOptions: Entities.Option[] = new Array();
  public form: FormGroup;
  public options: Entities.Option[] = new Array();
  constructor(public formBuilder: FormBuilder, private modal: ModalController) { }
  cleanOptions() { this.options = this.allOptions; }
  close() { this.modal.dismiss(); }
  async saveProfile() {
    if (this.form.invalid) {
    } else {
      //   this.profile = Forms.setBasicDataToProfile(this.profile, this.form);
      //  let toast = await Util.createToast( this.profile + " guardado.", this.toast);
      //   toast.present();
      this.modal.dismiss();
    }
  }
  ngOnInit() {
    this.form = Forms.createProfile(this.profile);
    this.cleanOptions();
  }
  searchOptions(searchbar: IonSearchbar) { this.options = Util.search(this.allOptions, searchbar.value); }
}
