import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { LoginPage } from './login.page';
import { RolesPageModule } from '../pages/roles/roles.module';

@NgModule({
  declarations: [LoginPage],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RolesPageModule,
    RouterModule.forChild([{
      component: LoginPage,
      path: ''
    }])
  ]
})
export class LoginPageModule { }
