import { Component, OnInit, Input } from '@angular/core';
import { Entities } from 'src/app/entities/Entities';
import { ModalController } from '@ionic/angular';
import { FormGroup } from '@angular/forms';
import { Forms } from 'src/app/components/utilities/form';
import { ProfileService } from '../profile.service';
import { Message } from 'src/app/components/utilities/message';
import { ChooseProfilePage } from '../components/choose-profile.page';

@Component({
  selector: 'app-admin-profile',
  templateUrl: './admin-profile.page.html'
})
export class AdminProfilePage implements OnInit {
  @Input() profile: Entities.Profile;
  @Input() profiles: Entities.Profile[];
  public form: FormGroup;
  constructor(private message: Message, private modal: ModalController, private service: ProfileService) { }
  public async chooseCoordinator() {
    (await this.message.presentModal(ChooseProfilePage, {
      'allProfiles': this.profiles.filter(p => {
        return p.lid != this.profile.lid
      })
    }, (p => console.log(p)))).present();
  }
  public close() { this.modal.dismiss(); }
  public ngOnInit() { this.form = Forms.getProfile(this.profile); }
  public saveProfile() {
    this.form = Forms.getProfile(this.form.value);
    if (!Forms.getProfile(this.form.value).invalid) this.service.save(new Entities.Profile(this.form.value)).subscribe(() => this.modal.dismiss());
    else this.message.presentToast("El nombre del perfil es necesario");
  }
  public delete(profile: Entities.Profile) {
    this.message.presentAlertConfirm(`¿Eliminar ${profile}?`, "Una vez eliminado no se podrá recuperar", [{
      cssClass: 'danger',
      text: "Eliminar",
      handler: () => this.service.delete(profile).subscribe(() => this.modal.dismiss())
    }])
  }

}
