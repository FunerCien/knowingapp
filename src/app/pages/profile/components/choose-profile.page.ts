import { Component, OnInit, Input } from '@angular/core';
import { Entities } from 'src/app/entities/Entities';
import { ModalController } from '@ionic/angular';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-choose-profile',
  templateUrl: './choose-profile.page.html'
})
export class ChooseProfilePage implements OnInit {
  @Input() allProfiles: Entities.Profile[];
  public profiles: Entities.Profile[];
  public form: FormGroup;
  constructor(private modal: ModalController) { }
  public close() { this.modal.dismiss(); }
  public ngOnInit() { this.profiles = this.allProfiles }
  public choose(profile: Entities.Profile) { }

}
