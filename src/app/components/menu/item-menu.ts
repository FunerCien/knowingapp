import { Component, Input } from '@angular/core';

@Component({
    selector: 'app-item-menu',
    templateUrl: './item-menu.html'
})
export class ItemMenuComponent { @Input() option: any; }
