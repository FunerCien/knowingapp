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
          loadChildren: './pages/profiles/profiles.module#ProfilesPageModule',
          path: 'profiles'
        }
      ], {
        preloadingStrategy: PreloadAllModules
      }
    )
  ]
})
export class AppRoutingModule { }
