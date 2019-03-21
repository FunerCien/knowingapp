import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { OptionListPage } from './option.list.page';

@NgModule({
  imports: [RouterModule.forChild([{ path: '', component: OptionListPage }]),
    IonicModule, CommonModule, FormsModule],
  declarations: [OptionListPage]
})
export class OptionPageModule { }
