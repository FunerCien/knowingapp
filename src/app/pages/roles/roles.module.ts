import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RolesPage } from './roles.page';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [RouterModule.forChild([{
    path: 'roles', component: RolesPage,
    children: [{ path: '', redirectTo: '/roles/option', pathMatch: 'full' },
    {
      path: 'option', children: [{
        path: '', loadChildren: './option/option.module#OptionPageModule'
      }]
    },
    {
      path: 'option-permits/:id', children: [{
        path: '', loadChildren: './option/permits/permits-option.module#PermitsByOptionPageModule'
      }]
    },
    {
      path: 'profile', children: [{
        path: '', loadChildren: './profile/profile.module#ProfilePageModule'
      }]
    }
    ]
  }]),
    IonicModule, CommonModule, FormsModule
  ],
  declarations: [RolesPage]
})
export class RolesPageModule { }
