import { Component, OnInit } from '@angular/core';
import { Entities } from 'src/app/entities/Entities';
import { Router } from '@angular/router';
import { IonItemSliding, IonSearchbar } from '@ionic/angular';
import { Mock } from 'src/app/entities/Mock';
import { Util } from 'src/app/components/utility';

@Component({
    selector: 'app-option-list', templateUrl: 'option.list.page.html'
})
export class OptionListPage implements OnInit {

    allOptions: Entities.Option[];
    options: Entities.Option[];

    searchbarCleanable: Boolean = false;

    constructor(public router: Router) { }

    cleanSearchbar() { this.options = this.allOptions; }

    ngOnInit() {
        this.allOptions = Mock.options;
        this.options = this.allOptions;
    }

    search(searchbar: IonSearchbar) { this.options = Util.search(this.allOptions, searchbar.value); }

    showPermits(optionId: Number, sliding: IonItemSliding) {
        sliding.close();
        this.router.navigate(["/roles/option-permits/" + optionId]);
    }
}
