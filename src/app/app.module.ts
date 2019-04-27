import { BrowserModule } from '@angular/platform-browser';
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
import { SynchroizationService } from './services/synchronization.service';
import { HttpClientModule } from '@angular/common/http';
import { Message } from './components/utilities/message';

@NgModule({
  bootstrap: [AppComponent],
  declarations: [
    AppComponent,
    ItemMenuComponent
  ],
  imports: [
    AppRoutingModule,
    BrowserModule,
    HttpClientModule,
    IonicModule.forRoot()
  ],
  providers: [
    DatabaseService,
    Network,
    SplashScreen,
    SQLite,
    StatusBar,
    Message,
    SynchroizationService,
    {
      provide: RouteReuseStrategy,
      useClass: IonicRouteStrategy
    }
  ]
})
export class AppModule { }
