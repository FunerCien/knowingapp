import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ProfileListPage } from './profile.list.page';
import { AdminProfilePage } from './admin/admin-profile.page';
import { Message } from 'src/app/components/utilities/message';
import { ProfileService } from './profile.service';
import { ChooseProfilePage } from './components/choose-profile.page';

@NgModule({
  declarations: [AdminProfilePage, ChooseProfilePage, ProfileListPage], entryComponents: [AdminProfilePage, ChooseProfilePage],
  imports: [CommonModule, FormsModule, IonicModule, ReactiveFormsModule, RouterModule.forChild([{
    component: ProfileListPage,
    path: ''
  }])],
  providers: [Message, ProfileService]
})
export class ProfilePageModule { }
