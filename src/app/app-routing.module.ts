import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

@NgModule({
  imports: [RouterModule.forRoot([
    { path: '', loadChildren: './login/login.module#LoginPageModule' },
    { path: 'roles', loadChildren: './pages/roles/roles.module#RolesPageModule' }
  ], { preloadingStrategy: PreloadAllModules })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
