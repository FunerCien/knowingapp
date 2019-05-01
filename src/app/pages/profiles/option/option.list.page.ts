import { Component } from '@angular/core';
import { Entities } from 'src/app/entities/Entities';
import { Util } from 'src/app/components/utilities/utility';
import { ModalController, IonSearchbar } from '@ionic/angular';
import { DatabaseService } from 'src/app/services/db.service';
import { Table } from 'src/app/services/db.sql';

@Component({ selector: 'app-option-list', templateUrl: 'option.list.page.html' })
export class OptionListPage {
    public allOptions: Entities.Profile[] = new Array();
    public options: Entities.Profile[] = new Array();
    constructor(private modal: ModalController, private dbService: DatabaseService) { }
    /* async showPermits(optionId: Number) {
         let modal = await this.modal.create({
             component: null, componentProps: { 'optionId': optionId, 'close': () => modal.dismiss() }
         });
         modal.present();
     }*/
    public cleanSearchbar() { this.options = this.allOptions; }
    public ionViewWillEnter() {
        this.dbService.selectAll(Table.profiles, ((op: Entities.Profile[]) => {
            this.allOptions = new Array();
            op.forEach(o => this.allOptions.push(new Entities.Profile(o)));
            this.options = this.allOptions;
        }));
    }
    public search(searchbar: IonSearchbar) { this.options = Util.search(this.allOptions, searchbar.value); }
}
