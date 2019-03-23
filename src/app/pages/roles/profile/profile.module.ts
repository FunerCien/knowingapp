import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProfileListPage } from './profile.list.page';
import { PermitsByProfilePage } from './permits/permits-profile.page';

@NgModule({
  declarations: [
    PermitsByProfilePage,
    ProfileListPage
  ],
  entryComponents: [PermitsByProfilePage],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild([{
      component: ProfileListPage,
      path: ''
    }])
  ]
})
export class ProfilePageModule { }
