import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PermitsPage } from './permits.page';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [PermitsPage],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild([{
      component: PermitsPage,
      path: 'permits',
      children: [{
        path: '',
        pathMatch: 'full',
        redirectTo: '/permits/profile'
      }, {
        children: [{
          loadChildren: 'src/app/pages/profile/profile.module#ProfilePageModule',
          path: ''
        }],
        path: 'profile'
      }]
    }])
  ]
})
export class PermitsPageModule { }
