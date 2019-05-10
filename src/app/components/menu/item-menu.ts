import { Component, Input } from '@angular/core';

@Component({
    selector: 'app-item-menu',
    styleUrls: ['./menu.scss'],
    templateUrl: './item-menu.html'
})
export class ItemMenuComponent { @Input() option: any; }
