import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { HttpErrorInterceptor } from './components/utilities/http-error.interceptor';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { Network } from "@ionic-native/network/ngx";
import { NgModule } from '@angular/core';
import { RouteReuseStrategy } from '@angular/router';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { SQLite } from "@ionic-native/sqlite/ngx";
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { DatabaseService } from './services/db.service';
import { ItemMenuComponent } from './components/menu/item-menu';
import { Message } from './components/utilities/message';
import { SynchroizationService } from './services/synchronization.service';

@NgModule({
  bootstrap: [AppComponent],
  declarations: [AppComponent, ItemMenuComponent],
  imports: [AppRoutingModule, BrowserModule, HttpClientModule, IonicModule.forRoot()],
  providers: [DatabaseService, Message, Network, SplashScreen, SQLite, StatusBar, SynchroizationService, { provide: HTTP_INTERCEPTORS, useClass: HttpErrorInterceptor, multi: true }, { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }]
})
export class AppModule { }
