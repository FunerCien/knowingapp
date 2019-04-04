import { Component, OnInit } from '@angular/core';
import { Entities } from 'src/app/entities/Entities';
import { Util } from 'src/app/components/utilities/utility';
import { ModalController, IonSearchbar } from '@ionic/angular';

@Component({
    selector: 'app-option-list',
    templateUrl: 'option.list.page.html'
})
export class OptionListPage implements OnInit {
    allOptions: Entities.Option[];
    options: Entities.Option[];
    searchbarCleanable: Boolean = false;
    constructor(public modal: ModalController) { }
    async showPermits(optionId: Number) {
        let modal = await this.modal.create({
            component: null, componentProps: { 'optionId': optionId, 'close': () => modal.dismiss() }
        });
        modal.present();
    }
    cleanSearchbar() { this.options = this.allOptions; }
    ngOnInit() {
        this.allOptions = [];
        this.options = this.allOptions;
    }
    search(searchbar: IonSearchbar) { this.options = Util.search(this.allOptions, searchbar.value); }

}
