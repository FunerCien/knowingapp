import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { OptionListPage } from './option.list.page';
import { PermitsByOptionPage } from './permits/permits-option.page';

@NgModule({
  declarations: [
    OptionListPage,
    PermitsByOptionPage
  ],
  entryComponents: [
    PermitsByOptionPage
  ],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild([{
      component: OptionListPage,
      path: ''
    }])
  ]
})
export class OptionPageModule { }
