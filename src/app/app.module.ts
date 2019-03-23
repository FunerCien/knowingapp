import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { OptionItemMenuComponent } from './components/option/option-item-menu';

@NgModule({
  bootstrap: [AppComponent],
  declarations: [
    AppComponent,
    OptionItemMenuComponent
  ],
  imports: [
    AppRoutingModule,
    BrowserModule,
    IonicModule.forRoot()
  ],
  providers: [
    SplashScreen,
    StatusBar,
    {
      provide: RouteReuseStrategy,
      useClass: IonicRouteStrategy
    }
  ]
})
export class AppModule { }
