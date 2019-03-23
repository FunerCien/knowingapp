import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

@NgModule({
  exports: [RouterModule],
  imports: [
    RouterModule.forRoot(
      [
        {
          loadChildren: './login/login.module#LoginPageModule',
          path: ''
        },
        {
          loadChildren: './pages/roles/roles.module#RolesPageModule',
          path: 'roles'
        }
      ], {
        preloadingStrategy: PreloadAllModules
      }
    )
  ]
})
export class AppRoutingModule { }
