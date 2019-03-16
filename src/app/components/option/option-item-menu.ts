import { Component, Input, OnInit } from '@angular/core';

@Component({ selector: 'app-option-item-menu', templateUrl: './option-item-menu.html', })
export class OptionItemMenuComponent implements OnInit {

  @Input() option: any;
  constructor() { }
  ngOnInit() { }
}
