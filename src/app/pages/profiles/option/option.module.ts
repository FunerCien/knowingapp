import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { OptionListPage } from './option.list.page';

@NgModule({
  declarations: [OptionListPage],
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
