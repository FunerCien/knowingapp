import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PermitsByOptionPage } from './permits-option.page';

@NgModule({
  imports: [RouterModule.forChild([{ path: '', component: PermitsByOptionPage }]),
    IonicModule, CommonModule, FormsModule],
  declarations: [PermitsByOptionPage]
})
export class PermitsByOptionPageModule { }
