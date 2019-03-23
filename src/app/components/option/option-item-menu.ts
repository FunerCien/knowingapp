import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-option-item-menu',
  styleUrls: ['./option.scss'],
  templateUrl: './option-item-menu.html'
})
export class OptionItemMenuComponent { @Input() option: any; }
