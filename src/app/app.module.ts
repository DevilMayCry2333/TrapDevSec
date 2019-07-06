import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';

import { AboutPage } from '../pages/about/about';
import { ContactPage } from '../pages/contact/contact';
import { HomePage } from '../pages/home/home';
import { TabsPage } from '../pages/tabs/tabs';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { QRScanner } from "@ionic-native/qr-scanner";
import { ScanPage } from "../pages/scan/scan";
import { Geolocation } from "@ionic-native/geolocation";
import { HttpClientModule } from '@angular/common/http';
import {LoginPage} from "../pages/login/login";
import {Base} from "../common/base.js";
import {LocatePage} from "../pages/locate/locate";
import {CoordinateConvertor} from "../common/coordinate-convertor";
import {NativePageTransitions} from "@ionic-native/native-page-transitions";
import {CachePage} from "../pages/cache/cache";

import {File} from "@ionic-native/file";
import {FileTransfer} from "@ionic-native/file-transfer";
import {Camera} from "@ionic-native/camera";
import {MaintenancePage} from "../pages/maintenance/maintenance";
import {Diagnostic} from "@ionic-native/diagnostic";
import {DetailPage} from "../pages/detail/detail";
import {DeviceDataPage} from "../pages/device-data/device-data";
import { AppVersion } from '@ionic-native/app-version';
import { InAppBrowser } from '@ionic-native/in-app-browser';

@NgModule({
  declarations: [
    MyApp,
    AboutPage,
    ContactPage,
    HomePage,
    TabsPage,
    ScanPage,
    LoginPage,
    // DeviceBeetleFillPage,
    // DeviceForestFillPage,
    LocatePage,
    CachePage,
    // PhotoUploadPage,
    MaintenancePage,
    DetailPage,
    DeviceDataPage
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    IonicModule.forRoot(MyApp, {
      iconMode:'ios',
      mode:'ios',
      backButtonText: '返回'
    })
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    AboutPage,
    ContactPage,
    HomePage,
    TabsPage,
    ScanPage,
    LoginPage,
    // DeviceBeetleFillPage,
    // DeviceForestFillPage,
    LocatePage,
    CachePage,
    // PhotoUploadPage,
    MaintenancePage,
    DetailPage,
    DeviceDataPage
  ],
  providers: [
    InAppBrowser,
    AppVersion,
    StatusBar,
    SplashScreen,
    QRScanner,
    Geolocation,
    Base,
    CoordinateConvertor,
    NativePageTransitions,
    Diagnostic,
    Camera,
    File,
    FileTransfer,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}
