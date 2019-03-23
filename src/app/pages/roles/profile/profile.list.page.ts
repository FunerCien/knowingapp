import { Component, OnInit } from '@angular/core';
import { IonSearchbar, IonItemSliding, ModalController } from '@ionic/angular';
import { Util } from 'src/app/components/utility';
import { Mock } from 'src/app/entities/Mock';
import { Entities } from 'src/app/entities/Entities';
import { PermitsByProfilePage } from './permits/permits-profile.page';

@Component({ selector: 'app-profile-list', templateUrl: 'profile.list.page.html' })
export class ProfileListPage implements OnInit {
    allProfiles: Entities.Profile[];
    profiles: Entities.Profile[];
    constructor(public modal: ModalController) { }
    async showPermits(profileId: Number, sliding: IonItemSliding) {
        sliding.close();
        const modal = await this.modal.create({
            component: PermitsByProfilePage, componentProps: { 'profileId': profileId, 'close': () => modal.dismiss() }
        });

        modal.present();
    }
    cleanSearchbar() { this.profiles = this.allProfiles; }
    ngOnInit() {
        this.allProfiles = Mock.profiles;
        this.profiles = this.allProfiles;
    }
    search(searchbar: IonSearchbar) { this.profiles = Util.search(this.allProfiles, searchbar.value); }
}
