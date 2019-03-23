import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RolesPage } from './roles.page';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [RolesPage],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild([{
      component: RolesPage,
      path: 'roles',
      children: [{
        path: '',
        pathMatch: 'full',
        redirectTo: '/roles/profile'
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
export class RolesPageModule { }
