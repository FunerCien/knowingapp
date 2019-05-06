import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { LoginPage } from './login.page';
import { PermitsPageModule } from '../components/menu/permits/permits.module';

@NgModule({
  declarations: [LoginPage],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PermitsPageModule,
    RouterModule.forChild([{
      component: LoginPage,
      path: ''
    }])
  ]
})
export class LoginPageModule { }
