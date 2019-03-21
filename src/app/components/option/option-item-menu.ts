import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-option-item-menu', templateUrl: './option-item-menu.html', styleUrls: ['./option.scss']
})
export class OptionItemMenuComponent implements OnInit {

  @Input() option: any;
  constructor() { }
  ngOnInit() { }
}
