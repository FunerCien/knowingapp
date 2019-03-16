import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';


import { PermitsPage } from './permits.page';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'permits', component: PermitsPage,
    children: [
      {
        path: 'option',
        children: [{ path: '', loadChildren: './option/option.module#OptionPageModule' }]
      },
      {
        path: 'profile',
        children: [{ path: '', loadChildren: './profile/profile.module#ProfilePageModule' }]
      },
      {
        path: '', redirectTo: '/permits/option', pathMatch: 'full'
      }
    ]
  }
];

@NgModule({
  imports: [
    IonicModule, CommonModule, FormsModule,
    RouterModule.forChild(routes)
  ],
  declarations: [PermitsPage]
})
export class PermitsPageModule { }
