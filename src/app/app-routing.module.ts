import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule } from '@angular/router';

@NgModule({
  exports: [RouterModule],
  imports: [RouterModule.forRoot([{
    loadChildren: './login/login.module#LoginPageModule',
    path: ''
  }, {
    loadChildren: './components/menu/permits/permits.module#PermitsPageModule',
    path: 'permits'
  }], { preloadingStrategy: PreloadAllModules })]
})
export class AppRoutingModule { }
