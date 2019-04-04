import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProfilesPage } from './profiles.page';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [ProfilesPage],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild([{
      component: ProfilesPage,
      path: 'profiles',
      children: [{
        path: '',
        pathMatch: 'full',
        redirectTo: '/profiles/profile'
      }, {
        children: [{
          loadChildren: './option/option.module#OptionPageModule',
          path: ''
        }],
        path: 'option'
      }, {
        children: [{
          loadChildren: './profile/profile.module#ProfilePageModule',
          path: ''
        }],
        path: 'profile'
      }]
    }])
  ]
})
export class ProfilesPageModule { }
