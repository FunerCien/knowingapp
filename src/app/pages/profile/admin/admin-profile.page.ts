import { Component, OnInit, Input } from '@angular/core';
import { Entities } from 'src/app/entities/Entities';
import { ModalController } from '@ionic/angular';
import { FormGroup } from '@angular/forms';
import { Forms } from 'src/app/components/utilities/form';
import { ProfileService } from '../profile.service';
import { Message } from 'src/app/components/utilities/message';
import { ChooseProfilePage, ChooseProfile, ChooseProfileStatus } from '../components/choose-profile.page';
import { ProfileUtils } from '../profile.utils';

@Component({
  selector: 'app-admin-profile',
  templateUrl: './admin-profile.page.html'
})
export class AdminProfilePage implements OnInit {
  @Input() profile: Entities.Profile;
  @Input() profiles: Entities.Profile[];
  private util: ProfileUtils;
  public form: FormGroup;
  constructor(private message: Message, private modal: ModalController, private service: ProfileService) { }
  private isCoordinatedBy(profile: Entities.Profile): Boolean {
    if (profile.coordinated.find(c => c.coordinated.lid == this.profile.lid)) return true;
    for (const coordination of profile.coordinated) if (this.isCoordinatedBy(this.profiles.find(p => p.lid == coordination.coordinated.lid))) return true;
    return false;
  }
  private isCoordinatorOf(profile: Entities.Profile): Boolean {
    if (profile.coordinators.find(c => c.coordinator.lid == this.profile.lid)) return true;
    for (const coordination of profile.coordinators) if (this.isCoordinatorOf(this.profiles.find(p => p.lid == coordination.coordinator.lid))) return true;
    return false;
  }
  public async chooseCoordinator(coordinator: Boolean) {
    (await this.message.presentModal(ChooseProfilePage, {
      'allProfiles': this.profiles.map(p => {
        let status: ChooseProfileStatus = ChooseProfileStatus.ACTIVE;
        if (p.lid == this.profile.lid) status = ChooseProfileStatus.SELF;
        else if (this.isCoordinatorOf(p)) status = ChooseProfileStatus.COORDINATED;
        else if (this.isCoordinatedBy(p)) status = ChooseProfileStatus.COORDINATOR;
        return new ChooseProfile({ icon: coordinator ? 'microphone' : 'pricetag', profile: p, status: status });
      })
    }, ((d: any) => {
      if (d.data) {
        let coordination: Entities.Coordination = new Entities.Coordination();
        coordination.coordinated = coordinator ? this.profile : d.data;
        coordination.coordinator = coordinator ? d.data : this.profile;
      }
    }))).present();
  }
  public close() { this.modal.dismiss(); }
  public detail(coordination: Entities.Coordination, coordinator: Boolean) {
    let profile: Entities.Profile = coordinator ? coordination.coordinator : coordination.coordinated;
    this.message.presentActionSheet(profile.toString(), [
      {
        text: "Detalle", icon: "information-circle-outline", handler: (() => {
          let message: string = "<hr><b>";
          let coordinations: string[] = this.util.implicitCoordinations(profile, coordinator).map(c => `<br>${c}`);
          if (coordinations.length > 0) message += (coordinator ? `Coordinadores implicitos:</b>` : `Coordinaciones implicitas:</b>`) + coordinations;
          else message = coordinator ? "Nadie lo coordina" : "Nadie es coordinado por él";
          this.message.presentAlert(profile.toString(), message)
        })
      },
      { cssClass: "danger", icon: "remove-circle-outline", text: "Desasignar", handler: (() => { }) }
    ]);
  }
  public ngOnInit() {
    this.form = Forms.getProfile(this.profile);
    this.util = new ProfileUtils(this.profiles);
  }
  public saveProfile() {
    this.form = Forms.getProfile(this.form.value);
    if (!Forms.getProfile(this.form.value).invalid) this.service.save(new Entities.Profile(this.form.value)).subscribe(() => this.modal.dismiss());
    else this.message.presentToast("El nombre del perfil es necesario");
  }
  public delete(profile: Entities.Profile) {
    this.message.presentAlert(`¿Eliminar ${profile}?`, "Una vez eliminado no se podrá recuperar", [{
      cssClass: 'danger',
      text: "Eliminar",
      handler: () => this.service.delete(profile).subscribe(() => this.modal.dismiss())
    }])
  }

}
