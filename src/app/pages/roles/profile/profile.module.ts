import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProfileListPage } from './profile.list.page';

@NgModule({
  imports: [
    IonicModule, CommonModule, FormsModule,
    RouterModule.forChild([{
      path: '', component: ProfileListPage
    }])
  ],
  declarations: [ProfileListPage]
})
export class ProfilePageModule { }
