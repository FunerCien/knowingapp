import { Component, OnInit } from '@angular/core';
import { IonSearchbar, IonItemSliding, ModalController } from '@ionic/angular';
import { Util } from 'src/app/components/utilities/utility';
import { Mock } from 'src/app/entities/Mock';
import { Entities } from 'src/app/entities/Entities';
import { AdminProfilePage } from './admin/admin-profile.page';

@Component({
    selector: 'app-profile-list',
    templateUrl: 'profile.list.page.html'
})
export class ProfileListPage implements OnInit {
    allProfiles: Entities.Profile[];
    profiles: Entities.Profile[];
    constructor(public modal: ModalController) { }
    async adminProfile(profile?: Entities.Profile) {
        if (profile == null) profile = new Entities.Profile();
        const modal = await this.modal.create({
            component: AdminProfilePage,
            componentProps: {
                'close': () => modal.dismiss(),
                'profile': profile
            },
            mode: "ios"
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
