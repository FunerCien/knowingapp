import { Component, OnInit, Input } from '@angular/core';
import { Entities } from 'src/app/entities/Entities';
import { IonSearchbar, ModalController } from '@ionic/angular';
import { Util } from 'src/app/components/utilities/utility';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Forms } from 'src/app/components/utilities/form';
import { ProfileService } from '../profile.service';
import { Message } from 'src/app/components/utilities/message';

@Component({
  selector: 'app-admin-profile',
  templateUrl: './admin-profile.page.html'
})
export class AdminProfilePage implements OnInit {
  @Input() profile: Entities.Profile;
  public allOptions: Entities.Option[] = new Array();
  public form: FormGroup;
  public options: Entities.Option[] = new Array();
  constructor(public formBuilder: FormBuilder, private message: Message, private modal: ModalController, private service: ProfileService) { }
  public cleanOptions() { this.options = this.allOptions; }
  public close() { this.modal.dismiss(); }
  public ngOnInit() {
    this.form = Forms.createProfile(this.profile);
    this.cleanOptions();
  }
  public saveProfile() {
    let profile: Entities.Profile = new Entities.Profile(this.form.value);
    if (!this.form.invalid) this.service.save(profile).subscribe(() => this.modal.dismiss());
    else this.message.presentToast("El nombre del perfil es necesario");
  }
  public delete(profile: Entities.Profile) {
    this.message.presentAlertConfirm(`¿Eliminar ${profile}?`, "Una vez eliminado no se podrá recuperar", [{
      cssClass: 'danger',
      text: "Eliminar",
      handler: () => this.service.delete(profile).subscribe(() => this.modal.dismiss())
    }])
  }
  public searchOptions(searchbar: IonSearchbar) { this.options = Util.search(this.allOptions, searchbar.value); }
}
