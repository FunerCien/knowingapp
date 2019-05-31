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
    }, (async (d: any) => {
      if (d.data) {
        let coordination: Entities.Coordination = new Entities.Coordination();
        coordination.coordinated = new Entities.Profile(coordinator ? this.profile : d.data);
        coordination.coordinator = new Entities.Profile(coordinator ? d.data : this.profile);
        if (this.profile.lid) {
          let loading = await this.message.createLoading("Guardando");
          loading.present();
          this.service.saveCoordination(coordination).subscribe(c => {
            c.coordinated = this.profiles.find(p => p.name == c.coordinated.name);
            c.coordinator = this.profiles.find(p => p.name == c.coordinator.name);
            loading.dismiss();
            this.message.presentToast(coordinator ? `Coordinador asignado` : `Coordinación asignada`);
            this.profiles.forEach(p => {
              if (p.lid == coordination.coordinated.lid) p.coordinators.push(c);
              else if (p.lid == coordination.coordinator.lid) p.coordinated.push(c);
            });
            this.profile = this.profiles.find(p => p.name == this.profile.name);
          });
        }
      }
    }))).present();
  }
  public close() { this.modal.dismiss(); }
  public detail(coordination: Entities.Coordination, coordinator: Boolean) {
    let profile: Entities.Profile = coordinator ? coordination.coordinator : coordination.coordinated;
    this.message.presentActionSheet(profile.toString(), [
      {
        text: coordinator ? "Coordinadores implicitos" : "Coordinaciones implicitas", icon: "information-circle-outline", handler: (() => {
          let message: string = "<hr><b>";
          let coordinations: string[] = ProfileUtils.implicitCoordinations(profile, this.profiles, coordinator).map(c => `<br>${c}`);
          if (coordinations.length > 0) message += (coordinator ? `Coordinadores implicitos:</b>` : `Coordinaciones implicitas:</b>`) + coordinations;
          else message = coordinator ? "Nadie lo coordina" : "Nadie es coordinado por él";
          this.message.presentAlert(profile.toString(), message)
        })
      },
      {
        cssClass: "danger", icon: "remove-circle-outline", text: "Desasignar", handler: (async () => {
          if (this.profile.lid) {
            let loading = await this.message.createLoading("Eliminando");
            loading.present();
            this.service.deleteCoordination(coordination).subscribe(() => {
              loading.dismiss();
              this.message.presentToast(coordinator ? `Coordinador asignado` : `Coordinación asignada`);
              console.log(this.profile)
              //if (coordinator) this.profile.coordinators.push(c);
              //else this.profile.coordinated.push(c);
              console.log(this.profile)
              this.profiles.forEach(p => {
                // if (p.lid == coordination.coordinated.lid) p.coordinators.push(c);
                // else if (p.lid == coordination.coordinator.lid) p.coordinated.push(c);
              });
            })
          }
        })
      }
    ]);
  }
  public ngOnInit() { this.form = Forms.getProfile(this.profile); console.log(this.profiles) }
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