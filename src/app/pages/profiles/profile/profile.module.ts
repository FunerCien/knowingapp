import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ProfileListPage } from './profile.list.page';
import { AdminProfilePage } from './admin/admin-profile.page';

@NgModule({
  declarations: [
    AdminProfilePage,
    ProfileListPage
  ],
  entryComponents: [AdminProfilePage],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule,
    RouterModule.forChild([{
      component: ProfileListPage,
      path: ''
    }])
  ]
})
export class ProfilePageModule { }
