import { Component, OnInit, Input } from '@angular/core';
import { Entities } from 'src/app/entities/Entities';
import { ModalController, IonSearchbar } from '@ionic/angular';
import { FormGroup } from '@angular/forms';
import { Message } from 'src/app/components/utilities/message';
import { Util } from 'src/app/components/utilities/utility';
import { ProfileUtils } from '../profile.utils';

@Component({
  selector: 'app-choose-profile',
  templateUrl: './choose-profile.page.html'
})
export class ChooseProfilePage implements OnInit {
  @Input() allProfiles: ChooseProfile[];
  private util: ProfileUtils;
  public form: FormGroup;
  public profiles: ChooseProfile[];
  constructor(private message: Message, private modal: ModalController) { }
  public choose(profile: ChooseProfile) {
    if (profile.status == ChooseProfileStatus.COORDINATED) this.message.presentToast(`Ya se está coordinando a ${profile.profile}`);
    else if (profile.status == ChooseProfileStatus.COORDINATOR) this.message.presentToast(`${profile.profile} lo está coordinando`);
    else if (profile.status == ChooseProfileStatus.SELF) this.message.presentToast("Un perfil no puede ser coordinado por sí mismo");
    else {
      this.message.presentActionSheet(profile.profile.toString(), [
        {
          text: "Detalle", icon: "information-circle-outline", handler: (() => {
            let coordinated: string[] = ProfileUtils.implicitCoordinations(profile.profile, this.allProfiles.map(p => p.profile), false).map(c => `<br>${c}`);
            let coordinators: string[] = ProfileUtils.implicitCoordinations(profile.profile, this.allProfiles.map(p => p.profile), true).map(c => `<br>${c}`);
            let message: string = "";
            if (coordinated.length > 0) message += `<hr><b>Coordina a:</b>${coordinated}`;
            if (coordinators.length > 0) message += `<hr><b>Es coordinado por:</b>${coordinators}`;
            this.message.presentAlert(profile.profile.toString(), message.length > 0 ? message : "Sin coordinaciones");
          })
        },
        { cssClass: "success", icon: "checkmark", text: "Asignar", handler: (() => this.modal.dismiss(profile.profile)) }
      ]);
    }
  }
  public cleanSearchbar() { this.profiles = this.allProfiles; }
  public close() { this.modal.dismiss(); }
  public ngOnInit() {
    this.allProfiles = Util.sort(this.allProfiles);
    this.profiles = this.allProfiles;
  }
  public search(searchbar: IonSearchbar) { this.profiles = Util.search(this.allProfiles, searchbar.value); }
}

export class ChooseProfile {
  icon: string;
  profile: Entities.Profile;
  status: ChooseProfileStatus;
  constructor(choose?: ChooseProfile) {
    this.icon = choose && choose.icon || 'code';
    this.profile = choose && choose.profile || new Entities.Profile();
    this.status = choose && choose.status || null;
    this.toString = () => (this.status.toString() == "1" ? "1" : "2") + this.profile;
  }
}

export enum ChooseProfileStatus { ACTIVE = 1, COORDINATED, COORDINATOR, SELF }