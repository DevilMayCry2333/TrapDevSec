webpackJsonp([0],{

/***/ 108:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return LocatePage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(7);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__ionic_native_geolocation__ = __webpack_require__(45);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__ionic_native_native_page_transitions__ = __webpack_require__(57);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__common_base_js__ = __webpack_require__(18);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__maintenance_maintenance__ = __webpack_require__(219);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};







/**
 * Generated class for the LocatePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
var LocatePage = /** @class */ (function () {
    function LocatePage(navCtrl, navParams, geolocation, nativePageTransitions, base, changeDetectorRef) {
        var _this = this;
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.geolocation = geolocation;
        this.nativePageTransitions = nativePageTransitions;
        this.base = base;
        this.changeDetectorRef = changeDetectorRef;
        // 是否定位成功
        this.location_ready = false;
        //username = '';
        // 经度
        this.longitude = '';
        // 纬度
        this.latitude = '';
        // 海拔
        this.altitude = '';
        // 精度
        this.accuracy = '';
        this.deviceId = '';
        this.belongs = false;
        this.callBack = function (params) {
            return new Promise(function (resolve, reject) {
                if (params) {
                    _this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_5__maintenance_maintenance__["a" /* MaintenancePage */], {
                        id: params.id, longitude: params.longitude,
                        latitude: params.latitude, altitude: params.altitude
                    });
                }
                else {
                }
            });
        };
        this.deviceId = this.navParams.get('id');
        // this.username = this.navParams.get('username');
        // this.belongs = this.navParams.get('belongs');
        // this.altitude='-10000';
        // this.latitude='null';
        // this.longitude='null';
        //this.accuracy='40';
        // this.location_ready=true;
        this.locate();
    }
    LocatePage.prototype.ionViewDidLoad = function () {
        console.log('ionViewDidLoad LocatePage');
    };
    LocatePage.prototype.locate = function () {
        var _this = this;
        var options = {
            enableHighAccuracy: true,
            timeout: 99999999,
            maximumAge: 0
        };
        var that = this;
        var watch = this.geolocation.watchPosition(options);
        this.subscription = watch.subscribe(function (data) {
            // data can be a set of coordinates, or an error (if an error occurred).
            if (data['coords']) {
                // setTimeout(() => {
                _this.latitude = String(data.coords.latitude);
                sessionStorage['latitude'] = String(data.coords.latitude);
                _this.longitude = String(data.coords.longitude);
                sessionStorage['longitude'] = String(data.coords.longitude);
                _this.altitude = String(data.coords.altitude);
                sessionStorage['altitude'] = String(data.coords.altitude);
                _this.accuracy = String(data.coords.accuracy);
                // 不是可以在这里直接判断海拔是不是null吗。。。。
                if (data.coords.altitude == null) {
                    _this.altitude = '-10000';
                    sessionStorage['altitude'] = '-10000';
                    //this.base.showAlert('提示','gps信号弱，请等待',()=>{});
                }
                setTimeout(function () {
                    //this.location_ready = true;
                    _this.location_ready = true;
                    that.changeDetectorRef.detectChanges();
                }, 5000);
                // document.getElementById('latitude').innerText="纬度:" + sessionStorage['latitude']
                // document.getElementById('longitude').innerText="经度:" + sessionStorage['longitude']
                // document.getElementById('altitude').innerText="海拔:" + sessionStorage['altitude']
                // document.getElementById('sumbit_button').removeAttribute('disabled')
                that.changeDetectorRef.detectChanges();
                // },5);
                // if(this.altitude==null){
                //   this.location_ready = false;
                //   this.base.showAlert('提示','海拔获取失败，请重新获取',()=>{});        
                // }
            }
            // else{
            //   this.base.showAlert('提示','gps信号弱，请等待',()=>{});
            // }
        }, function (res) {
            // setTimeout(() => {
            //    this.base.showAlert('提示','wu',()=>{});
            _this.location_ready = false;
            that.changeDetectorRef.detectChanges();
            // 这个是在数据更新后。。。强制刷一下页面。。。放在数据变更后才有用。。。
            // },5);
            // alert();
        });
    };
    LocatePage.prototype.scan = function () {
        // this.nativePageTransitions.slide(this.base.transitionOptions);
        this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_5__maintenance_maintenance__["a" /* MaintenancePage */], { callBack: this.callBack });
    };
    LocatePage.prototype.ionViewWillLeave = function () {
        if (this.subscription) {
            this.subscription.unsubscribe();
        }
    };
    LocatePage.prototype.fillMaintenanceData = function () {
        this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_5__maintenance_maintenance__["a" /* MaintenancePage */], {
            id: this.deviceId, longitude: this.longitude,
            latitude: this.latitude, altitude: this.altitude //,belongs:this.belongs//, username: this.username
        });
    };
    LocatePage = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["m" /* Component */])({
            selector: 'page-locate',template:/*ion-inline-start:"/Users/youkaiyu/Desktop/诱捕器项目/TrapAndroidFrontEnd的副本/src/pages/locate/locate.html"*/'<!--\n  Generated template for the LocatePage page.\n\n  See http://ionicframework.com/docs/components/#navigation for more info on\n  Ionic pages and navigation.\n-->\n<ion-header>\n\n  <ion-navbar>\n    <ion-title>定位</ion-title>\n  </ion-navbar>\n\n</ion-header>\n\n\n<ion-content padding>\n  <div *ngIf="!location_ready">尚未定位，不能提交数据</div>\n  <div *ngIf="location_ready">已定位</div>\n  <ion-list no-lines>\n    <ion-item id="longitude">经度:{{longitude}}</ion-item>\n    <ion-item id="latitude">纬度:{{latitude}}</ion-item>\n    <ion-item id="altitude">海拔:{{altitude}}</ion-item>\n    <ion-item id="accuracy">精度:{{accuracy}}</ion-item>\n    <!--<ion-item id="longitude">经度:</ion-item>-->\n    <!--<ion-item id="latitude">纬度:</ion-item>-->\n    <!--<ion-item id="altitude">海拔:</ion-item>-->\n    <!--<ion-item id="accuracy">精度:</ion-item>-->\n  </ion-list>\n  <button id="submit_button" ion-button block (click)="fillMaintenanceData()" [disabled]="!location_ready">提交信息</button>\n</ion-content>\n'/*ion-inline-end:"/Users/youkaiyu/Desktop/诱捕器项目/TrapAndroidFrontEnd的副本/src/pages/locate/locate.html"*/,
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["f" /* NavController */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["g" /* NavParams */], __WEBPACK_IMPORTED_MODULE_2__ionic_native_geolocation__["a" /* Geolocation */],
            __WEBPACK_IMPORTED_MODULE_3__ionic_native_native_page_transitions__["a" /* NativePageTransitions */], __WEBPACK_IMPORTED_MODULE_4__common_base_js__["a" /* Base */], __WEBPACK_IMPORTED_MODULE_0__angular_core__["j" /* ChangeDetectorRef */]])
    ], LocatePage);
    return LocatePage;
}());

//# sourceMappingURL=locate.js.map

/***/ }),

/***/ 110:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return DetailPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(7);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__angular_common_http__ = __webpack_require__(14);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__common_base_js__ = __webpack_require__(18);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__locate_locate__ = __webpack_require__(108);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};





/**
 * Generated class for the DetailPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
var DetailPage = /** @class */ (function () {
    function DetailPage(navCtrl, navParams, base, httpClient, changeDetectorRef) {
        /*
        this.isLogin = sessionStorage['isLogin']
        this.deviceId = this.navParams.get('id')
        var that = this
        this.httpClient.get(base.BASE_URL + "scanned",{params:new HttpParams({fromObject: {id: this.deviceId, page: '1', limit: '9999'}})})
          .subscribe(res=> {
            this.dataList = res['data']
            that.changeDetectorRef.detectChanges()
          })
    
        // 登录后才有token
        if (sessionStorage['isLogin']) {
          this.httpClient.get(base.BASE_URL + "auth_api/test_belongings", {
            headers: {token: localStorage['token']},
            params: new HttpParams({fromObject: {deviceId: this.deviceId}})
          })
            .subscribe(res => {
              if (!res['data']) {
                this.belongs = false;
    
              } else {
                this.belongs = true;
              }
              that.changeDetectorRef.detectChanges()
            })
        }
        */
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.base = base;
        this.httpClient = httpClient;
        this.changeDetectorRef = changeDetectorRef;
        this.isLogin = 'false';
        this.workingContentDict = ['首次悬挂诱捕器', '换药+收虫', '收虫', '其他'];
        this.belongs = true;
        this.sum = 0;
    }
    DetailPage.prototype.ionViewDidLoad = function () {
        console.log('ionViewDidLoad DetailPage');
    };
    DetailPage.prototype.ionViewWillEnter = function () {
        var _this = this;
        var that = this;
        //this.belongs = false;
        that.changeDetectorRef.detectChanges();
        this.isLogin = sessionStorage['isLogin'];
        this.deviceId = this.navParams.get('id');
        this.httpClient.get(this.base.BASE_URL + "scanned", { params: new __WEBPACK_IMPORTED_MODULE_2__angular_common_http__["c" /* HttpParams */]({ fromObject: { id: this.deviceId, page: '1', limit: '9999' } }) })
            .subscribe(function (res) {
            _this.dataList = res['data'];
            _this.sum = 0;
            for (var i = 0; i < _this.dataList.length; ++i) {
                _this.sum += _this.dataList[i].num;
            }
            //   this.username = this.dataList[0].username;
            that.changeDetectorRef.detectChanges();
        });
        // 登录后才有token
        if (this.isLogin == 'true') {
            this.httpClient.get(this.base.BASE_URL + "auth_api/test_belongings", {
                headers: { token: localStorage['token'] },
                params: new __WEBPACK_IMPORTED_MODULE_2__angular_common_http__["c" /* HttpParams */]({ fromObject: { deviceId: this.deviceId } })
            })
                .subscribe(function (res) {
                if (!res['data']) {
                    _this.belongs = false;
                }
                else {
                    _this.belongs = true;
                }
                that.changeDetectorRef.detectChanges();
            }, function () {
                // 联网失败的时候，暂且让录入数据的按钮亮起来
                _this.belongs = true;
                that.changeDetectorRef.detectChanges();
            });
        }
    };
    DetailPage.prototype.locate = function () {
        this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_4__locate_locate__["a" /* LocatePage */], { id: this.deviceId //,belongs:this.belongs//,username:this.username
        });
    };
    DetailPage = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["m" /* Component */])({
            selector: 'page-detail',template:/*ion-inline-start:"/Users/youkaiyu/Desktop/诱捕器项目/TrapAndroidFrontEnd的副本/src/pages/detail/detail.html"*/'<!--\n  Generated template for the DetailPage page.\n\n  See http://ionicframework.com/docs/components/#navigation for more info on\n  Ionic pages and navigation.\n-->\n<ion-header>\n\n  <ion-navbar>\n    <ion-title>设备信息</ion-title>\n  </ion-navbar>\n\n</ion-header>\n\n\n<ion-content padding>\n  <button ion-button (click)="locate()" [disabled]="!belongs">录入数据</button>\n  <div>\n    <div>\n      设备id: {{deviceId}}\n    </div>\n    <div>\n      松墨天牛数量: {{sum}}\n    </div>\n  </div>\n\n  <div style="width: 100%">\n    <table border="1" style="table-layout:fixed" width="100%">\n      <thead>\n      <th>批次</th>\n      <th>经度</th>\n      <th>纬度</th>\n      <th>数量</th>\n      <th>工作内容</th>\n      <th>药剂类型</th>\n      <th>日期</th>\n      </thead>\n      <tbody>\n      <tr *ngFor="let item of dataList">\n        <th>{{item.batch}}</th>\n        <th>{{item.longitude}}</th>\n        <th>{{item.latitude}}</th>\n        <th>{{item.num}}</th>\n        <th>{{workingContentDict[item.workingContent]}}</th>\n        <th>{{item.drug}}</th>\n        <th>{{item.date}}</th>\n      </tr>\n      </tbody>\n    </table>\n\n  </div>\n\n  <!--<ion-list *ngFor="let item of dataList">-->\n    <!--<ion-item style="font-size: 10px">批次:{{item.batch}} 经度:{{item.longitue}} 纬度: {{item.latitude}} 日期:{{item.date}}</ion-item>-->\n  <!--</ion-list>-->\n</ion-content>\n'/*ion-inline-end:"/Users/youkaiyu/Desktop/诱捕器项目/TrapAndroidFrontEnd的副本/src/pages/detail/detail.html"*/,
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["f" /* NavController */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["g" /* NavParams */], __WEBPACK_IMPORTED_MODULE_3__common_base_js__["a" /* Base */], __WEBPACK_IMPORTED_MODULE_2__angular_common_http__["a" /* HttpClient */],
            __WEBPACK_IMPORTED_MODULE_0__angular_core__["j" /* ChangeDetectorRef */]])
    ], DetailPage);
    return DetailPage;
}());

//# sourceMappingURL=detail.js.map

/***/ }),

/***/ 122:
/***/ (function(module, exports) {

function webpackEmptyAsyncContext(req) {
	// Here Promise.resolve().then() is used instead of new Promise() to prevent
	// uncatched exception popping up in devtools
	return Promise.resolve().then(function() {
		throw new Error("Cannot find module '" + req + "'.");
	});
}
webpackEmptyAsyncContext.keys = function() { return []; };
webpackEmptyAsyncContext.resolve = webpackEmptyAsyncContext;
module.exports = webpackEmptyAsyncContext;
webpackEmptyAsyncContext.id = 122;

/***/ }),

/***/ 164:
/***/ (function(module, exports) {

function webpackEmptyAsyncContext(req) {
	// Here Promise.resolve().then() is used instead of new Promise() to prevent
	// uncatched exception popping up in devtools
	return Promise.resolve().then(function() {
		throw new Error("Cannot find module '" + req + "'.");
	});
}
webpackEmptyAsyncContext.keys = function() { return []; };
webpackEmptyAsyncContext.resolve = webpackEmptyAsyncContext;
module.exports = webpackEmptyAsyncContext;
webpackEmptyAsyncContext.id = 164;

/***/ }),

/***/ 18:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return Base; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(7);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__ionic_native_file__ = __webpack_require__(44);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};



var Base = /** @class */ (function () {
    function Base(alertCtrl, file) {
        this.alertCtrl = alertCtrl;
        this.file = file;
        this.BASE_URL = "http://39.108.184.47:8081/";
        // BASE_URL = "http://localhost:8081/"
        this.transitionOptions = {
            direction: 'left',
            duration: 200,
            slowdownfactor: 3,
            slidePixels: 20,
            iosdelay: 0,
            androiddelay: 0,
            fixedPixelsTop: 0,
            fixedPixelsBottom: 60
        };
    }
    Base.prototype.showAlert = function (title, content, func) {
        var alert = this.alertCtrl.create({
            title: title,
            subTitle: content,
            buttons: [{ text: '确认', handler: func }]
        });
        alert.present();
    };
    Base.prototype.readLogger = function (filename) {
        this.file.readAsText(this.file.externalDataDirectory, filename).then(function (success) {
            console.log(success);
            return success;
        });
        return "";
    };
    Base.prototype.logger = function (info, storage) {
        var that = this;
        this.file.checkFile(this.file.externalDataDirectory, storage).then(function (success) {
            console.log(success);
            that.file.writeFile(that.file.externalDataDirectory, storage, '[' + info + '],', { append: true }).then(function (success) {
                console.log(success);
                // success
            }, function (error) {
                console.log(error);
                // error
            });
        }, function (err) {
            console.log(err);
            that.file.writeFile(that.file.externalDataDirectory, storage, '[' + info + '],', { replace: true }).then(function (success) {
                console.log(success);
                // success
            }, function (error) {
                console.log(error);
                // error
            });
        });
    };
    Base.prototype.showPrompt = function (title, myName, func1, func2) {
        var prompt = this.alertCtrl.create({
            title: title,
            inputs: [
                {
                    type: 'text',
                    name: myName,
                    placeholder: '设备id'
                }
            ],
            buttons: [
                {
                    text: '取消',
                    handler: func2
                },
                {
                    text: '确认',
                    handler: function (data) {
                        func1(data);
                    }
                }
            ]
        });
        prompt.present();
    };
    Base.prototype.showConfirmAlert = function (title, content, func1, func2) {
        var confirm = this.alertCtrl.create({
            title: title,
            message: content,
            buttons: [
                {
                    text: '取消',
                    handler: func2
                },
                {
                    text: '确认',
                    handler: function () {
                        func1(confirm);
                    }
                }
            ]
        });
        confirm.present();
    };
    Base.popTo = function (navCtrl, name) {
        var views = navCtrl.getViews();
        var target = -1;
        for (var i = 0; i < views.length; ++i) {
            if (views[i].name == name) {
                target = i;
                break;
            }
        }
        if (target >= 0) {
            navCtrl.popTo(navCtrl.getByIndex(target)).then(function () { });
        }
    };
    Base = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["A" /* Injectable */])(),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["a" /* AlertController */], __WEBPACK_IMPORTED_MODULE_2__ionic_native_file__["a" /* File */]])
    ], Base);
    return Base;
}());

//# sourceMappingURL=base.js.js.map

/***/ }),

/***/ 207:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return NewHomePage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_common_http__ = __webpack_require__(14);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_ionic_angular__ = __webpack_require__(7);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__newSwitchProject_newSwitchProject__ = __webpack_require__(208);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};




var NewHomePage = /** @class */ (function () {
    function NewHomePage(httpClient, navCtl) {
        this.httpClient = httpClient;
        this.navCtl = navCtl;
    }
    NewHomePage.prototype.login = function () {
        var _this = this;
        console.log(this.username);
        console.log(this.password);
        this.httpClient.post("http://192.168.31.254:8081/" + 'login', {}, { params: new __WEBPACK_IMPORTED_MODULE_1__angular_common_http__["c" /* HttpParams */]({ fromObject: { username: this.username, password: this.password } }) })
            .subscribe(function (res) {
            console.log(res);
            console.log(res['token']);
            localStorage['token'] = res['token'];
            // 直接把用户名密码存了
            localStorage['username'] = _this.username;
            localStorage['password'] = _this.password;
            sessionStorage['isLogin'] = true;
            _this.navCtl.push(__WEBPACK_IMPORTED_MODULE_3__newSwitchProject_newSwitchProject__["a" /* switchProjectPage */]);
        }, function (res) {
            console.log(res);
        });
    };
    NewHomePage = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["m" /* Component */])({
            selector: 'app-home',template:/*ion-inline-start:"/Users/youkaiyu/Desktop/诱捕器项目/TrapAndroidFrontEnd的副本/src/pages/newhome/newhome.html"*/'<ion-header>\n    <ion-toolbar>\n        <ion-title>\n            请登录\n        </ion-title>\n    </ion-toolbar>\n</ion-header>\n\n<ion-content>\n    <!-- <div class="ion-padding">\n    The world is your oyster.\n    <p>If you get lost, the <a target="_blank" rel="noopener" href="https://ionicframework.com/docs/">docs</a> will be your guide.</p>\n  </div> -->\n    <ion-card>\n        <ion-card-header>\n            <ion-card-title>请先登录系统!</ion-card-title>\n        </ion-card-header>\n        <ion-item>\n            <ion-label>用户名</ion-label>\n            <ion-input [(ngModel)]="username"></ion-input>\n        </ion-item>\n        <ion-item>\n            <ion-label>密码</ion-label>\n            <ion-input type="password" [(ngModel)]="password"></ion-input>\n        </ion-item>\n        <button ion-button (click)="login()">登录</button>\n\n        <ion-card-content>\n        </ion-card-content>\n    </ion-card>\n\n</ion-content>\n'/*ion-inline-end:"/Users/youkaiyu/Desktop/诱捕器项目/TrapAndroidFrontEnd的副本/src/pages/newhome/newhome.html"*/
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1__angular_common_http__["a" /* HttpClient */], __WEBPACK_IMPORTED_MODULE_2_ionic_angular__["f" /* NavController */]])
    ], NewHomePage);
    return NewHomePage;
}());

//# sourceMappingURL=newhome.js.map

/***/ }),

/***/ 208:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return switchProjectPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(7);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__newTrap_newTrap__ = __webpack_require__(209);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__newDry_newDry__ = __webpack_require__(210);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__newEnemy_newEnemy__ = __webpack_require__(211);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__newDeadTree_newDeadTree__ = __webpack_require__(212);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__newTrack_newTrack__ = __webpack_require__(213);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__angular_common_http__ = __webpack_require__(14);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};








var switchProjectPage = /** @class */ (function () {
    function switchProjectPage(navCtl, httpClient) {
        this.navCtl = navCtl;
        this.httpClient = httpClient;
    }
    switchProjectPage.prototype.ionViewDidLoad = function () {
        this.httpClient.post("http://192.168.31.254:8081/app/" + 'getMyDevice', {}, {
            headers: { token: localStorage['token'] },
            params: new __WEBPACK_IMPORTED_MODULE_7__angular_common_http__["c" /* HttpParams */]({ fromObject: { worker: localStorage['username'] } })
        })
            .subscribe(function (res) {
            console.log(res);
            localStorage['device'] = JSON.stringify(res);
        }, function (res) {
            console.log(res);
        });
    };
    switchProjectPage.prototype.trapClick = function () {
        console.log("trap");
        this.navCtl.push(__WEBPACK_IMPORTED_MODULE_2__newTrap_newTrap__["a" /* TrapPage */]);
    };
    switchProjectPage.prototype.dryClick = function () {
        this.navCtl.push(__WEBPACK_IMPORTED_MODULE_3__newDry_newDry__["a" /* DryPage */]);
    };
    switchProjectPage.prototype.deadClick = function () {
        this.navCtl.push(__WEBPACK_IMPORTED_MODULE_5__newDeadTree_newDeadTree__["a" /* DeadtreePage */]);
    };
    switchProjectPage.prototype.enemyClick = function () {
        this.navCtl.push(__WEBPACK_IMPORTED_MODULE_4__newEnemy_newEnemy__["a" /* EnemyPage */]);
    };
    switchProjectPage.prototype.trackClick = function () {
        this.navCtl.push(__WEBPACK_IMPORTED_MODULE_6__newTrack_newTrack__["a" /* TrackPage */]);
    };
    switchProjectPage = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["m" /* Component */])({
            selector: 'app-switchProject',template:/*ion-inline-start:"/Users/youkaiyu/Desktop/诱捕器项目/TrapAndroidFrontEnd的副本/src/pages/newSwitchProject/newSwitchProject.html"*/'<ion-header>\n    <ion-toolbar>\n        <ion-title>\n            Ionic Blank\n        </ion-title>\n    </ion-toolbar>\n</ion-header>\n\n<ion-content>\n    <!-- <div class="ion-padding">\n    The world is your oyster.\n    <p>If you get lost, the <a target="_blank" rel="noopener" href="https://ionicframework.com/docs/">docs</a> will be your guide.</p>\n  </div> -->\n    <ion-card>\n        <ion-card-header>\n            <ion-card-title>请选择功能</ion-card-title>\n        </ion-card-header>\n\n        <ion-card-content>\n            <button ion-button shape="round" fill="outline" (click)="trapClick()">诱捕器管理</button>\n            <br />\n            <button ion-button shape="round" fill="outline" (click)="dryClick()">注干剂监测</button>\n            <br />\n            <button ion-button shape="round" fill="outline" (click)="deadClick()">枯死树采伐</button>\n            <br />\n            <button ion-button shape="round" fill="outline" (click)="enemyClick()">天敌防治</button>\n            <br />\n            <button ion-button shape="round" fill="outline" (click)="trackClick()">轨迹追踪</button>\n            <br />\n        </ion-card-content>\n    </ion-card>\n\n</ion-content>\n'/*ion-inline-end:"/Users/youkaiyu/Desktop/诱捕器项目/TrapAndroidFrontEnd的副本/src/pages/newSwitchProject/newSwitchProject.html"*/,
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["f" /* NavController */], __WEBPACK_IMPORTED_MODULE_7__angular_common_http__["a" /* HttpClient */]])
    ], switchProjectPage);
    return switchProjectPage;
}());

//# sourceMappingURL=newSwitchProject.js.map

/***/ }),

/***/ 209:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return TrapPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__ionic_native_qr_scanner__ = __webpack_require__(55);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_ionic_angular__ = __webpack_require__(7);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__angular_common_http__ = __webpack_require__(14);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__scan_scan__ = __webpack_require__(56);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__common_base_js__ = __webpack_require__(18);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__ionic_native_geolocation__ = __webpack_require__(45);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__ionic_native_camera__ = __webpack_require__(107);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};









var TrapPage = /** @class */ (function () {
    function TrapPage(navCtrl, qrScanner, base, geolocation, changeDetectorRef, httpClient, camera) {
        var _this = this;
        this.navCtrl = navCtrl;
        this.qrScanner = qrScanner;
        this.base = base;
        this.geolocation = geolocation;
        this.changeDetectorRef = changeDetectorRef;
        this.httpClient = httpClient;
        this.camera = camera;
        // 是否定位成功
        this.location_ready = false;
        this.users = [
            {
                id: 1,
                first: 'Alice',
                last: 'Smith',
            },
            {
                id: 2,
                first: 'Bob',
                last: 'Davis',
            },
            {
                id: 3,
                first: 'Charlie',
                last: 'Rosenburg',
            }
        ];
        this.callBack = function (params) {
            return new Promise(function (resolve, reject) {
                if (params) {
                    console.log(params.id);
                    var allDevice = JSON.parse(localStorage["device"]);
                    console.log(localStorage["device"]);
                    console.log("Array");
                    console.log(allDevice[0]);
                    var flag = 0;
                    allDevice.forEach(function (element) {
                        console.log("element");
                        console.log(element);
                        if (element.id == params.id)
                            flag = 1;
                    });
                    if (flag == 1) {
                        _this.deviceId = params.id;
                        var options = {
                            enableHighAccuracy: true,
                            timeout: 99999999,
                            maximumAge: 0
                        };
                        var that_1 = _this;
                        var watch = _this.geolocation.watchPosition(options);
                        _this.subscription = watch.subscribe(function (data) {
                            // data can be a set of coordinates, or an error (if an error occurred).
                            if (data['coords']) {
                                // setTimeout(() => {
                                _this.latitude = String(data.coords.latitude);
                                sessionStorage['latitude'] = String(data.coords.latitude);
                                _this.longtitude = String(data.coords.longitude);
                                sessionStorage['longitude'] = String(data.coords.longitude);
                                _this.altitude = String(data.coords.altitude);
                                sessionStorage['altitude'] = String(data.coords.altitude);
                                _this.accuracy = String(data.coords.accuracy);
                                // 不是可以在这里直接判断海拔是不是null吗。。。。
                                if (data.coords.altitude == null) {
                                    _this.altitude = '-10000';
                                    sessionStorage['altitude'] = '-10000';
                                    //this.base.showAlert('提示','gps信号弱，请等待',()=>{});
                                }
                                setTimeout(function () {
                                    //this.location_ready = true;
                                    _this.location_ready = true;
                                    that_1.changeDetectorRef.detectChanges();
                                }, 5000);
                                // document.getElementById('latitude').innerText="纬度:" + sessionStorage['latitude']
                                // document.getElementById('longitude').innerText="经度:" + sessionStorage['longitude']
                                // document.getElementById('altitude').innerText="海拔:" + sessionStorage['altitude']
                                // document.getElementById('sumbit_button').removeAttribute('disabled')
                                that_1.changeDetectorRef.detectChanges();
                                // },5);
                                // if(this.altitude==null){
                                //   this.location_ready = false;
                                //   this.base.showAlert('提示','海拔获取失败，请重新获取',()=>{});        
                                // }
                            }
                            // else{
                            //   this.base.showAlert('提示','gps信号弱，请等待',()=>{});
                            // }
                        }, function (res) {
                            // setTimeout(() => {
                            //    this.base.showAlert('提示','wu',()=>{});
                            _this.location_ready = false;
                            that_1.changeDetectorRef.detectChanges();
                            // 这个是在数据更新后。。。强制刷一下页面。。。放在数据变更后才有用。。。
                            // },5);
                            // alert();
                        });
                        _this.base.showConfirmAlert("成功", params.id, function () {
                        }, function () { });
                    }
                    else {
                        _this.base.showConfirmAlert("二维码无效", params.id, function () {
                        }, function () { });
                    }
                }
                else {
                }
            });
        };
    }
    TrapPage.prototype.takePhoto = function () {
        var _this = this;
        var options = {
            quality: 10,
            destinationType: this.camera.DestinationType.FILE_URI,
            sourceType: 1,
            encodingType: this.camera.EncodingType.JPEG,
            mediaType: this.camera.MediaType.PICTURE,
            allowEdit: false,
            correctOrientation: true
        };
        this.camera.getPicture(options).then(function (imageData) {
            // this.submit(imageData)
            // this.navCtrl.popToRoot()
            _this.imageData = imageData;
        }, function (err) {
            // Handle error
            // this.navCtrl.popToRoot()
        }).catch(function (error) {
            console.log(error);
        });
    };
    TrapPage.prototype.ionViewDidLoad = function () {
        var _this = this;
        console.log('ionViewDidLoad LocatePage');
        console.log(localStorage['device']);
        this.httpClient.post("http://192.168.31.254:8081/app/" + 'getBeetle', {}, { headers: { token: localStorage['token'] },
            params: new __WEBPACK_IMPORTED_MODULE_3__angular_common_http__["c" /* HttpParams */]({ fromObject: { username: localStorage['username'] } }) })
            .subscribe(function (res) {
            var c = res;
            _this.otherbettleType = Array.from(c);
            console.log(_this.otherbettleType);
        }, function (res) {
            console.log(res);
        });
        this.httpClient.post("http://192.168.31.254:8081/app/" + 'getInject', {}, {
            headers: { token: localStorage['token'] },
            params: new __WEBPACK_IMPORTED_MODULE_3__angular_common_http__["c" /* HttpParams */]({ fromObject: { username: localStorage['username'] } })
        })
            .subscribe(function (res) {
            var c = res;
            _this.injectType = Array.from(c);
            console.log(_this.injectType);
        }, function (res) {
            console.log(res);
        });
        this.httpClient.post("http://192.168.31.254:8081/app/" + 'getWorkContent', {}, {
            headers: { token: localStorage['token'] },
            params: new __WEBPACK_IMPORTED_MODULE_3__angular_common_http__["c" /* HttpParams */]({ fromObject: { username: localStorage['username'] } })
        })
            .subscribe(function (res) {
            var c = res;
            _this.workContent = Array.from(c);
            console.log(_this.workContent);
        }, function (res) {
            console.log(res);
        });
    };
    TrapPage.prototype.trapClick = function () {
        console.log("trap");
    };
    TrapPage.prototype.scan = function () {
        console.log("scan");
        console.log(localStorage['username']);
        this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_4__scan_scan__["a" /* ScanPage */], { callBack: this.callBack });
    };
    TrapPage.prototype.deviceIdInput = function () {
        console.log("ok");
        console.log(this.deviceId);
    };
    TrapPage.prototype.deviceSerialInput = function () {
        console.log(this.deviceSerial);
    };
    TrapPage = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["m" /* Component */])({
            selector: 'app-home',template:/*ion-inline-start:"/Users/youkaiyu/Desktop/诱捕器项目/TrapAndroidFrontEnd的副本/src/pages/newTrap/newTrap.html"*/'<ion-header>\n    <ion-toolbar>\n        <ion-title>\n            诱捕器管理\n        </ion-title>\n    </ion-toolbar>\n</ion-header>\n\n<ion-content>\n    <ion-card>\n        <ion-card-content>\n            <h3>设备管理</h3>\n            <ion-item>\n                <ion-label>设备ID</ion-label>\n                <ion-input [(ngModel)]="deviceId" (ionChange)="deviceIdInput()"></ion-input>\n             \n            </ion-item>\n               <button ion-button (click)="scan()">扫描</button>\n            <ion-item>\n                <ion-label>设备编号</ion-label>\n                <ion-input [(ngModel)]="deviceSerial" (ionChange)="deviceSerialInput()"></ion-input>\n            </ion-item>\n             <button ion-button>绑定</button>\n\n        </ion-card-content>\n    </ion-card>\n    <ion-card>\n        <ion-card-content>\n            <h3>维护信息</h3>\n            <ion-item>\n                <ion-label>经度</ion-label>\n                <ion-input disabled="true" [(ngModel)]="longtitude"></ion-input>\n            </ion-item>\n            <ion-item>\n                <ion-label>纬度</ion-label>\n                <ion-input disabled="true" [(ngModel)]="latitude"></ion-input>\n            </ion-item>\n            <ion-item>\n                <ion-label>海拔</ion-label>\n                <ion-input disabled="true" [(ngModel)]="altitude"></ion-input>\n            </ion-item>\n            <ion-item>\n                <ion-label>精度</ion-label>\n                <ion-input disabled="true" [(ngModel)]="accuracy"></ion-input>\n            </ion-item>\n            <ion-item>\n                <ion-label>松墨天牛</ion-label>\n                <ion-input [(ngModel)]="newbettle"></ion-input>\n            </ion-item>\n            <ion-item>\n                <ion-label>其他天牛</ion-label>\n                <ion-input [(ngModel)]="otherbettle"></ion-input>\n            </ion-item>\n            <ion-item>\n                <ion-label>类型</ion-label>\n                <ion-select>\n                    <ion-option *ngFor="let user of otherbettleType">{{user.name}}</ion-option>\n                </ion-select>\n            </ion-item>\n            <ion-item>\n                <ion-label>药剂类型</ion-label>\n                <ion-select>\n                    <ion-option *ngFor="let user of injectType">{{user.name}}</ion-option>\n                </ion-select>\n            </ion-item>\n            <ion-item>\n                <ion-label>工作内容</ion-label>\n                <ion-select>\n                    <ion-option *ngFor="let user of workContent">{{user.name}}</ion-option>\n                </ion-select>\n            </ion-item>\n            <ion-item>\n                <ion-label>备注</ion-label>\n                <ion-input [(ngModel)]="remarks"></ion-input>\n            </ion-item>\n            <button ion-button (click)="takePhoto()">拍照</button>\n            <button ion-button>提交</button>\n            <button ion-button>地图查看</button>\n        </ion-card-content>\n    </ion-card>\n\n\n</ion-content>\n'/*ion-inline-end:"/Users/youkaiyu/Desktop/诱捕器项目/TrapAndroidFrontEnd的副本/src/pages/newTrap/newTrap.html"*/,
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_2_ionic_angular__["f" /* NavController */],
            __WEBPACK_IMPORTED_MODULE_1__ionic_native_qr_scanner__["a" /* QRScanner */],
            __WEBPACK_IMPORTED_MODULE_5__common_base_js__["a" /* Base */],
            __WEBPACK_IMPORTED_MODULE_6__ionic_native_geolocation__["a" /* Geolocation */],
            __WEBPACK_IMPORTED_MODULE_0__angular_core__["j" /* ChangeDetectorRef */],
            __WEBPACK_IMPORTED_MODULE_3__angular_common_http__["a" /* HttpClient */],
            __WEBPACK_IMPORTED_MODULE_7__ionic_native_camera__["a" /* Camera */]])
    ], TrapPage);
    return TrapPage;
}());

//# sourceMappingURL=newTrap.js.map

/***/ }),

/***/ 210:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return DryPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};

var DryPage = /** @class */ (function () {
    function DryPage() {
        this.users = [
            {
                id: 1,
                first: 'Alice',
                last: 'Smith',
            },
            {
                id: 2,
                first: 'Bob',
                last: 'Davis',
            },
            {
                id: 3,
                first: 'Charlie',
                last: 'Rosenburg',
            }
        ];
    }
    DryPage.prototype.dryClick = function () {
        console.log("dry");
    };
    DryPage.prototype.deviceIdInput = function () {
        console.log("ok");
        console.log(this.deviceId);
    };
    DryPage.prototype.deviceSerialInput = function () {
        console.log(this.deviceSerial);
    };
    DryPage = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["m" /* Component */])({
            selector: 'app-home',template:/*ion-inline-start:"/Users/youkaiyu/Desktop/诱捕器项目/TrapAndroidFrontEnd的副本/src/pages/newDry/newDry.html"*/'<ion-header>\n    <ion-toolbar>\n        <ion-title>\n            注干剂检测\n        </ion-title>\n    </ion-toolbar>\n</ion-header>\n\n<ion-content>\n    <ion-card>\n        <ion-card-content>\n            <h3>设备管理</h3>\n            <ion-item>\n                <ion-label>设备ID：</ion-label>\n                <ion-input [(ngModel)]="deviceId" (ionChange)="deviceIdInput()"></ion-input>\n                <ion-icon name="qr-scanner"></ion-icon>\n            </ion-item>\n\n            <ion-item>\n                <ion-label>设备编号：</ion-label>\n                <ion-input [(ngModel)]="deviceSerial" (ionChange)="deviceSerialInput()"></ion-input>\n                <ion-icon name="search"></ion-icon>\n            </ion-item>\n            <button size="large" expand="block">绑定</button>\n\n        </ion-card-content>\n    </ion-card>\n\n    <ion-card>\n        <ion-card-content>\n            <h3>维护信息</h3>\n            <ion-item>\n                <ion-label>经度:</ion-label>\n                <ion-input disabled="true" [(ngModel)]="longtitude"></ion-input>\n            </ion-item>\n            <ion-item>\n                <ion-label>纬度:</ion-label>\n                <ion-input disabled="true" [(ngModel)]="latitude"></ion-input>\n            </ion-item>\n            <ion-item>\n                <ion-label>海拔:</ion-label>\n                <ion-input disabled="true" [(ngModel)]="altitude"></ion-input>\n            </ion-item>\n            <ion-item>\n                <ion-label>精度:</ion-label>\n                <ion-input disabled="true" [(ngModel)]="accuracy"></ion-input>\n            </ion-item>\n\n            <ion-item>\n                <ion-label>树木状态：</ion-label>\n                <!-- <ion-select [compareWith]="compareWith">\n                    <ion-select-option *ngFor="let user of users">{{user.first + \' \' + user.last}}</ion-select-option>\n                </ion-select> -->\n            </ion-item>\n\n            <ion-item>\n                <ion-label>注剂数量:</ion-label>\n                <ion-input [(ngModel)]="newbettle"></ion-input>\n            </ion-item>\n\n\n\n            <ion-item>\n                <ion-label>工作内容</ion-label>\n                <!-- <ion-select [compareWith]="compareWith">\n                    <ion-select-option *ngFor="let user of users">{{user.first + \' \' + user.last}}</ion-select-option>\n                </ion-select> -->\n            </ion-item>\n            <ion-item>\n                <ion-label>备注</ion-label>\n                <ion-input [(ngModel)]="accuracy"></ion-input>\n            </ion-item>\n        </ion-card-content>\n    </ion-card>\n\n    <button size="large" expand="full">\n        <ion-label>拍照</ion-label>\n        <ion-icon name="camera"></ion-icon>\n    </button>\n\n    <button size="large" expand="full">\n        <ion-label>提交</ion-label>\n    </button>\n\n    <button size="large" expand="block">\n        <ion-label>地图查看</ion-label>\n    </button>\n\n</ion-content>\n'/*ion-inline-end:"/Users/youkaiyu/Desktop/诱捕器项目/TrapAndroidFrontEnd的副本/src/pages/newDry/newDry.html"*/
        }),
        __metadata("design:paramtypes", [])
    ], DryPage);
    return DryPage;
}());

//# sourceMappingURL=newDry.js.map

/***/ }),

/***/ 211:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return EnemyPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};

var EnemyPage = /** @class */ (function () {
    function EnemyPage() {
        this.users = [
            {
                id: 1,
                first: 'Alice',
                last: 'Smith',
            },
            {
                id: 2,
                first: 'Bob',
                last: 'Davis',
            },
            {
                id: 3,
                first: 'Charlie',
                last: 'Rosenburg',
            }
        ];
    }
    EnemyPage.prototype.enemyClick = function () {
        console.log("enemy");
    };
    EnemyPage.prototype.deviceIdInput = function () {
        console.log("ok");
        console.log(this.deviceId);
    };
    EnemyPage.prototype.deviceSerialInput = function () {
        console.log(this.deviceSerial);
    };
    EnemyPage = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["m" /* Component */])({
            selector: 'app-home',template:/*ion-inline-start:"/Users/youkaiyu/Desktop/诱捕器项目/TrapAndroidFrontEnd的副本/src/pages/newEnemy/newEnemy.html"*/'<ion-header>\n    <ion-toolbar>\n        <ion-title>\n            天敌防治\n        </ion-title>\n    </ion-toolbar>\n</ion-header>\n\n<ion-content>\n    <ion-card>\n        <ion-card-content>\n            <h3>设备管理:</h3>\n            <ion-item>\n                <ion-label>设备ID:</ion-label>\n                <ion-input [(ngModel)]="deviceId" (ionChange)="deviceIdInput()"></ion-input>\n                <ion-icon name="qr-scanner"></ion-icon>\n\n            </ion-item>\n            <ion-item>\n                <ion-label>设备编号:</ion-label>\n                <ion-input [(ngModel)]="deviceSerial" (ionChange)="deviceSerialInput()"></ion-input>\n                <ion-icon name="search"></ion-icon>\n            </ion-item>\n            <button size="large" expand="block">绑定</button>\n\n        </ion-card-content>\n    </ion-card>\n    <ion-card>\n        <ion-card-content>\n            <h3>维护信息</h3>\n            <ion-item>\n                <ion-label>经度:</ion-label>\n                <ion-input disabled="true" [(ngModel)]="longtitude"></ion-input>\n            </ion-item>\n            <ion-item>\n                <ion-label>纬度:</ion-label>\n                <ion-input disabled="true" [(ngModel)]="latitude"></ion-input>\n            </ion-item>\n            <ion-item>\n                <ion-label>海拔:</ion-label>\n                <ion-input disabled="true" [(ngModel)]="altitude"></ion-input>\n            </ion-item>\n            <ion-item>\n                <ion-label>精度:</ion-label>\n                <ion-input disabled="true" [(ngModel)]="accuracy"></ion-input>\n            </ion-item>\n\n            <ion-item>\n                <ion-label>天敌类型:</ion-label>\n                <!-- <ion-select [compareWith]="compareWith">\n                    <ion-select-option *ngFor="let user of users">{{user.first + \' \' + user.last}}</ion-select-option>\n                </ion-select> -->\n            </ion-item>\n\n            <ion-item>\n                <ion-label>释放数量:</ion-label>\n                <ion-input [(ngModel)]="newbettle"></ion-input>\n            </ion-item>\n\n            <ion-item>\n                <ion-label>备注:</ion-label>\n                <ion-input [(ngModel)]="accuracy"></ion-input>\n            </ion-item>\n        </ion-card-content>\n    </ion-card>\n\n    <button size="large" expand="full">\n        <ion-label>拍照</ion-label>\n        <ion-icon name="camera"></ion-icon>\n    </button>\n\n    <button size="large" expand="full">\n        <ion-label>提交</ion-label>\n    </button>\n\n    <button size="large" expand="block">\n        <ion-label>地图查看</ion-label>\n    </button>\n\n</ion-content>\n'/*ion-inline-end:"/Users/youkaiyu/Desktop/诱捕器项目/TrapAndroidFrontEnd的副本/src/pages/newEnemy/newEnemy.html"*/
        }),
        __metadata("design:paramtypes", [])
    ], EnemyPage);
    return EnemyPage;
}());

//# sourceMappingURL=newEnemy.js.map

/***/ }),

/***/ 212:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return DeadtreePage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};

var DeadtreePage = /** @class */ (function () {
    function DeadtreePage() {
        this.users = [
            {
                id: 1,
                first: 'Alice',
                last: 'Smith',
            },
            {
                id: 2,
                first: 'Bob',
                last: 'Davis',
            },
            {
                id: 3,
                first: 'Charlie',
                last: 'Rosenburg',
            }
        ];
    }
    DeadtreePage.prototype.trapClick = function () {
        console.log('deadtree');
    };
    DeadtreePage.prototype.deviceIdInput = function () {
        console.log('ok');
        console.log(this.deviceId);
    };
    DeadtreePage.prototype.deviceSerialInput = function () {
        console.log(this.deviceSerial);
    };
    DeadtreePage = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["m" /* Component */])({
            selector: 'app-home',template:/*ion-inline-start:"/Users/youkaiyu/Desktop/诱捕器项目/TrapAndroidFrontEnd的副本/src/pages/newDeadTree/newDeadTree.html"*/'<ion-header>\n    <ion-toolbar>\n        <ion-title>\n            枯死树采伐\n        </ion-title>\n    </ion-toolbar>\n</ion-header>\n\n<ion-content>\n    <ion-card>\n        <ion-card-content>\n            <h3>设备管理:</h3>\n            <ion-item>\n                <ion-label>设备ID:</ion-label>\n                <ion-input [(ngModel)]="deviceId" (ionChange)="deviceIdInput()"></ion-input>\n                <ion-icon name="qr-scanner"></ion-icon>\n\n            </ion-item>\n            <ion-item>\n                <ion-label>设备编号:</ion-label>\n                <ion-input [(ngModel)]="deviceSerial" (ionChange)="deviceSerialInput()"></ion-input>\n                <ion-icon name="search"></ion-icon>\n            </ion-item>\n            <button size="large" expand="block">绑定</button>\n\n        </ion-card-content>\n    </ion-card>\n    <ion-card>\n        <ion-card-content>\n            <h3>维护信息</h3>\n            <ion-item>\n                <ion-label>经度:</ion-label>\n                <ion-input disabled="true" [(ngModel)]="longtitude"></ion-input>\n            </ion-item>\n            <ion-item>\n                <ion-label>纬度:</ion-label>\n                <ion-input disabled="true" [(ngModel)]="latitude"></ion-input>\n            </ion-item>\n            <ion-item>\n                <ion-label>海拔:</ion-label>\n                <ion-input disabled="true" [(ngModel)]="altitude"></ion-input>\n            </ion-item>\n\n            <ion-item>\n                <ion-label>桩径:</ion-label>\n                <ion-input [(ngModel)]="newbettle"></ion-input>\n            </ion-item>\n\n            <ion-item>\n                <ion-label>树高:</ion-label>\n                <ion-input [(ngModel)]="newbettle"></ion-input>\n            </ion-item>\n\n            <ion-item>\n                <ion-label>材积:</ion-label>\n                <ion-input [(ngModel)]="newbettle"></ion-input>\n            </ion-item>\n\n\n            <ion-item>\n                <ion-label>除害方式:</ion-label>\n                <!-- <ion-select [compareWith]="compareWith">\n                    <ion-select-option *ngFor="let user of users">{{user.first + \' \' + user.last}}</ion-select-option>\n                </ion-select> -->\n            </ion-item>\n\n            <ion-item>\n                <ion-label>备注:</ion-label>\n                <ion-input [(ngModel)]="accuracy"></ion-input>\n            </ion-item>\n        </ion-card-content>\n    </ion-card>\n\n    <button size="large" expand="full">\n        <ion-label>拍照</ion-label>\n        <ion-icon name="camera"></ion-icon>\n    </button>\n\n    <button size="large" expand="full">\n        <ion-label>提交</ion-label>\n    </button>\n\n\n    <button size="large" expand="block">\n        <ion-label>地图查看</ion-label>\n    </button>\n\n</ion-content>\n'/*ion-inline-end:"/Users/youkaiyu/Desktop/诱捕器项目/TrapAndroidFrontEnd的副本/src/pages/newDeadTree/newDeadTree.html"*/
        }),
        __metadata("design:paramtypes", [])
    ], DeadtreePage);
    return DeadtreePage;
}());

//# sourceMappingURL=newDeadTree.js.map

/***/ }),

/***/ 213:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return TrackPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};

var TrackPage = /** @class */ (function () {
    function TrackPage() {
        this.users = [
            {
                id: 1,
                first: 'Alice',
                last: 'Smith',
            },
            {
                id: 2,
                first: 'Bob',
                last: 'Davis',
            },
            {
                id: 3,
                first: 'Charlie',
                last: 'Rosenburg',
            }
        ];
    }
    TrackPage.prototype.trapClick = function () {
        console.log('track');
    };
    TrackPage.prototype.deviceIdInput = function () {
        console.log('ok');
        console.log(this.deviceId);
    };
    TrackPage.prototype.deviceSerialInput = function () {
        console.log(this.deviceSerial);
    };
    TrackPage = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["m" /* Component */])({
            selector: 'app-home',template:/*ion-inline-start:"/Users/youkaiyu/Desktop/诱捕器项目/TrapAndroidFrontEnd的副本/src/pages/newTrack/newTrack.html"*/'<ion-header>\n    <ion-toolbar>\n        <ion-title>\n            轨迹追踪\n        </ion-title>\n    </ion-toolbar>\n</ion-header>\n\n<ion-content>\n\n    <ion-card>\n        <ion-card-content>\n            <h3>定位信息</h3>\n            <ion-item>\n                <ion-label>经度:</ion-label>\n                <ion-input disabled="true" [(ngModel)]="longtitude"></ion-input>\n            </ion-item>\n            <ion-item>\n                <ion-label>纬度:</ion-label>\n                <ion-input disabled="true" [(ngModel)]="latitude"></ion-input>\n            </ion-item>\n            <ion-item>\n                <ion-label>海拔:</ion-label>\n                <ion-input disabled="true" [(ngModel)]="altitude"></ion-input>\n            </ion-item>\n            <ion-item>\n                <ion-label>精度:</ion-label>\n                <ion-input disabled="true" [(ngModel)]="accuracy"></ion-input>\n            </ion-item>\n\n            <ion-item>\n                <ion-label>线路名称:</ion-label>\n                <ion-input [(ngModel)]="accuracy"></ion-input>\n            </ion-item>\n\n            <ion-item>\n                <ion-label>工作内容:</ion-label>\n                <ion-input [(ngModel)]="accuracy"></ion-input>\n            </ion-item>\n\n            <ion-item>\n                <ion-label>延时设置:</ion-label>\n                <!-- <ion-select [compareWith]="compareWith">\n                    <ion-select-option *ngFor="let user of users">{{user.first + \' \' + user.last}}</ion-select-option>\n                </ion-select> -->\n            </ion-item>\n\n            <ion-item>\n                <ion-label>备注:</ion-label>\n                <ion-input [(ngModel)]="accuracy"></ion-input>\n            </ion-item>\n        </ion-card-content>\n    </ion-card>\n\n\n    <button size="large" expand="full">\n        <ion-label>开始录制</ion-label>\n        <ion-icon name="videocam"></ion-icon>\n    </button>\n\n    <button size="large" expand="full">\n        <ion-label>停止录制</ion-label>\n        <ion-icon name="square"></ion-icon>\n    </button>\n\n\n    <button size="large" expand="full">\n        <ion-label>拍照</ion-label>\n        <ion-icon name="camera"></ion-icon>\n    </button>\n\n    <button size="large" expand="full">\n        <ion-label>提交</ion-label>\n    </button>\n\n\n    <button size="large" expand="block">\n        <ion-label>地图查看</ion-label>\n    </button>\n\n</ion-content>\n'/*ion-inline-end:"/Users/youkaiyu/Desktop/诱捕器项目/TrapAndroidFrontEnd的副本/src/pages/newTrack/newTrack.html"*/
        }),
        __metadata("design:paramtypes", [])
    ], TrackPage);
    return TrackPage;
}());

//# sourceMappingURL=newTrack.js.map

/***/ }),

/***/ 214:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return AboutPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(7);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__angular_common_http__ = __webpack_require__(14);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__ionic_native_geolocation__ = __webpack_require__(45);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__common_base_js__ = __webpack_require__(18);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__common_coordinate_convertor__ = __webpack_require__(215);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__ionic_native_file__ = __webpack_require__(44);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};









// declare var BMapLib;
var markers = [];
var AboutPage = /** @class */ (function () {
    function AboutPage(navCtrl, httpClient, base, coordinateConvertor, alerts, file, geolocation, changeDetectorRef) {
        this.navCtrl = navCtrl;
        this.httpClient = httpClient;
        this.base = base;
        this.coordinateConvertor = coordinateConvertor;
        this.alerts = alerts;
        this.file = file;
        this.geolocation = geolocation;
        this.changeDetectorRef = changeDetectorRef;
        // 是否定位成功
        this.location_ready = false;
        //username = '';
        // 经度
        this.longitude = '';
        // 纬度
        this.latitude = '';
        // 海拔
        this.altitude = '';
        // 精度
        this.accuracy = '';
        // let map = this.map = new BMap.Map(this.map_container2.nativeElement, { enableMapClick: true });//创建地图实例
        //
        // // map.centerAndZoom("广州",17); //设置城市设置中心和地图显示级别
        // let point = new BMap.Point(113.23, 23.16);//坐标可以通过百度地图坐标拾取器获取
        // map.centerAndZoom(point, 17);//设置中心和地图显示级别
        //
        // map.addControl(new BMap.MapTypeControl());
        // // map.setCurrentCity("广州");
        //
        // let sizeMap = new BMap.Size(10, 80);//显示位置
        // map.addControl(new BMap.NavigationControl());
        //
        // map.centerAndZoom('中国', 5);
    }
    AboutPage.prototype.locate = function () {
        var _this = this;
        var options = {
            enableHighAccuracy: true,
            timeout: 99999999,
            maximumAge: 0
        };
        var that = this;
        var watch = this.geolocation.watchPosition(options);
        this.subscription = watch.subscribe(function (data) {
            // data can be a set of coordinates, or an error (if an error occurred).
            if (data['coords']) {
                // setTimeout(() => {
                _this.latitude = String(data.coords.latitude);
                sessionStorage['latitude'] = String(data.coords.latitude);
                _this.longitude = String(data.coords.longitude);
                sessionStorage['longitude'] = String(data.coords.longitude);
                _this.altitude = String(data.coords.altitude);
                sessionStorage['altitude'] = String(data.coords.altitude);
                _this.accuracy = String(data.coords.accuracy);
                // 不是可以在这里直接判断海拔是不是null吗。。。。
                if (data.coords.altitude == null) {
                    _this.altitude = '-10000';
                    sessionStorage['altitude'] = '-10000';
                    //this.base.showAlert('提示','gps信号弱，请等待',()=>{});
                }
                setTimeout(function () {
                    //this.location_ready = true;
                    _this.location_ready = true;
                    that.changeDetectorRef.detectChanges();
                }, 5000);
                // document.getElementById('latitude').innerText="纬度:" + sessionStorage['latitude']
                // document.getElementById('longitude').innerText="经度:" + sessionStorage['longitude']
                // document.getElementById('altitude').innerText="海拔:" + sessionStorage['altitude']
                // document.getElementById('sumbit_button').removeAttribute('disabled')
                that.changeDetectorRef.detectChanges();
                // },5);
                // if(this.altitude==null){
                //   this.location_ready = false;
                //   this.base.showAlert('提示','海拔获取失败，请重新获取',()=>{});        
                // }
            }
            // else{
            //   this.base.showAlert('提示','gps信号弱，请等待',()=>{});
            // }
        }, function (res) {
            // setTimeout(() => {
            //    this.base.showAlert('提示','wu',()=>{});
            _this.location_ready = false;
            that.changeDetectorRef.detectChanges();
            // 这个是在数据更新后。。。强制刷一下页面。。。放在数据变更后才有用。。。
            // },5);
            // alert();
        });
    };
    AboutPage.prototype.ionViewDidLoad = function () {
        var _this = this;
        var map = this.map = new BMap.Map(this.map_container2.nativeElement, { enableMapClick: true }); //创建地图实例
        var point = new BMap.Point(116.331398, 39.897445);
        map.centerAndZoom(point, 12);
        var i = 1;
        var that = this;
        function addMarker(point, index) {
            var myIcon = new BMap.Icon("https://youkaiyu.com/myLocation.jpeg", new BMap.Size(23, 25), {
                // 指定定位位置。   
                // 当标注显示在地图上时，其所指向的地理位置距离图标左上    
                // 角各偏移10像素和25像素。您可以看到在本例中该位置即是   
                // 图标中央下端的尖角位置。    
                anchor: new BMap.Size(10, 25),
                // 设置图片偏移。   
                // 当您需要从一幅较大的图片中截取某部分作为标注图标时，您   
                // 需要指定大图的偏移位置，此做法与css sprites技术类似。    
                imageOffset: new BMap.Size(0, 0 - index * 25) // 设置图片偏移    
            });
            // 创建标注对象并添加到地图   
            var marker = new BMap.Marker(point, { icon: myIcon });
            map.addOverlay(marker);
        }
        var append = '';
        setInterval(function () {
            _this.locate();
            // if (this.altitude != '-10000' && !this.altitude && this.altitude!="")
            if (_this.latitude && _this.longitude) {
                // const alert = this.alerts.create({
                //   title: '数据',
                //   enableBackdropDismiss: false,
                //   buttons: [
                //     {
                //       text: this.latitude + ',' + this.longitude + ',' + this.altitude,
                //       handler: () => {
                //       }
                //     }
                //   ]
                // });
                // alert.present();
                setTimeout(function () {
                    var point = _this.coordinateConvertor.wgs2bd(Number(_this.latitude), Number(_this.longitude));
                    var point2 = new BMap.Point(point[1], point[0]);
                    var mk = new BMap.Marker(point2);
                    map.addOverlay(mk);
                    map.panTo(point2);
                    // alert('您的位置：' + point.lng + ',' + point.lat);
                    map.centerAndZoom(point2, 15); // 编写自定义函数，创建标注   
                    addMarker(point2, i);
                    append += _this.latitude + ',' + _this.longitude + ',' + _this.altitude;
                    _this.base.logger(append, "about_ionViewDidLoad.txt");
                    i++;
                }, 5000);
            }
        }, 30000);
    };
    AboutPage.prototype.ionViewDidEnter = function () {
        var _this = this;
        var myPoint = [];
        var map = this.map = new BMap.Map(this.map_container2.nativeElement, { enableMapClick: true }); //创建地图实例
        var point = new BMap.Point(116.331398, 39.897445);
        map.centerAndZoom(point, 12);
        // setInterval("this.myLocation()",5000);
        // this.myLocation();
        map.centerAndZoom('中国', 5);
        map.addControl(new BMap.MapTypeControl());
        var sizeMap = new BMap.Size(10, 80); //显示位置
        map.addControl(new BMap.NavigationControl());
        map.enableScrollWheelZoom(true); //启动滚轮放大缩小，默认禁用
        map.enableContinuousZoom(true); //连续缩放效果，默认禁用
        this.httpClient.get('http://39.108.184.47:8081/auth_api/user', { headers: { token: localStorage['token'] } })
            .subscribe(function (data) {
            // console.log(d);
            var center = '';
            if (data['town'] != null)
                center = data['town'] + center;
            if (data['city'] != null)
                center = data['city'] + center;
            if (data['area'] != null)
                center = data['area'] + center;
            if (data['province'] != null)
                center = data['province'] + center;
            if (center)
                map.centerAndZoom(center, 11);
        });
        this.httpClient.get(this.base.BASE_URL + 'auth_api/device_list', { headers: { token: localStorage['token'] },
            params: { searchText: "", limit: "2000", page: "1" } }).subscribe(function (res) {
            for (var i = 0; i < res['data'].length; i++) {
                if (res['data'][i].longitude && res['data'][i].latitude) {
                    if (i == 0)
                        console.log(res['data'][i].latitude);
                    var point = _this.coordinateConvertor.wgs2bd(res['data'][i].latitude, res['data'][i].longitude);
                    point = new BMap.Point(point[1], point[0]);
                    markers.push(point);
                    // this.addMarker(point);
                }
            }
            _this.addMarker();
        });
        var a = setInterval(function () {
            _this.locate();
        }, 1000);
        function addMarker(point, index) {
            var myIcon = new BMap.Icon("https://youkaiyu.com/myLocation.jpeg", new BMap.Size(23, 25), {
                // 指定定位位置。   
                // 当标注显示在地图上时，其所指向的地理位置距离图标左上    
                // 角各偏移10像素和25像素。您可以看到在本例中该位置即是   
                // 图标中央下端的尖角位置。    
                anchor: new BMap.Size(10, 25),
                // 设置图片偏移。   
                // 当您需要从一幅较大的图片中截取某部分作为标注图标时，您   
                // 需要指定大图的偏移位置，此做法与css sprites技术类似。    
                imageOffset: new BMap.Size(0, 0 - index * 25) // 设置图片偏移    
            });
            // 创建标注对象并添加到地图   
            var marker = new BMap.Marker(point, { icon: myIcon });
            map.addOverlay(marker);
        }
        console.log(this.altitude);
        var text = this.latitude + ',' + this.longitude + ',' + this.altitude;
        this.base.logger(text, "about_ionViewDidEnter.txt");
        if (Number(this.altitude) != -10000 && this.altitude != "" && this.altitude) {
            clearInterval(a);
            setTimeout(function () {
                point = _this.coordinateConvertor.wgs2bd(Number(_this.latitude), Number(_this.longitude));
                console.log("Point1进来");
                console.log(point);
                var point2 = new BMap.Point(point[1], point[0]);
                // var point2 = new BMap.Point(119.24242762534455, 26.085565172849666);
                console.log("进来的");
                console.log(point2);
                var mk = new BMap.Marker(point2);
                map.addOverlay(mk);
                map.panTo(point2);
                // alert('您的位置：' + r.point.lng + ',' + r.point.lat);
                map.centerAndZoom(point2, 15); // 编写自定义函数，创建标注   
                addMarker(point2, 0);
            }, 1000);
        }
        // if (this.altitude != '-10000' && !this.altitude && this.altitude != "") {
    };
    AboutPage.prototype.addMarker = function () {
        var options = {
            size: 15,
            shape: 2,
            color: '#d340c3'
        };
        var markerClusterer = new BMap.PointCollection(markers, options);
        // var marker = new BMap.Marker(point);
        this.map.addOverlay(markerClusterer);
    };
    __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["_8" /* ViewChild */])('map2'),
        __metadata("design:type", __WEBPACK_IMPORTED_MODULE_0__angular_core__["t" /* ElementRef */])
    ], AboutPage.prototype, "map_container2", void 0);
    AboutPage = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["m" /* Component */])({
            selector: 'page-about',template:/*ion-inline-start:"/Users/youkaiyu/Desktop/诱捕器项目/TrapAndroidFrontEnd的副本/src/pages/about/about.html"*/'<ion-header>\n  <ion-navbar>\n    <ion-title>\n      地图\n    </ion-title>\n  </ion-navbar>\n</ion-header>\n\n<ion-content>\n  <div #map2 id="map_container2"></div>\n</ion-content>\n'/*ion-inline-end:"/Users/youkaiyu/Desktop/诱捕器项目/TrapAndroidFrontEnd的副本/src/pages/about/about.html"*/
        }),
        __param(4, Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["z" /* Inject */])(__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["a" /* AlertController */])),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["f" /* NavController */], __WEBPACK_IMPORTED_MODULE_2__angular_common_http__["a" /* HttpClient */], __WEBPACK_IMPORTED_MODULE_4__common_base_js__["a" /* Base */],
            __WEBPACK_IMPORTED_MODULE_5__common_coordinate_convertor__["a" /* CoordinateConvertor */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["a" /* AlertController */], __WEBPACK_IMPORTED_MODULE_6__ionic_native_file__["a" /* File */], __WEBPACK_IMPORTED_MODULE_3__ionic_native_geolocation__["a" /* Geolocation */], __WEBPACK_IMPORTED_MODULE_0__angular_core__["j" /* ChangeDetectorRef */]])
    ], AboutPage);
    return AboutPage;
}());

//# sourceMappingURL=about.js.map

/***/ }),

/***/ 215:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return CoordinateConvertor; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};

var CoordinateConvertor = /** @class */ (function () {
    function CoordinateConvertor() {
        //////////////////////////////////////////
        //////////////转换核心代码////////////////
        //////////////////////////////////////////
        this.pi = 3.14159265358979324;
        this.a = 6378245.0;
        this.ee = 0.00669342162296594323;
        this.x_pi = 3.14159265358979324 * 3000.0 / 180.0;
    }
    //世界大地坐标转为百度坐标
    CoordinateConvertor.prototype.wgs2bd = function (lat, lon) {
        var wgs2gcjR = this.wgs2gcj(lat, lon);
        var gcj2bdR = this.gcj2bd(wgs2gcjR[0], wgs2gcjR[1]);
        return gcj2bdR;
    };
    CoordinateConvertor.prototype.gcj2bd = function (lat, lon) {
        var x = lon, y = lat;
        var z = Math.sqrt(x * x + y * y) + 0.00002 * Math.sin(y * this.x_pi);
        var theta = Math.atan2(y, x) + 0.000003 * Math.cos(x * this.x_pi);
        var bd_lon = z * Math.cos(theta) + 0.0065;
        var bd_lat = z * Math.sin(theta) + 0.006;
        var result = [];
        result.push(bd_lat);
        result.push(bd_lon);
        return result;
    };
    CoordinateConvertor.prototype.bd2gcj = function (lat, lon) {
        var x = lon - 0.0065, y = lat - 0.006;
        var z = Math.sqrt(x * x + y * y) - 0.00002 * Math.sin(y * this.x_pi);
        var theta = Math.atan2(y, x) - 0.000003 * Math.cos(x * this.x_pi);
        var gg_lon = z * Math.cos(theta);
        var gg_lat = z * Math.sin(theta);
        var result = [];
        result.push(gg_lat);
        result.push(gg_lon);
        return result;
    };
    CoordinateConvertor.prototype.wgs2gcj = function (lat, lon) {
        var dLat = this.transformLat(lon - 105.0, lat - 35.0);
        var dLon = this.transformLon(lon - 105.0, lat - 35.0);
        var radLat = lat / 180.0 * this.pi;
        var magic = Math.sin(radLat);
        magic = 1 - this.ee * magic * magic;
        var sqrtMagic = Math.sqrt(magic);
        dLat = (dLat * 180.0) / ((this.a * (1 - this.ee)) / (magic * sqrtMagic) * this.pi);
        dLon = (dLon * 180.0) / (this.a / sqrtMagic * Math.cos(radLat) * this.pi);
        var mgLat = lat + dLat;
        var mgLon = lon + dLon;
        var result = [];
        result.push(mgLat);
        result.push(mgLon);
        return result;
    };
    CoordinateConvertor.prototype.transformLat = function (lat, lon) {
        var ret = -100.0 + 2.0 * lat + 3.0 * lon + 0.2 * lon * lon + 0.1 * lat * lon + 0.2 * Math.sqrt(Math.abs(lat));
        ret += (20.0 * Math.sin(6.0 * lat * this.pi) + 20.0 * Math.sin(2.0 * lat * this.pi)) * 2.0 / 3.0;
        ret += (20.0 * Math.sin(lon * this.pi) + 40.0 * Math.sin(lon / 3.0 * this.pi)) * 2.0 / 3.0;
        ret += (160.0 * Math.sin(lon / 12.0 * this.pi) + 320 * Math.sin(lon * this.pi / 30.0)) * 2.0 / 3.0;
        return ret;
    };
    CoordinateConvertor.prototype.transformLon = function (lat, lon) {
        var ret = 300.0 + lat + 2.0 * lon + 0.1 * lat * lat + 0.1 * lat * lon + 0.1 * Math.sqrt(Math.abs(lat));
        ret += (20.0 * Math.sin(6.0 * lat * this.pi) + 20.0 * Math.sin(2.0 * lat * this.pi)) * 2.0 / 3.0;
        ret += (20.0 * Math.sin(lat * this.pi) + 40.0 * Math.sin(lat / 3.0 * this.pi)) * 2.0 / 3.0;
        ret += (150.0 * Math.sin(lat / 12.0 * this.pi) + 300.0 * Math.sin(lat / 30.0 * this.pi)) * 2.0 / 3.0;
        return ret;
    };
    CoordinateConvertor = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["A" /* Injectable */])()
    ], CoordinateConvertor);
    return CoordinateConvertor;
}());

//# sourceMappingURL=coordinate-convertor.js.map

/***/ }),

/***/ 216:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return HomePage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(7);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__ionic_native_qr_scanner__ = __webpack_require__(55);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__scan_scan__ = __webpack_require__(56);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__ionic_native_geolocation__ = __webpack_require__(45);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__angular_common_http__ = __webpack_require__(14);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__device_beetle_fill_device_beetle_fill__ = __webpack_require__(303);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__device_forest_fill_device_forest_fill__ = __webpack_require__(217);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__common_base_js__ = __webpack_require__(18);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9__locate_locate__ = __webpack_require__(108);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_10__cache_cache__ = __webpack_require__(220);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_11__login_login__ = __webpack_require__(221);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_12__photo_upload_photo_upload__ = __webpack_require__(218);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_13__ionic_native_diagnostic__ = __webpack_require__(224);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_14__detail_detail__ = __webpack_require__(110);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_15__device_data_device_data__ = __webpack_require__(225);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};

















var HomePage = /** @class */ (function () {
    function HomePage(navCtrl, qrScanner, geolocation, httpClient, base, app, diagnostic) {
        var _this = this;
        this.navCtrl = navCtrl;
        this.qrScanner = qrScanner;
        this.geolocation = geolocation;
        this.httpClient = httpClient;
        this.base = base;
        this.app = app;
        this.diagnostic = diagnostic;
        this.locate_btn_str = '定位';
        this.location_ready = false;
        // 用户名
        this.username = '';
        // 真实姓名
        this.name = '';
        // 地区
        this.area = '';
        // 用户类型
        this.type = '';
        this.role = '0';
        // 是否是管理员
        this.isAdmin = false;
        this.isWorker = false;
        this.callBack = function (params) {
            return new Promise(function (resolve, reject) {
                if (params) {
                    _this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_14__detail_detail__["a" /* DetailPage */], { id: params.id });
                }
                else {
                }
            });
        };
        // this.locate();
        // this.base.showConfirmAlert('天牛数量：3'+'<br>'+'其他天牛数量：7','确认提交' , (confirm)=> {}, ()=>{})
        this.isWorker = false;
        this.httpClient.get('http://39.108.184.47:8081/auth_api/user', { headers: { token: localStorage['token'] } })
            .subscribe(function (res) {
            // 移除本地缓存的登录信息
            localStorage.removeItem('username');
            localStorage.removeItem('name');
            localStorage.removeItem('province');
            localStorage.removeItem('city');
            localStorage.removeItem('area');
            localStorage.removeItem('town');
            localStorage.removeItem('town');
            localStorage.removeItem('role');
            _this.username = localStorage['username'] = res['username'];
            _this.name = localStorage['name'] = res['name'];
            localStorage['province'] = res['province'];
            localStorage['city'] = res['city'];
            localStorage['area'] = res['area'];
            localStorage['town'] = res['town'];
            localStorage['role'] = res['role'];
            _this.role = res['role'].toString();
            _this.area = '';
            if (localStorage['province'] && localStorage['province'] != 'null') {
                _this.area += localStorage['province'];
            }
            if (localStorage['city'] && localStorage['city'] != 'null') {
                _this.area += localStorage['city'];
            }
            if (localStorage['area'] && localStorage['area'] != 'null') {
                _this.area += localStorage['area'];
            }
            if (localStorage['town'] && localStorage['town'] != 'null') {
                _this.area += localStorage['town'];
            }
            switch (localStorage['role']) {
                case '0':
                    _this.type = '超级管理员';
                    break;
                case '1':
                    _this.type = '省级用户';
                    break;
                case '2':
                    _this.type = '市级用户';
                    break;
                case '3':
                    _this.type = '县级用户';
                    break;
                case '4':
                    _this.type = '管理员';
                    break;
                case '5':
                    _this.type = '工人';
                    break;
            }
            if (localStorage['role'] == '5') {
                _this.isWorker = true;
            }
        }, function () {
            _this.username = localStorage['username'];
            _this.name = localStorage['name'];
            _this.area = '';
            _this.role = localStorage['role'];
            if (localStorage['province'] && localStorage['province'] != 'null') {
                _this.area += localStorage['province'];
            }
            if (localStorage['city'] && localStorage['city'] != 'null') {
                _this.area += localStorage['city'];
            }
            if (localStorage['area'] && localStorage['area'] != 'null') {
                _this.area += localStorage['area'];
            }
            if (localStorage['town'] && localStorage['town'] != 'null') {
                _this.area += localStorage['town'];
            }
            switch (localStorage['role']) {
                case '0':
                    _this.type = '超级管理员';
                    break;
                case '1':
                    _this.type = '省级用户';
                    break;
                case '2':
                    _this.type = '市级用户';
                    break;
                case '3':
                    _this.type = '县级用户';
                    break;
                case '4':
                    _this.type = '管理员';
                    break;
                case '5':
                    _this.type = '工人';
                    break;
            }
            if (localStorage['role'] == '5') {
                _this.isWorker = true;
            }
        });
        this.diagnostic.getLocationMode().then(function (status) {
            if (status == _this.diagnostic.locationMode.DEVICE_ONLY) {
            }
            else {
                _this.base.showAlert('提示', '请设置为仅限设备', function () { _this.diagnostic.switchToLocationSettings(); });
            }
        }).catch(function (e) { alert(e); });
    }
    HomePage.prototype.locate = function () {
        var _this = this;
        var options = {
            enableHighAccuracy: true,
            timeout: 99999999,
            maximumAge: 0
        };
        var watch = this.geolocation.watchPosition(options);
        this.subscription = watch.subscribe(function (data) {
            // data can be a set of coordinates, or an error (if an error occurred).
            if (data['coords']) {
                // alert("纬度:" + data.coords.latitude + "\n经度:" + data.coords.longitude);
                sessionStorage['latitude'] = data.coords.latitude;
                sessionStorage['longitude'] = data.coords.longitude;
                // subscription.unsubscribe();
                _this.location_ready = true;
            }
        }, function (res) {
            _this.location_ready = false;
            // alert();
        });
    };
    HomePage.prototype.scan = function () {
        this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_3__scan_scan__["a" /* ScanPage */], { callBack: this.callBack });
        // let options = {
        //   enableHighAccuracy: true,
        //   timeout: 50000,
        //   maximumAge: 0
        // };
        // let watch = this.geolocation.watchPosition(options);
        // let subscription = watch.subscribe((data) => {
        //   // data can be a set of coordinates, or an error (if an error occurred).
        //   // data.coords.latitude
        //   // data.coords.longitude
        //
        //   alert("纬度:" + data.coords.latitude + "\n经度:" + data.coords.longitude);
        //   this.location_ready = true;
        //   subscription.unsubscribe();
        // });
    };
    HomePage.prototype.location = function () {
        var _this = this;
        var options = {
            enableHighAccuracy: true,
            timeout: 0,
            maximumAge: 0
        };
        var watch = this.geolocation.watchPosition(options);
        this.subscription = watch.subscribe(function (data) {
            // data can be a set of coordinates, or an error (if an error occurred).
            // data.coords.latitude
            // data.coords.longitude
            alert("纬度:" + data.coords.latitude + "\n经度:" + data.coords.longitude);
            _this.subscription.unsubscribe();
        });
    };
    HomePage.prototype.ionicViewWillEnter = function () {
        // this.locate();
    };
    HomePage.prototype.ionViewDidEnter = function () {
        // this.locate();
    };
    HomePage.prototype.ionViewWillLeave = function () {
        // if (this.subscription) {
        //   this.subscription.unsubscribe();
        // }
    };
    HomePage.prototype.submit = function () {
        var device = {
            "id": 1004,
            "latitude": 26.049941,
            "longitude": 119.138151,
        };
        this.httpClient.post('http://39.108.184.47:8081/auth_api/device', device, { headers: { token: localStorage['token'] } }).subscribe(function (res) {
            console.log(res);
        });
        alert();
    };
    HomePage.prototype.submitBeetle = function () {
        this.navCtrl.setRoot(__WEBPACK_IMPORTED_MODULE_6__device_beetle_fill_device_beetle_fill__["a" /* DeviceBeetleFillPage */]);
    };
    HomePage.prototype.submitForest = function () {
        this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_7__device_forest_fill_device_forest_fill__["a" /* DeviceForestFillPage */]);
    };
    HomePage.prototype.locatePage = function () {
        this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_9__locate_locate__["a" /* LocatePage */]);
    };
    HomePage.prototype.cachePage = function () {
        this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_10__cache_cache__["a" /* CachePage */]);
    };
    HomePage.prototype.logout = function () {
        localStorage.removeItem('token');
        sessionStorage['isLogin'] = false;
        this.app.getRootNav().setRoot(__WEBPACK_IMPORTED_MODULE_11__login_login__["a" /* LoginPage */]);
    };
    HomePage.prototype.phototest = function () {
        this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_12__photo_upload_photo_upload__["a" /* PhotoUploadPage */]);
    };
    HomePage.prototype.deviceDataPage = function () {
        this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_15__device_data_device_data__["a" /* DeviceDataPage */]);
    };
    HomePage = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["m" /* Component */])({
            selector: 'page-home',template:/*ion-inline-start:"/Users/youkaiyu/Desktop/诱捕器项目/TrapAndroidFrontEnd的副本/src/pages/home/home.html"*/'<ion-header>\n  <ion-navbar>\n    <ion-title>主页</ion-title>\n  </ion-navbar>\n</ion-header>\n\n<ion-content padding>\n  <div style="display: none">\n    <p *ngIf="!location_ready">\n      尚未定位, 不能扫码\n    </p>\n    <!--<button (click)="locate()" ion-button="" [disabled]="">-->\n\n    <!--</button>-->\n    <button (click)="scan()" [disabled]="!location_ready" ion-button="">\n      扫码\n    </button>\n    <button (click)="submit()" ion-button="">\n      测试提交\n    </button>\n    <button (click)="submitBeetle()" ion-button="">\n      测试天牛信息提交\n    </button>\n    <button (click)="submitForest()" ion-button="">\n      测试森林信息提交\n    </button>\n\n  </div>\n  <!--<div>-->\n    <!--<button ion-button block (click)="phototest()">-->\n      <!--拍照测试-->\n    <!--</button>-->\n  <!--</div>-->\n  <h1 style="text-align: center">\n    欢迎使用\n  </h1>\n  <!--<button (click)="location()">定位</button>-->\n  <ion-list no-lines>\n    <ion-item>用户名:{{username}}</ion-item>\n    <ion-item>姓名:{{name}}</ion-item>\n    <ion-item>地区:{{area}}</ion-item>\n    <ion-item>类型:{{type}}</ion-item>\n  </ion-list>\n  <!--<button ion-button="" block (click)="locatePage()" [disabled]="!isWorker">-->\n    <!--定位-->\n  <!--</button>-->\n  <button ion-button="" block (click)="scan()">\n    扫码\n  </button>\n  <button ion-button="" block (click)="cachePage()" [disabled]="!isWorker">\n    缓存记录\n  </button>\n  <button ion-button="" block (click)="deviceDataPage()" [disabled]="!(role == \'1\' || role == \'2\' || role == \'3\')">\n    查看诱捕数据\n  </button>\n  <button ion-button="" block color="danger" (click)="logout()">\n    注销\n  </button>\n</ion-content>\n'/*ion-inline-end:"/Users/youkaiyu/Desktop/诱捕器项目/TrapAndroidFrontEnd的副本/src/pages/home/home.html"*/
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["f" /* NavController */], __WEBPACK_IMPORTED_MODULE_2__ionic_native_qr_scanner__["a" /* QRScanner */], __WEBPACK_IMPORTED_MODULE_4__ionic_native_geolocation__["a" /* Geolocation */],
            __WEBPACK_IMPORTED_MODULE_5__angular_common_http__["a" /* HttpClient */], __WEBPACK_IMPORTED_MODULE_8__common_base_js__["a" /* Base */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["b" /* App */], __WEBPACK_IMPORTED_MODULE_13__ionic_native_diagnostic__["a" /* Diagnostic */]])
    ], HomePage);
    return HomePage;
}());

//# sourceMappingURL=home.js.map

/***/ }),

/***/ 217:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return DeviceForestFillPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__photo_upload_photo_upload__ = __webpack_require__(218);

/**
 * Generated class for the DeviceForestFillPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
// @Component({
//   selector: 'page-device-forest-fill',
//template:/*ion-inline-start:"/Users/youkaiyu/Desktop/诱捕器项目/TrapAndroidFrontEnd的副本/src/pages/device-forest-fill/device-forest-fill.html"*/'<!--\n  Generated template for the DeviceForestFillPage page.\n\n  See http://ionicframework.com/docs/components/#navigation for more info on\n  Ionic pages and navigation.\n-->\n<ion-header>\n\n  <ion-navbar>\n    <ion-title>森林信息</ion-title>\n  </ion-navbar>\n\n</ion-header>\n\n\n<ion-content padding>\n  <ion-item>\n    <ion-label floating>坡位</ion-label>\n    <ion-input type="text" value="" [(ngModel)]="slopPosition"></ion-input>\n  </ion-item>\n  <ion-item>\n    <ion-label floating>坡向</ion-label>\n    <ion-input type="text" value="" [(ngModel)]="slopDirection"></ion-input>\n  </ion-item>\n  <ion-item>\n    <ion-label floating>林分类型</ion-label>\n    <ion-input type="text" value="" [(ngModel)]="forestStructure"></ion-input>\n  </ion-item>\n  <ion-item>\n    <ion-label floating>平均树高</ion-label>\n    <ion-input type="text" value="" [(ngModel)]="avgHeight"></ion-input>\n  </ion-item>\n  <ion-item>\n    <ion-label floating>平均胸径</ion-label>\n    <ion-input type="text" value="" [(ngModel)]="avgDbh"></ion-input>\n  </ion-item>\n  <ion-item>\n    <ion-label floating>林分密度</ion-label>\n    <ion-input type="number" value="" [(ngModel)]="forestStructureDensity"></ion-input>\n  </ion-item>\n  <ion-item>\n    <ion-label floating>郁闭度</ion-label>\n    <ion-input type="number" value="" [(ngModel)]="crownDensity"></ion-input>\n  </ion-item>\n  <button ion-button="" (click)="submit()" block>提交</button>\n  <button ion-button="" (click)="pass()" block color="light">不填写</button>\n</ion-content>\n'/*ion-inline-end:"/Users/youkaiyu/Desktop/诱捕器项目/TrapAndroidFrontEnd的副本/src/pages/device-forest-fill/device-forest-fill.html"*/,
// })
var DeviceForestFillPage = /** @class */ (function () {
    function DeviceForestFillPage(navCtrl, navParams, httpClient, base) {
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.httpClient = httpClient;
        this.base = base;
        // 坡向
        this.slopDirection = '';
        // 坡位
        this.slopPosition = '';
        // 林分类型
        this.forestStructure = '';
        // 平均树高
        this.avgHeight = '';
        // 平均胸径
        this.avgDbh = '';
        // 林分密度
        this.forestStructureDensity = '';
        // 郁密度
        this.crownDensity = '';
    }
    DeviceForestFillPage.prototype.ionViewDidLoad = function () {
        console.log('ionViewDidLoad DeviceForestFillPage');
    };
    DeviceForestFillPage.prototype.submit = function () {
        var _this = this;
        var device = {};
        device['deviceId'] = this.navParams.get('id');
        device['slopeDirection'] = this.slopDirection;
        device['slopePosition'] = this.slopPosition;
        device['forestStructure'] = this.forestStructure;
        device['avgHeight'] = this.avgHeight;
        device['avgDbh'] = this.avgDbh;
        device['forestStructureDensity'] = this.forestStructureDensity;
        device['crownDensity'] = this.crownDensity;
        this.httpClient.post(this.base.BASE_URL + 'auth_api/device_forest', device, { headers: { token: localStorage['token'] } }).subscribe(function (res) {
            console.log(res);
            _this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_0__photo_upload_photo_upload__["a" /* PhotoUploadPage */], { deviceId: _this.navParams.get('id') });
        }, function (res) {
            alert('上传失败，缓存记录');
            // 缓存记录到localStorage中
            var deviceForestCache;
            deviceForestCache = localStorage.getItem('deviceForestCache');
            if (deviceForestCache == null) {
                deviceForestCache = [];
            }
            else {
                deviceForestCache = JSON.parse(deviceForestCache);
            }
            deviceForestCache.push(device);
            localStorage.setItem('deviceForestCache', JSON.stringify(deviceForestCache));
            _this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_0__photo_upload_photo_upload__["a" /* PhotoUploadPage */], { deviceId: _this.navParams.get('id') });
        }, function () {
        });
        // this.navCtrl.popToRoot()
    };
    DeviceForestFillPage.prototype.pass = function () {
        this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_0__photo_upload_photo_upload__["a" /* PhotoUploadPage */], { deviceId: this.navParams.get('id') });
    };
    return DeviceForestFillPage;
}());

//# sourceMappingURL=device-forest-fill.js.map

/***/ }),

/***/ 218:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return PhotoUploadPage; });
/**
 * Generated class for the PhotoUploadPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
// @Component({
//   selector: 'page-photo-upload',
//template:/*ion-inline-start:"/Users/youkaiyu/Desktop/诱捕器项目/TrapAndroidFrontEnd的副本/src/pages/photo-upload/photo-upload.html"*/'<!--\n  Generated template for the PhotoUploadPage page.\n\n  See http://ionicframework.com/docs/components/#navigation for more info on\n  Ionic pages and navigation.\n-->\n<ion-header>\n\n  <ion-navbar>\n    <ion-title>现场图片上传</ion-title>\n  </ion-navbar>\n\n</ion-header>\n\n\n<ion-content padding>\n  <div>\n    <button ion-button (click)="takePhoto()" block>\n      拍照\n    </button>\n    <button ion-button (click)="choosePhoto()" block>\n      选择照片\n    </button>\n  </div>\n</ion-content>\n'/*ion-inline-end:"/Users/youkaiyu/Desktop/诱捕器项目/TrapAndroidFrontEnd的副本/src/pages/photo-upload/photo-upload.html"*/,
// })
var PhotoUploadPage = /** @class */ (function () {
    function PhotoUploadPage(navCtrl, navParams, camera, fileTransfer, base) {
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.camera = camera;
        this.fileTransfer = fileTransfer;
        this.base = base;
    }
    PhotoUploadPage.prototype.ionViewDidLoad = function () {
        console.log('ionViewDidLoad PhotoUploadPage');
    };
    PhotoUploadPage.prototype.takePhoto = function () {
        var _this = this;
        var options = {
            quality: 10,
            destinationType: this.camera.DestinationType.FILE_URI,
            sourceType: 1,
            encodingType: this.camera.EncodingType.JPEG,
            mediaType: this.camera.MediaType.PICTURE,
            allowEdit: false,
            correctOrientation: true
        };
        this.camera.getPicture(options).then(function (imageData) {
            _this.uploadFile(imageData, _this.navParams.get('deviceId'));
            _this.navCtrl.popToRoot();
        }, function (err) {
            // Handle error
            _this.navCtrl.popToRoot();
        }).catch(function (error) {
            console.log(error);
        });
    };
    PhotoUploadPage.prototype.choosePhoto = function () {
        var _this = this;
        var options = {
            quality: 10,
            destinationType: this.camera.DestinationType.FILE_URI,
            sourceType: 0,
            encodingType: this.camera.EncodingType.JPEG,
            mediaType: this.camera.MediaType.PICTURE,
            allowEdit: false,
            correctOrientation: true
        };
        this.camera.getPicture(options).then(function (imageData) {
            _this.uploadFile(imageData, _this.navParams.get('deviceId'));
            _this.navCtrl.popToRoot();
        }, function (err) {
            // Handle error
            _this.navCtrl.popToRoot();
        }).catch(function (error) {
            console.log(error);
        });
    };
    PhotoUploadPage.prototype.uploadFile = function (imageData, deviceId) {
        var options = {};
        options.fileKey = "image";
        var time = Date.parse(Date());
        options.fileName = time + ".jpg";
        options.mimeType = "image/jpeg";
        options.chunkedMode = false;
        options.httpMethod = "POST";
        options.params = { deviceId: deviceId };
        options.headers = { token: localStorage['token'] };
        //创建文件对象
        var fileTransfer = this.fileTransfer.create();
        fileTransfer.upload(imageData, this.base.BASE_URL + 'auth_api/device_img', options)
            .then(function (res) {
            console.log(res);
            alert('发送成功');
        }, function (error) {
            alert('发送失败');
            console.log(error);
        })
            .catch(function (error) {
            // alert("出错" + error);
            alert('失败');
            console.log(error);
        });
    };
    return PhotoUploadPage;
}());

//# sourceMappingURL=photo-upload.js.map

/***/ }),

/***/ 219:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return MaintenancePage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(7);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__common_base_js__ = __webpack_require__(18);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__ionic_native_file_transfer__ = __webpack_require__(109);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__ionic_native_camera__ = __webpack_require__(107);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__angular_common_http__ = __webpack_require__(14);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__ionic_native_file__ = __webpack_require__(44);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};







/**
 * Generated class for the MaintenancePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
var MaintenancePage = /** @class */ (function () {
    function MaintenancePage(navCtrl, navParams, camera, fileTransfer, base, httpClient, file) {
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.camera = camera;
        this.fileTransfer = fileTransfer;
        this.base = base;
        this.httpClient = httpClient;
        this.file = file;
        this.num = '0';
        this.femaleNum = '0';
        this.maleNum = '0';
        this.drug = 'APF-I持久增强型';
        this.remark = '';
        this.workingContent = '0';
        this.otherBeetleList = [];
        this.otherNum = '0';
        this.otherType = '0';
        this.belongs = false;
        //private username = '';
        this.have_submit = false;
        this.id = this.navParams.get('id');
        this.longitude = this.navParams.get('longitude');
        this.latitude = this.navParams.get('latitude');
        this.altitude = this.navParams.get('altitude');
        // this.belongs = this.navParams.get('belongs');
        // if(!this.belongs){
        //   this.have_submit=true;
        // }
        //判断经纬度是否为null,是的话提示确定后直接返回重新录入
        if (this.id == '' || this.id == null || this.id == 'null' || !this.longitude || !this.latitude || !this.altitude || this.altitude == 'null' || this.latitude == 'null' || this.longitude == 'null') {
            this.base.showAlert('提示', '经纬度海拔存在为空，请重新定位', function () { });
            __WEBPACK_IMPORTED_MODULE_2__common_base_js__["a" /* Base */].popTo(this.navCtrl, 'DetailPage');
        }
        // if(this.longitude==null ||this.longitude=='' || this.latitude==null ||this.latitude=='' ||this.altitude==null||this.altitude==''||this.id==null ||this.id==''){
        //       this.base.showAlert('提示', '经纬度海拔存在为空，请重新定位', ()=>{});
        //       Base.popTo(this.navCtrl, 'DetailPage');
        // }
        //this.username = this.navParams.get('username');
    }
    MaintenancePage.prototype.ionViewDidLoad = function () {
        console.log('ionViewDidLoad MaintenancePage');
        this.loadOtherBeetleList();
    };
    MaintenancePage.prototype.loadOtherBeetleList = function () {
        var _this = this;
        this.httpClient.get(this.base.BASE_URL + 'auth_api/other_beetle/town', {
            headers: { token: localStorage['token'] }
        }).subscribe(function (res) {
            _this.otherBeetleList = res['data'];
            localStorage['otherBeetle'] = JSON.stringify(res['data']);
        }, function () {
            _this.otherBeetleList = JSON.parse(localStorage['otherBeetle']);
        });
    };
    MaintenancePage.prototype.takePhoto = function () {
        var _this = this;
        var options = {
            quality: 10,
            destinationType: this.camera.DestinationType.FILE_URI,
            sourceType: 1,
            encodingType: this.camera.EncodingType.JPEG,
            mediaType: this.camera.MediaType.PICTURE,
            allowEdit: false,
            correctOrientation: true
        };
        this.camera.getPicture(options).then(function (imageData) {
            // this.submit(imageData)
            // this.navCtrl.popToRoot()
            _this.imageData = imageData;
        }, function (err) {
            // Handle error
            // this.navCtrl.popToRoot()
        }).catch(function (error) {
            console.log(error);
        });
    };
    MaintenancePage.prototype.choosePhoto = function () {
        var _this = this;
        var options = {
            quality: 10,
            destinationType: this.camera.DestinationType.FILE_URI,
            sourceType: 0,
            encodingType: this.camera.EncodingType.JPEG,
            mediaType: this.camera.MediaType.PICTURE,
            allowEdit: false,
            correctOrientation: true
        };
        this.camera.getPicture(options).then(function (imageData) {
            // this.submit(imageData)
            // this.navCtrl.popToRoot()
            _this.imageData = imageData;
        }, function (err) {
            // Handle error
            // this.navCtrl.popToRoot()
        }).catch(function (error) {
            console.log(error);
        });
    };
    MaintenancePage.prototype.numchange = function () {
        // (ionChange)="numchange()"
        var num1 = 0;
        if (parseInt(this.num) < 0 || parseInt(this.num) == NaN) {
            this.base.showAlert('提示', '数字输入不合法', function () { });
        }
        if (!this.num) {
            this.base.showAlert('提示', '数量输入为空或不合法', function () { });
        }
        num1 = parseInt(this.num);
        this.num = '' + num1;
        if (this.num == 'NaN') {
            this.base.showAlert('提示', '数量输入不合法', function () { });
        }
    };
    MaintenancePage.prototype.otherNumchange = function () {
        //(ionChange)="otherNumchange()"
        var otherNum1 = 0;
        if (parseInt(this.otherNum) < 0 || parseInt(this.otherNum) == NaN) {
            this.base.showAlert('提示', '数字输入不合法', function () { });
        }
        if (!this.otherNum) {
            this.base.showAlert('提示', '数量输入为空或不合法', function () { });
        }
        otherNum1 = parseInt(this.otherNum);
        this.otherNum = '' + otherNum1;
        if (this.otherNum == 'NaN') {
            this.base.showAlert('提示', '数量输入不合法', function () { });
        }
    };
    MaintenancePage.prototype.submit = function () {
        var _this = this;
        this.base.showConfirmAlert('天牛数量：' + this.num + '<br>' + '其他天牛数量：' + this.otherNum, '确认提交', function (confirm) { _this.submit_function(confirm); }, function () { });
    };
    MaintenancePage.prototype.submit_function = function (confirm) {
        var _this = this;
        // (parseInt(this.femaleNum) + parseInt(this.maleNum) != parseInt(this.num))
        //int项不为负，不为不是数字
        var num1 = 0;
        var otherNum1 = 0;
        var num1Str = '0';
        var otherNum1Str = '0';
        if (parseInt(this.maleNum) < 0 || parseInt(this.maleNum) == NaN || parseInt(this.femaleNum) < 0 || parseInt(this.femaleNum) == NaN || parseInt(this.num) < 0 || parseInt(this.num) == NaN || parseInt(this.otherNum) < 0 || parseInt(this.otherNum) == NaN || parseInt(this.otherType) < 0 || parseInt(this.otherType) == NaN || parseInt(this.workingContent) < 0 || parseInt(this.workingContent) == NaN) {
            this.base.showAlert('提示', '数字输入不合法', function () { });
            return;
        }
        if (!this.maleNum || !this.femaleNum || !this.num || !this.otherNum || !this.otherType || !this.workingContent) {
            this.base.showAlert('提示', '数量输入为空或不合法', function () { });
            return;
        }
        num1 = parseInt(this.num);
        otherNum1 = parseInt(this.otherNum);
        num1Str = '' + num1;
        otherNum1Str = '' + otherNum1;
        if (num1Str == 'NaN' || otherNum1Str == 'NaN') {
            this.base.showAlert('提示', '数量输入不合法', function () { });
            return;
        }
        this.num = '' + num1;
        this.otherNum = '' + otherNum1;
        this.have_submit = true;
        if (this.imageData != null) {
            var options_1 = {};
            options_1.fileKey = "image";
            var time = Date.parse(Date());
            options_1.fileName = time + ".jpg";
            options_1.mimeType = "image/jpeg";
            options_1.chunkedMode = false;
            options_1.httpMethod = "POST";
            options_1.params = {
                deviceId: this.id,
                longitude: this.longitude, latitude: this.latitude, num: this.num,
                maleNum: this.maleNum, femaleNum: this.femaleNum, altitude: this.altitude,
                drug: this.drug, remark: this.remark, workingContent: this.workingContent,
                otherNum: this.otherNum, otherType: this.otherType
            };
            options_1.headers = { token: localStorage['token'] };
            //创建文件对象
            var fileTransfer = this.fileTransfer.create();
            this.base.logger(JSON.stringify(options_1), "Img_maintenance_submit_function_fileTransferPar.txt");
            fileTransfer.upload(this.imageData, this.base.BASE_URL + 'auth_api/maintenance', options_1)
                .then(function (res) {
                console.log(res);
                console.log(JSON.stringify(res));
                console.log(JSON.parse(JSON.stringify(res)).message);
                _this.base.logger(JSON.stringify(res), "Img_maintenance_submit_function_fileTransferRes.txt");
                _this.base.showAlert('提示', '提交成功', function () { });
                __WEBPACK_IMPORTED_MODULE_2__common_base_js__["a" /* Base */].popTo(_this.navCtrl, 'DetailPage');
            }, function (error) {
                _this.base.showAlert('提示', '提交失败', function () { });
                _this.base.logger(JSON.stringify(error), "Img_maintenance_submit_function_fileTransferError.txt");
                var cacheData = { deviceId: _this.id,
                    longitude: _this.longitude, latitude: _this.latitude, num: _this.num,
                    maleNum: _this.maleNum, femaleNum: _this.femaleNum, altitude: _this.altitude, img: _this.imageData,
                    drug: _this.drug, remark: _this.remark, workingContent: _this.workingContent, otherNum: _this.otherNum, otherType: _this.otherType };
                var maintenanceCache;
                maintenanceCache = localStorage.getItem('maintenanceCache');
                if (maintenanceCache == null) {
                    maintenanceCache = [];
                }
                else {
                    maintenanceCache = JSON.parse(maintenanceCache);
                }
                maintenanceCache.push(cacheData);
                //localStorage安全保存数据
                // try{
                //   localStorage.setItem('maintenanceCache', JSON.stringify(maintenanceCache));
                // }catch(oException){
                //     if(oException.name == 'QuotaExceededError'){
                //         this.base.showAlert('提示', '无法提交，缓存容量不足，请及时处理', ()=>{});
                //         //console.log('已经超出本地存储限定大小！');
                //             // 可进行超出限定大小之后的操作，如下面可以先清除记录，再次保存
                //       // localStorage.clear();
                //       // localStorage.setItem(key,value);
                //     }
                // } 
                localStorage.setItem('maintenanceCache', JSON.stringify(maintenanceCache));
                //this.navCtrl.pop();
                confirm.dismiss();
                __WEBPACK_IMPORTED_MODULE_2__common_base_js__["a" /* Base */].popTo(_this.navCtrl, 'DetailPage');
            });
            //.catch((error) => {//发送失败(文件不存在等)
            // alert("出错" + error);
            //alert('失败');
            //console.log(error);
            //});
        }
        else {
            var options = "deviceId: " + this.id +
                "longitude:" + this.longitude + "latitude:" + this.latitude + "num:" + this.num +
                "maleNum:" + this.maleNum + "femaleNum:" + this.femaleNum + "altitude:" + this.altitude +
                "drug:" + this.drug + "remark:" + this.remark + "workingContent:" + this.workingContent + "otherNum:" + this.otherNum + "otherType:" + this.otherType;
            this.base.logger(options, "NonImg_maintenance_submit_function_fileTransferPar.txt");
            this.httpClient.post('http://39.108.184.47:8081/auth_api/maintenance', {}, { headers: { token: localStorage['token'] }, params: { deviceId: this.id,
                    longitude: this.longitude, latitude: this.latitude, num: this.num,
                    maleNum: this.maleNum, femaleNum: this.femaleNum, altitude: this.altitude,
                    drug: this.drug, remark: this.remark, workingContent: this.workingContent, otherNum: this.otherNum, otherType: this.otherType } })
                .subscribe(function (res) {
                console.log(JSON.stringify(res));
                console.log(JSON.parse(JSON.stringify(res)).message);
                _this.base.logger(JSON.stringify(res), "NonImg_maintenance_submit_function_fileTransferRes.txt");
                _this.base.showAlert('提示', '提交成功', function () { });
                __WEBPACK_IMPORTED_MODULE_2__common_base_js__["a" /* Base */].popTo(_this.navCtrl, 'DetailPage');
            }, function (msg) {
                _this.base.logger(JSON.stringify(msg), "NonImg_maintenance_submit_function_fileTransferError.txt");
                _this.base.showAlert('提示', '提交失败', function () { });
                var cacheData = { deviceId: _this.id,
                    longitude: _this.longitude, latitude: _this.latitude, num: _this.num,
                    maleNum: _this.maleNum, femaleNum: _this.femaleNum, altitude: _this.altitude,
                    drug: _this.drug, remark: _this.remark, workingContent: _this.workingContent, otherNum: _this.otherNum, otherType: _this.otherType };
                var maintenanceCache;
                maintenanceCache = localStorage.getItem('maintenanceCache');
                if (maintenanceCache == null) {
                    maintenanceCache = [];
                }
                else {
                    maintenanceCache = JSON.parse(maintenanceCache);
                }
                maintenanceCache.push(cacheData);
                // try{
                //   localStorage.setItem('maintenanceCache', JSON.stringify(maintenanceCache));
                // }catch(oException){
                //     if(oException.name == 'QuotaExceededError'){
                //         this.base.showAlert('提示', '无法提交，缓存容量不足，请及时处理', ()=>{});
                //         //console.log('已经超出本地存储限定大小！');
                //             // 可进行超出限定大小之后的操作，如下面可以先清除记录，再次保存
                //       // localStorage.clear();
                //       // localStorage.setItem(key,value);
                //     }
                // }   
                localStorage.setItem('maintenanceCache', JSON.stringify(maintenanceCache));
                console.log("Hello");
                //this.navCtrl.pop();
                confirm.dismiss();
                __WEBPACK_IMPORTED_MODULE_2__common_base_js__["a" /* Base */].popTo(_this.navCtrl, 'DetailPage');
            });
        }
    };
    MaintenancePage = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["m" /* Component */])({
            selector: 'page-maintenance',template:/*ion-inline-start:"/Users/youkaiyu/Desktop/诱捕器项目/TrapAndroidFrontEnd的副本/src/pages/maintenance/maintenance.html"*/'<!--\n  Generated template for the MaintenancePage page.\n\n  See http://ionicframework.com/docs/components/#navigation for more info on\n  Ionic pages and navigation.\n-->\n<ion-header>\n\n  <ion-navbar>\n    <ion-title>维护信息录入</ion-title>\n  </ion-navbar>\n\n</ion-header>\n\n\n<ion-content padding>\n  <ion-item>\n    <ion-label floating>天牛数量</ion-label>\n    <ion-input type="number" value="" min="0"  [(ngModel)]="num"></ion-input>\n  </ion-item>\n  <ion-item>\n    <ion-label floating>其他天牛类型</ion-label>\n    <ion-select cancelText="取消" okText="确定" [(ngModel)]="otherType">\n      <ion-option value="0">\n        无\n      </ion-option>\n      <ion-option *ngFor="let item of otherBeetleList" value="{{item.id}}">\n        {{item.name}}\n      </ion-option>\n    </ion-select>\n    <!--todo 动态加载-->\n  </ion-item>\n  <ion-item>\n    <ion-label floating>其他天牛数量</ion-label>\n    <ion-input type="number" value="" min="0" [(ngModel)]="otherNum"></ion-input>\n  </ion-item>\n  <ion-item hidden>\n    <ion-label floating>雄虫量</ion-label>\n    <ion-input type="number" value="" min="0"  [(ngModel)]="maleNum"></ion-input>\n  </ion-item>\n  <ion-item hidden>\n    <ion-label floating>雌虫量</ion-label>\n    <ion-input type="number" value="" min="0"  [(ngModel)]="femaleNum"></ion-input>\n  </ion-item>\n  <ion-item>\n    <ion-label floating>药剂类型</ion-label>\n    <ion-select cancelText="取消" okText="确定" [(ngModel)]="drug">\n      <ion-option value="APF-I持久增强型">\n        ﻿APF-I持久增强型\n      </ion-option>\n      <ion-option value="APF-I持久型">\n        ﻿APF-I持久型\n      </ion-option>\n      <ion-option value="APF-I普通型">\n        ﻿APF-I普通型\n      </ion-option>\n    </ion-select>\n  </ion-item>\n  <ion-item>\n    <ion-label floating>备注</ion-label>\n    <ion-input type="text" value="" [(ngModel)]="remark"></ion-input>\n  </ion-item>\n  <ion-item>\n    <ion-label floating>施工内容</ion-label>\n    <ion-select [(ngModel)]="workingContent" cancelText="取消" okText="确定">\n      <ion-option value="0">\n        首次悬挂诱捕器\n      </ion-option>\n      <ion-option value="1">\n        换药+收虫\n      </ion-option>\n      <ion-option value="2">\n        收虫\n      </ion-option>\n      <ion-option value="3">\n        其他\n      </ion-option>\n    </ion-select>\n  </ion-item>\n  <div>\n    <button ion-button (click)="takePhoto()" block>\n      拍照\n    </button>\n    <button ion-button (click)="choosePhoto()" block>\n      选择照片\n    </button>\n  </div>\n\n  <div>\n    <button ion-button (click)="submit()" [disabled]="have_submit">提交</button>\n  </div>\n  \n</ion-content>\n'/*ion-inline-end:"/Users/youkaiyu/Desktop/诱捕器项目/TrapAndroidFrontEnd的副本/src/pages/maintenance/maintenance.html"*/,
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["f" /* NavController */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["g" /* NavParams */], __WEBPACK_IMPORTED_MODULE_4__ionic_native_camera__["a" /* Camera */],
            __WEBPACK_IMPORTED_MODULE_3__ionic_native_file_transfer__["a" /* FileTransfer */], __WEBPACK_IMPORTED_MODULE_2__common_base_js__["a" /* Base */], __WEBPACK_IMPORTED_MODULE_5__angular_common_http__["a" /* HttpClient */], __WEBPACK_IMPORTED_MODULE_6__ionic_native_file__["a" /* File */]])
    ], MaintenancePage);
    return MaintenancePage;
}());

//# sourceMappingURL=maintenance.js.map

/***/ }),

/***/ 220:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return CachePage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(7);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__angular_common_http__ = __webpack_require__(14);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__common_base_js__ = __webpack_require__(18);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__ionic_native_file_transfer__ = __webpack_require__(109);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__ionic_native_file__ = __webpack_require__(44);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};







/**
 * Generated class for the CachePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
var CachePage = /** @class */ (function () {
    function CachePage(loadingCtrl, navCtrl, navParams, httpClient, base, fileTransfer, file) {
        // if (localStorage.getItem('maintenanceCache') != null) {
        //       this.alldeviceCache = JSON.parse(localStorage.getItem('maintenanceCache'));
        //       for (let i = 0; i < this.alldeviceCache.length; ++i) {
        this.loadingCtrl = loadingCtrl;
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.httpClient = httpClient;
        this.base = base;
        this.fileTransfer = fileTransfer;
        this.file = file;
        this.record = [];
        this.indexList = [];
        this.have_submit = false;
        // username='';
        this.pp = [];
        //     }
        //   }    
        this.loadList();
    }
    CachePage.prototype.ionViewDidLoad = function () {
        console.log('ionViewDidLoad CachePage');
    };
    CachePage.prototype.postMaintenance = function (cache, httpClient, base) {
        if (cache.img == undefined) {
            return new Promise(function (resolve, reject) {
                httpClient.post('http://39.108.184.47:8081/auth_api/maintenance', {}, {
                    headers: { token: localStorage['token'] }, params: {
                        deviceId: cache.deviceId,
                        longitude: cache.longitude, latitude: cache.latitude, num: cache.num,
                        maleNum: cache.maleNum, femaleNum: cache.femaleNum, altitude: cache.altitude,
                        drug: cache.drug, remark: cache.remark, workingContent: cache.workingContent,
                        otherType: cache.otherType, otherNum: cache.otherNum
                    }
                }).toPromise().then(function (res) {
                    resolve('ok');
                    //  this.base.showAlert('提示', 'false'+res['data'], ()=>{});
                }, function (res) {
                    reject('error');
                });
            });
        }
        else {
            var options_1 = {};
            options_1.fileKey = "image";
            var time = Date.parse(Date());
            options_1.fileName = time + ".jpg";
            options_1.mimeType = "image/jpeg";
            options_1.chunkedMode = false;
            options_1.httpMethod = "POST";
            options_1.params = {
                deviceId: cache.deviceId, longitude: cache.longitude, latitude: cache.latitude, altitude: cache.altitude, num: cache.num,
                maleNum: cache.maleNum, femaleNum: cache.femaleNum, drug: cache.drug, remark: cache.remark,
                workingContent: cache.workingContent,
                otherType: cache.otherType, otherNum: cache.otherNum
            };
            options_1.headers = { token: localStorage['token'] };
            //创建文件对象
            var fileTransfer_1 = this.fileTransfer.create();
            return new Promise(function (resolve, reject) {
                fileTransfer_1.upload(cache.img, 'http://39.108.184.47:8081/auth_api/maintenance', options_1)
                    .then(function (res) {
                    // console.log(res);
                    resolve('ok');
                    //   if (!res['data']) {
                    //     reject('error')
                    //   } else {
                    //     resolve('ok')
                    //   }
                }, function (error) {
                    //   this.base.showAlert('提示', 'false2', ()=>{});
                    resolve('ok');
                    return new Promise(function (resolve, reject) {
                        httpClient.post('http://39.108.184.47:8081/auth_api/maintenance', {}, {
                            headers: { token: localStorage['token'] }, params: {
                                deviceId: cache.deviceId,
                                longitude: cache.longitude, latitude: cache.latitude, num: cache.num,
                                maleNum: cache.maleNum, femaleNum: cache.femaleNum, altitude: cache.altitude,
                                drug: cache.drug, remark: cache.remark, workingContent: cache.workingContent,
                                otherType: cache.otherType, otherNum: cache.otherNum
                            }
                        }).toPromise().then(function (res) {
                            console.log("OK");
                            resolve('ok');
                            //  this.base.showAlert('提示', 'false'+res['data'], ()=>{});
                        }, function (res) {
                            console.log("ERROR");
                            reject('error');
                        });
                    });
                    // console.log(error);
                    // reject('error')
                })
                    .catch(function (error) {
                    return new Promise(function (resolve, reject) {
                        httpClient.post('http://39.108.184.47:8081/auth_api/maintenance', {}, {
                            headers: { token: localStorage['token'] }, params: {
                                deviceId: cache.deviceId,
                                longitude: cache.longitude, latitude: cache.latitude, num: cache.num,
                                maleNum: cache.maleNum, femaleNum: cache.femaleNum, altitude: cache.altitude,
                                drug: cache.drug, remark: cache.remark, workingContent: cache.workingContent,
                                otherType: cache.otherType, otherNum: cache.otherNum
                            }
                        }).toPromise().then(function (res) {
                            console.log("OK");
                            resolve('ok');
                            //  this.base.showAlert('提示', 'false'+res['data'], ()=>{});
                        }, function (res) {
                            console.log("ERROR");
                            reject('error');
                        });
                    });
                    //发送失败(文件不存在等)
                    // alert("出错" + error);
                    // console.log(error);
                    //   this.base.showAlert('提示', 'false3', ()=>{});
                    // reject('error')
                });
            });
        }
    };
    CachePage.prototype.postDevice = function (device, httpClient, base) {
        return new Promise(function (resolve, reject) {
            httpClient.post(base.BASE_URL + 'auth_api/device', device, { headers: { token: localStorage['token'] } }).subscribe(function (res) {
                resolve('ok');
            }, function (res) {
                reject('error');
            }).catch(function (error) {
            });
        });
    };
    CachePage.prototype.postDeviceBeetle = function (deviceBeetle, httpClient, base) {
        return new Promise(function (resolve, reject) {
            httpClient.post(base.BASE_URL + 'auth_api/device_beetle', deviceBeetle, { headers: { token: localStorage['token'] } }).subscribe(function (res) {
                resolve('ok');
            }, function (res) {
                reject('error');
            }).catch(function (error) {
            });
        });
    };
    CachePage.prototype.postDeviceForest = function (deviceForest, httpClient, base) {
        return new Promise(function (resolve, reject) {
            httpClient.post(base.BASE_URL + 'auth_api/device_beetle', deviceForest, { headers: { token: localStorage['token'] } }).subscribe(function (res) {
                resolve('ok');
            }, function (res) {
                reject('error');
            }).catch(function (error) {
            });
        });
    };
    CachePage.prototype.submit = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            var loading, tmpDeviceList, _loop_1, this_1, i, i;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        loading = this.loadingCtrl.create({
                            content: '正在提交，请耐心等待'
                        });
                        loading.present();
                        this.have_submit = true;
                        tmpDeviceList = [];
                        this.alldeviceCache = [];
                        this.base.logger(JSON.stringify(this.deviceCache), "CachePar.txt");
                        _loop_1 = function (i) {
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, this_1.postMaintenance(this_1.deviceCache[i], this_1.httpClient, this_1.base).then(function (res) {
                                            //  this.base.showAlert('提示', '成功'+i, ()=>{});
                                            _this.base.logger("i=" + i + "# deviceId=" + _this.deviceCache[i].deviceId + "# " + JSON.stringify(res), "CacheRes1.txt");
                                        }, function (res) {
                                            //  this.base.showAlert('提示', '失败'+i, ()=>{});          
                                            tmpDeviceList.push(_this.deviceCache[i]);
                                            _this.base.logger("i=" + i + "# deviceId=" + _this.deviceCache[i].deviceId + "# " + JSON.stringify(res), "CacheRes2.txt");
                                        }).catch(function (error) {
                                            _this.base.logger("i=" + i + "# deviceId=" + _this.deviceCache[i].deviceId + "# " + JSON.stringify(error), "CacheError.txt");
                                        })];
                                    case 1:
                                        _a.sent();
                                        return [2 /*return*/];
                                }
                            });
                        };
                        this_1 = this;
                        i = 0;
                        _a.label = 1;
                    case 1:
                        if (!(i < this.deviceCache.length)) return [3 /*break*/, 4];
                        return [5 /*yield**/, _loop_1(i)];
                    case 2:
                        _a.sent();
                        _a.label = 3;
                    case 3:
                        ++i;
                        return [3 /*break*/, 1];
                    case 4:
                        for (i = 0; i < tmpDeviceList.length; ++i) {
                            this.indexList.push(tmpDeviceList[i]);
                        }
                        //this.alldeviceCache = tmpDeviceList;
                        localStorage.setItem('maintenanceCache', JSON.stringify(this.indexList));
                        loading.dismiss();
                        this.loadList();
                        return [2 /*return*/];
                }
            });
        });
    };
    CachePage.prototype.submit1 = function () {
        return __awaiter(this, void 0, void 0, function () {
            var indexList, tmpDeviceList, test, _loop_2, this_2, i, i, tmpDeviceBeetleList, _loop_3, this_3, i, i, tmpDeviceForestList, _loop_4, this_4, i, i;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        indexList = [];
                        tmpDeviceList = [];
                        test = null;
                        this.have_submit = true;
                        _loop_2 = function (i) {
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, this_2.postDevice(this_2.deviceCache[i], this_2.httpClient, this_2.base).then(function (res) {
                                        }, function (res) {
                                            indexList.push(i);
                                        }).catch(function (error) {
                                        })];
                                    case 1:
                                        _a.sent();
                                        return [2 /*return*/];
                                }
                            });
                        };
                        this_2 = this;
                        i = 0;
                        _a.label = 1;
                    case 1:
                        if (!(i < this.deviceCache.length)) return [3 /*break*/, 4];
                        return [5 /*yield**/, _loop_2(i)];
                    case 2:
                        _a.sent();
                        _a.label = 3;
                    case 3:
                        ++i;
                        return [3 /*break*/, 1];
                    case 4:
                        for (i = 0; i < indexList.length; ++i) {
                            tmpDeviceList.push(this.deviceCache[i]);
                        }
                        this.deviceCache = tmpDeviceList;
                        localStorage.setItem('deviceCache', JSON.stringify(this.deviceCache));
                        // this.loadList();
                        // 提交天牛信息
                        indexList = [];
                        tmpDeviceBeetleList = [];
                        _loop_3 = function (i) {
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, this_3.postDevice(this_3.deviceBeetleCache[i], this_3.httpClient, this_3.base).then(function (res) {
                                        }, function (res) {
                                            indexList.push(i);
                                        }).catch(function (error) {
                                        })];
                                    case 1:
                                        _a.sent();
                                        return [2 /*return*/];
                                }
                            });
                        };
                        this_3 = this;
                        i = 0;
                        _a.label = 5;
                    case 5:
                        if (!(i < this.deviceBeetleCache.length)) return [3 /*break*/, 8];
                        return [5 /*yield**/, _loop_3(i)];
                    case 6:
                        _a.sent();
                        _a.label = 7;
                    case 7:
                        ++i;
                        return [3 /*break*/, 5];
                    case 8:
                        for (i = 0; i < indexList.length; ++i) {
                            tmpDeviceBeetleList.push(this.deviceBeetleCache[i]);
                        }
                        this.deviceBeetleCache = tmpDeviceBeetleList;
                        localStorage.setItem('deviceBeetleCache', JSON.stringify(this.deviceBeetleCache));
                        // this.loadList();
                        // 提交森林信息
                        indexList = [];
                        tmpDeviceForestList = [];
                        _loop_4 = function (i) {
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, this_4.postDevice(this_4.deviceForestCache[i], this_4.httpClient, this_4.base).then(function (res) {
                                        }, function (res) {
                                            indexList.push(i);
                                        }).catch(function (error) {
                                        })];
                                    case 1:
                                        _a.sent();
                                        return [2 /*return*/];
                                }
                            });
                        };
                        this_4 = this;
                        i = 0;
                        _a.label = 9;
                    case 9:
                        if (!(i < this.deviceForestCache.length)) return [3 /*break*/, 12];
                        return [5 /*yield**/, _loop_4(i)];
                    case 10:
                        _a.sent();
                        _a.label = 11;
                    case 11:
                        ++i;
                        return [3 /*break*/, 9];
                    case 12:
                        for (i = 0; i < indexList.length; ++i) {
                            tmpDeviceForestList.push(this.deviceForestCache[i]);
                        }
                        this.deviceForestCache = tmpDeviceForestList;
                        localStorage.setItem('deviceForestCache', JSON.stringify(this.deviceForestCache));
                        //sd 卡上面
                        // this.file.createFile(this.file.applicationStorageDirectory, "new_file.txt", true).then(function (success) {
                        //   console.log(success);
                        //   // success
                        // }, function (error) {
                        //   console.log(error);
                        //   // error
                        // });
                        this.loadList();
                        return [2 /*return*/];
                }
            });
        });
    };
    CachePage.prototype.clear = function () {
        localStorage.removeItem('maintenanceCache');
        localStorage.removeItem('deviceCache');
        localStorage.removeItem('alldeviceCache');
        localStorage.removeItem('deviceBeetleCache');
        localStorage.removeItem('deviceForestCache');
        this.record = [];
    };
    CachePage.prototype.loadList = function () {
        var _this = this;
        this.record = [];
        this.deviceCache = []; //可以上传的
        this.alldeviceCache = []; //缓存全部的数据
        this.indexList = [];
        this.pp = [];
        //this.username=localStorage['username'];
        if (localStorage.getItem('maintenanceCache') != null) {
            //this.deviceCache = JSON.parse(localStorage.getItem('maintenanceCache'))
            this.alldeviceCache = JSON.parse(localStorage.getItem('maintenanceCache'));
            var _loop_5 = function (i) {
                this_5.pp[i] = 0;
                this_5.httpClient.get(this_5.base.BASE_URL + "auth_api/test_belongings", {
                    headers: { token: localStorage['token'] },
                    params: { deviceId: this_5.alldeviceCache[i].deviceId }
                })
                    .subscribe(function (res) {
                    if (!res['data']) {
                        //不属于的继续放缓存
                        _this.indexList.push(_this.alldeviceCache[i]);
                        _this.pp[i] = 1;
                        //  this.base.showAlert('不属于', this.alldeviceCache[i].deviceId, ()=>{});
                    }
                }, function () {
                });
                if (this_5.pp[i] == 0) {
                    //this.base.showAlert('my', this.alldeviceCache[i].deviceId, ()=>{});
                    this_5.deviceCache.push(this_5.alldeviceCache[i]);
                }
                this_5.record.push('设备:' + this_5.alldeviceCache[i]["deviceId"]);
            };
            var this_5 = this;
            for (var i = 0; i < this.alldeviceCache.length; ++i) {
                _loop_5(i);
            }
            //this.base.showAlert('不属于', this.indexList.length, ()=>{});
            //this.base.showAlert('属于', this.deviceCache.length, ()=>{});
        }
        // if (localStorage['deviceCache']) {
        //   this.deviceCache = JSON.parse(localStorage['deviceCache']);
        //   for (let i = 0; i < this.deviceCache.length; ++i) {
        //     this.record.push('设备:' + this.deviceCache[i]["id"])
        //   }
        // }
        //
        // this.deviceBeetleCache = [];
        // if (localStorage['deviceBeetleCache']) {
        //   this.deviceBeetleCache = JSON.parse(localStorage['deviceBeetleCache']);
        //   for (let i = 0; i < this.deviceBeetleCache.length; ++i) {
        //     this.record.push('设备天牛信息:' + this.deviceBeetleCache[i]["deviceId"])
        //   }
        // }
        //
        // this.deviceForestCache = [];
        // if (localStorage['deviceForestCache']) {
        //   this.deviceForestCache = JSON.parse(localStorage['deviceForestCache']);
        //   for (let i = 0; i < this.deviceForestCache.length; ++i) {
        //     this.record.push('设备森林信息:' + this.deviceForestCache[i]["deviceId"])
        //   }
        // }
    };
    CachePage = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["m" /* Component */])({
            selector: 'page-cache',template:/*ion-inline-start:"/Users/youkaiyu/Desktop/诱捕器项目/TrapAndroidFrontEnd的副本/src/pages/cache/cache.html"*/'<!--\n  Generated template for the CachePage page.\n\n  See http://ionicframework.com/docs/components/#navigation for more info on\n  Ionic pages and navigation.\n-->\n<ion-header>\n\n  <ion-navbar>\n    <ion-title>缓存页</ion-title>\n    \n  </ion-navbar>\n\n</ion-header>\n\n\n<ion-content padding >\n    <ion-buttons right>\n        <button ion-button marginRight="60px"  (click)="submit()"  [disabled]="have_submit">\n            提交\n          </button>   \n          <button ion-button  marginRight="60px" color="danger" (click)="clear()">\n            清除\n          </button></ion-buttons>\n \n    <ion-list>\n      <ion-item *ngFor="let item of record">\n        {{item}}\n      </ion-item>\n    </ion-list>\n    \n \n  \n\n</ion-content>\n'/*ion-inline-end:"/Users/youkaiyu/Desktop/诱捕器项目/TrapAndroidFrontEnd的副本/src/pages/cache/cache.html"*/,
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["e" /* LoadingController */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["f" /* NavController */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["g" /* NavParams */], __WEBPACK_IMPORTED_MODULE_2__angular_common_http__["a" /* HttpClient */],
            __WEBPACK_IMPORTED_MODULE_3__common_base_js__["a" /* Base */], __WEBPACK_IMPORTED_MODULE_4__ionic_native_file_transfer__["a" /* FileTransfer */], __WEBPACK_IMPORTED_MODULE_5__ionic_native_file__["a" /* File */]])
    ], CachePage);
    return CachePage;
}());

//# sourceMappingURL=cache.js.map

/***/ }),

/***/ 221:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return LoginPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(7);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__angular_common_http__ = __webpack_require__(14);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__tabs_tabs__ = __webpack_require__(222);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__common_base_js__ = __webpack_require__(18);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__ionic_native_native_page_transitions__ = __webpack_require__(57);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__detail_detail__ = __webpack_require__(110);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__scan_scan__ = __webpack_require__(56);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__ionic_native_in_app_browser__ = __webpack_require__(223);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};









/**
 * Generated class for the LoginPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
var LoginPage = /** @class */ (function () {
    function LoginPage(navCtrl, navParams, httpClient, base, nativePageTransitions, iAB) {
        var _this = this;
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.httpClient = httpClient;
        this.base = base;
        this.nativePageTransitions = nativePageTransitions;
        this.iAB = iAB;
        this.username = '';
        this.password = '';
        this.version = 3.1;
        this.callBack = function (params) {
            return new Promise(function (resolve, reject) {
                if (params) {
                    _this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_6__detail_detail__["a" /* DetailPage */], { id: params.id });
                }
                else {
                }
            });
        };
    }
    LoginPage.prototype.ionViewDidLoad = function () {
        var _this = this;
        console.log('ionViewDidLoad LoginPage');
        this.httpClient.get(this.base.BASE_URL + "app/version").subscribe(function (res) {
            var latestVersion = parseInt(res.toString(), 10);
            if (_this.version < latestVersion) {
                _this.base.showConfirmAlert("请更新", "请更新", function () {
                    // this.iAB.create("http://www.fjchenkang.com/app/app-debug.apk",'_system')
                    _this.iAB.create("http://39.108.184.47/app/app-debug.apk", '_system');
                }, function () { });
            }
        });
        if (localStorage['username'] && localStorage['password']) {
            this.username = localStorage['username'];
            this.password = localStorage['password'];
        }
        if (localStorage['token'] && localStorage['username'] && localStorage['password']) {
            this.auto_login();
        }
    };
    LoginPage.prototype.auto_login = function () {
        var _this = this;
        this.httpClient.post(this.base.BASE_URL + 'login', {}, { params: new __WEBPACK_IMPORTED_MODULE_2__angular_common_http__["c" /* HttpParams */]({ fromObject: { username: localStorage['username'], password: localStorage['password'] } }) })
            .subscribe(function (res) {
            console.log(res['token']);
            localStorage['token'] = res['token'];
            sessionStorage['isLogin'] = true;
            _this.nativePageTransitions.slide(_this.base.transitionOptions);
            _this.navCtrl.setRoot(__WEBPACK_IMPORTED_MODULE_3__tabs_tabs__["a" /* TabsPage */]);
        }, function (res) {
            sessionStorage['isLogin'] = true;
            _this.nativePageTransitions.slide(_this.base.transitionOptions);
            _this.navCtrl.setRoot(__WEBPACK_IMPORTED_MODULE_3__tabs_tabs__["a" /* TabsPage */]);
        });
    };
    LoginPage.prototype.login = function () {
        var _this = this;
        this.httpClient.post(this.base.BASE_URL + 'login', {}, { params: new __WEBPACK_IMPORTED_MODULE_2__angular_common_http__["c" /* HttpParams */]({ fromObject: { username: this.username, password: this.password } }) })
            .subscribe(function (res) {
            console.log(res['token']);
            localStorage['token'] = res['token'];
            // 直接把用户名密码存了
            localStorage['username'] = _this.username;
            localStorage['password'] = _this.password;
            _this.nativePageTransitions.slide(_this.base.transitionOptions);
            _this.navCtrl.setRoot(__WEBPACK_IMPORTED_MODULE_3__tabs_tabs__["a" /* TabsPage */]);
            sessionStorage['isLogin'] = true;
        }, function (res) {
            _this.base.showConfirmAlert('提示', '登录失败', function () {
            }, function () { });
        });
    };
    LoginPage.prototype.scan = function () {
        this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_7__scan_scan__["a" /* ScanPage */], { callBack: this.callBack });
    };
    LoginPage.prototype.test = function () {
        this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_6__detail_detail__["a" /* DetailPage */], { id: 1004 });
    };
    LoginPage.prototype.open_other_app = function () {
        var sApp = window.startApp.set({
            "application": "com.leduoworks.gpstoolbox"
        }).start();
        // startApp.set({
        //   "intent": "geo:38.899533,-77.036476",
        //   "flags": ["FLAG_ACTIVITY_NEW_TASK"]
        // }).start();
        // var sApp = (window as any).startApp.set({
        //   "package": "io.myapp"
        // });
        // sApp.start();
    };
    LoginPage = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["m" /* Component */])({
            selector: 'page-login',template:/*ion-inline-start:"/Users/youkaiyu/Desktop/诱捕器项目/TrapAndroidFrontEnd的副本/src/pages/login/login.html"*/'<!--\n  Generated template for the LoginPage page.\n\n  See http://ionicframework.com/docs/components/#navigation for more info on\n  Ionic pages and navigation.\n-->\n<ion-header>\n\n  <ion-navbar>\n    <ion-title>请登录</ion-title>\n  </ion-navbar>\n\n</ion-header>\n\n\n<ion-content padding>\n  <h1 style="text-align:center;">松墨天牛高效诱捕器管理和数据分析系统 v3.3</h1>\n  <ion-list>\n\n    <ion-item>\n      <ion-label>用户名</ion-label>\n      <ion-input type="text" [(ngModel)]="username"></ion-input>\n    </ion-item>\n\n    <ion-item>\n      <ion-label>密码</ion-label>\n      <ion-input type="password" [(ngModel)]="password"></ion-input>\n    </ion-item>\n\n  </ion-list>\n  <button ion-button="" block (click)="login()">登录</button>\n  <button ion-button="" block (click)="scan()">扫码</button>\n  <button ion-button="" block (click)="open_other_app()" hidden="true">测试打开其他app</button>\n  <!--<button ion-button="" block (click)="test()">测试不扫码</button>-->\n  <div><img src="assets/imgs/a.jpg" class="img1" > </div>\n  <style>\n    .img1{\n      display: table-cell; \n   vertical-align: middle;\n    text-align: center;\n\n  }\n  </style>\n\n\n  <ion-label style="text-align:center;">版权: 福建农林大学，福建辰康农林科技有限公司</ion-label>\n</ion-content>\n\n'/*ion-inline-end:"/Users/youkaiyu/Desktop/诱捕器项目/TrapAndroidFrontEnd的副本/src/pages/login/login.html"*/,
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["f" /* NavController */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["g" /* NavParams */], __WEBPACK_IMPORTED_MODULE_2__angular_common_http__["a" /* HttpClient */],
            __WEBPACK_IMPORTED_MODULE_4__common_base_js__["a" /* Base */], __WEBPACK_IMPORTED_MODULE_5__ionic_native_native_page_transitions__["a" /* NativePageTransitions */], __WEBPACK_IMPORTED_MODULE_8__ionic_native_in_app_browser__["a" /* InAppBrowser */]])
    ], LoginPage);
    return LoginPage;
}());

//# sourceMappingURL=login.js.map

/***/ }),

/***/ 222:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return TabsPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__about_about__ = __webpack_require__(214);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__home_home__ = __webpack_require__(216);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};



var TabsPage = /** @class */ (function () {
    // tab3Root = ContactPage;
    function TabsPage() {
        this.tab1Root = __WEBPACK_IMPORTED_MODULE_2__home_home__["a" /* HomePage */];
        this.tab2Root = __WEBPACK_IMPORTED_MODULE_1__about_about__["a" /* AboutPage */];
    }
    TabsPage = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["m" /* Component */])({template:/*ion-inline-start:"/Users/youkaiyu/Desktop/诱捕器项目/TrapAndroidFrontEnd的副本/src/pages/tabs/tabs.html"*/'<ion-tabs>\n  <ion-tab [root]="tab1Root" tabTitle="主页" tabIcon="home"></ion-tab>\n  <ion-tab [root]="tab2Root" tabTitle="地图" tabIcon="map"></ion-tab>\n  <!--<ion-tab [root]="tab3Root" tabTitle="信息" tabIcon="information-circle"></ion-tab>-->\n  <!--<ion-tab [root]="tab3Root" tabTitle="Contact" tabIcon="contacts"></ion-tab>-->\n</ion-tabs>\n'/*ion-inline-end:"/Users/youkaiyu/Desktop/诱捕器项目/TrapAndroidFrontEnd的副本/src/pages/tabs/tabs.html"*/
        }),
        __metadata("design:paramtypes", [])
    ], TabsPage);
    return TabsPage;
}());

//# sourceMappingURL=tabs.js.map

/***/ }),

/***/ 225:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return DeviceDataPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_ionic_angular__ = __webpack_require__(7);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__angular_common_http__ = __webpack_require__(14);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__common_base_js__ = __webpack_require__(18);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};




/**
 * Generated class for the DeviceDataPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
var DeviceDataPage = /** @class */ (function () {
    function DeviceDataPage(navCtrl, navParams, httpClient, base, changeDetectorRef) {
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.httpClient = httpClient;
        this.base = base;
        this.changeDetectorRef = changeDetectorRef;
        this.province = '';
        this.city = '';
        this.area = '';
    }
    DeviceDataPage.prototype.ionViewDidLoad = function () {
        console.log('ionViewDidLoad DeviceDataPage');
        this.loadProvince();
        this.role = parseInt(localStorage['role']);
    };
    DeviceDataPage.prototype.loadProvince = function () {
        var _this = this;
        var that = this;
        this.httpClient.get(this.base.BASE_URL + 'auth_api/dist/provinces', { headers: { token: localStorage['token'] } }).subscribe(function (res) {
            _this.provinceList = res;
            _this.changeDetectorRef.detectChanges();
        });
        this.city = '';
        this.area = '';
        this.cityList = [];
        this.areaList = [];
    };
    DeviceDataPage.prototype.loadCity = function () {
        var _this = this;
        var that = this;
        this.httpClient.get(this.base.BASE_URL + 'auth_api/dist/cities', { headers: { token: localStorage['token'] }, params: new __WEBPACK_IMPORTED_MODULE_2__angular_common_http__["c" /* HttpParams */]({ fromObject: { id: this.province } }) }).subscribe(function (res) {
            _this.cityList = res;
            _this.changeDetectorRef.detectChanges();
        });
    };
    DeviceDataPage.prototype.loadArea = function () {
        var _this = this;
        var that = this;
        this.httpClient.get(this.base.BASE_URL + 'auth_api/dist/areas', { headers: { token: localStorage['token'] }, params: new __WEBPACK_IMPORTED_MODULE_2__angular_common_http__["c" /* HttpParams */]({ fromObject: { id: this.city } }) }).subscribe(function (res) {
            _this.areaList = res;
            _this.changeDetectorRef.detectChanges();
        });
    };
    DeviceDataPage.prototype.query = function () {
        var _this = this;
        if (this.province == '') {
            this.base.showAlert('提示', '请选择省', function () { });
            return;
        }
        if (this.role == 2) {
            if (this.city == '') {
                this.base.showAlert('提示', '请选择市', function () { });
                return;
            }
        }
        if (this.role == 3) {
            if (this.city == '') {
                this.base.showAlert('提示', '请选择市', function () { });
                return;
            }
            if (this.area == '') {
                this.base.showAlert('提示', '请选择县', function () { });
                return;
            }
        }
        var adcode = '';
        if (this.province != '') {
            adcode = this.province;
        }
        if (this.city != '') {
            adcode = this.city;
        }
        if (this.area != '') {
            adcode = this.area;
        }
        this.httpClient.get(this.base.BASE_URL + 'auth_api/device_summary/detail', { headers: { token: localStorage['token'] }, params: new __WEBPACK_IMPORTED_MODULE_2__angular_common_http__["c" /* HttpParams */]({ fromObject: { adcode: adcode } }) }).subscribe(function (res) {
            _this.dataList = res['data'];
            _this.deviceCount = _this.dataList.length;
            _this.beetleCount = 0;
            for (var i = 0; i < _this.deviceCount; ++i) {
                _this.beetleCount += _this.dataList[i].num;
            }
        });
    };
    DeviceDataPage = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_1__angular_core__["m" /* Component */])({
            selector: 'device-data',template:/*ion-inline-start:"/Users/youkaiyu/Desktop/诱捕器项目/TrapAndroidFrontEnd的副本/src/pages/device-data/device-data.html"*/'<!--\n  Generated template for the DeviceDataPage page.\n\n  See http://ionicframework.com/docs/components/#navigation for more info on\n  Ionic pages and navigation.\n-->\n<ion-header>\n\n  <ion-navbar>\n    <ion-title>诱捕器数据</ion-title>\n  </ion-navbar>\n\n</ion-header>\n\n\n<ion-content padding>\n  <ion-item>\n    <ion-label>省</ion-label>\n    <ion-select cancelText="取消" okText="确定" [(ngModel)]="province" (ionChange)="loadCity()">\n      <ion-option *ngFor="let item of provinceList" value="{{item.code}}">\n        {{item.name}}\n      </ion-option>\n    </ion-select>\n  </ion-item>\n  <ion-item>\n    <ion-label>市</ion-label>\n    <ion-select cancelText="取消" okText="确定" [(ngModel)]="city" (ionChange)="loadArea()">\n      <ion-option *ngFor="let item of cityList" value="{{item.code}}">\n        {{item.name}}\n      </ion-option>\n    </ion-select>\n  </ion-item>\n  <ion-item>\n    <ion-label>县</ion-label>\n    <ion-select cancelText="取消" okText="确定" [(ngModel)]="area">\n      <ion-option *ngFor="let item of areaList" value="{{item.code}}">\n        {{item.name}}\n      </ion-option>\n    </ion-select>\n  </ion-item>\n  <button ion-button block (click)="query()">查询</button>\n  <div>诱捕器总数:{{deviceCount}}</div>\n  <div>总诱虫量:{{beetleCount}}</div>\n  <div style="width: 100%">\n    <table border="1" style="table-layout:fixed" width="100%">\n      <thead>\n      <th>ID</th>\n      <th>诱虫量</th>\n      <th>到场次数</th>\n      </thead>\n      <tbody>\n      <tr *ngFor="let item of dataList">\n        <th>{{item.id}}</th>\n        <th>{{item.num}}</th>\n        <th>{{item.count}}</th>\n      </tr>\n      </tbody>\n    </table>\n  </div>\n</ion-content>\n'/*ion-inline-end:"/Users/youkaiyu/Desktop/诱捕器项目/TrapAndroidFrontEnd的副本/src/pages/device-data/device-data.html"*/,
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_0_ionic_angular__["f" /* NavController */], __WEBPACK_IMPORTED_MODULE_0_ionic_angular__["g" /* NavParams */],
            __WEBPACK_IMPORTED_MODULE_2__angular_common_http__["a" /* HttpClient */], __WEBPACK_IMPORTED_MODULE_3__common_base_js__["a" /* Base */], __WEBPACK_IMPORTED_MODULE_1__angular_core__["j" /* ChangeDetectorRef */]])
    ], DeviceDataPage);
    return DeviceDataPage;
}());

//# sourceMappingURL=device-data.js.map

/***/ }),

/***/ 226:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_platform_browser_dynamic__ = __webpack_require__(227);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__app_module__ = __webpack_require__(247);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__angular_core__ = __webpack_require__(0);



Object(__WEBPACK_IMPORTED_MODULE_2__angular_core__["_14" /* enableProdMode */])();
Object(__WEBPACK_IMPORTED_MODULE_0__angular_platform_browser_dynamic__["a" /* platformBrowserDynamic */])().bootstrapModule(__WEBPACK_IMPORTED_MODULE_1__app_module__["a" /* AppModule */]);
//# sourceMappingURL=main.js.map

/***/ }),

/***/ 247:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return AppModule; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_platform_browser__ = __webpack_require__(34);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_ionic_angular__ = __webpack_require__(7);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__app_component__ = __webpack_require__(289);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__pages_about_about__ = __webpack_require__(214);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__pages_contact_contact__ = __webpack_require__(302);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__pages_home_home__ = __webpack_require__(216);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__pages_tabs_tabs__ = __webpack_require__(222);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__ionic_native_status_bar__ = __webpack_require__(204);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9__ionic_native_splash_screen__ = __webpack_require__(206);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_10__ionic_native_qr_scanner__ = __webpack_require__(55);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_11__pages_scan_scan__ = __webpack_require__(56);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_12__ionic_native_geolocation__ = __webpack_require__(45);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_13__angular_common_http__ = __webpack_require__(14);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_14__pages_login_login__ = __webpack_require__(221);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_15__common_base_js__ = __webpack_require__(18);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_16__pages_locate_locate__ = __webpack_require__(108);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_17__common_coordinate_convertor__ = __webpack_require__(215);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_18__ionic_native_native_page_transitions__ = __webpack_require__(57);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_19__pages_cache_cache__ = __webpack_require__(220);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_20__ionic_native_file__ = __webpack_require__(44);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_21__ionic_native_file_transfer__ = __webpack_require__(109);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_22__ionic_native_camera__ = __webpack_require__(107);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_23__pages_maintenance_maintenance__ = __webpack_require__(219);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_24__ionic_native_diagnostic__ = __webpack_require__(224);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_25__pages_detail_detail__ = __webpack_require__(110);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_26__pages_device_data_device_data__ = __webpack_require__(225);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_27__ionic_native_app_version__ = __webpack_require__(304);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_28__ionic_native_in_app_browser__ = __webpack_require__(223);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_29__pages_newhome_newhome__ = __webpack_require__(207);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_30__pages_newSwitchProject_newSwitchProject__ = __webpack_require__(208);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_31__pages_newTrap_newTrap__ = __webpack_require__(209);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_32__pages_newDry_newDry__ = __webpack_require__(210);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_33__pages_newDeadTree_newDeadTree__ = __webpack_require__(212);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_34__pages_newEnemy_newEnemy__ = __webpack_require__(211);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_35__pages_newTrack_newTrack__ = __webpack_require__(213);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};





































var MyErrorHandler = /** @class */ (function () {
    function MyErrorHandler(alerts, splashScreen, base) {
        this.alerts = alerts;
        this.splashScreen = splashScreen;
        this.base = base;
    }
    MyErrorHandler.prototype.handleError = function (err) {
        // do something with the error
        console.log(err);
        this.base.logger(JSON.stringify(err), "error.txt");
    };
    MyErrorHandler = __decorate([
        __param(0, Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["z" /* Inject */])(__WEBPACK_IMPORTED_MODULE_2_ionic_angular__["a" /* AlertController */])),
        __param(1, Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["z" /* Inject */])(__WEBPACK_IMPORTED_MODULE_9__ionic_native_splash_screen__["a" /* SplashScreen */])),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_2_ionic_angular__["a" /* AlertController */],
            __WEBPACK_IMPORTED_MODULE_9__ionic_native_splash_screen__["a" /* SplashScreen */],
            __WEBPACK_IMPORTED_MODULE_15__common_base_js__["a" /* Base */]])
    ], MyErrorHandler);
    return MyErrorHandler;
}());
var AppModule = /** @class */ (function () {
    function AppModule() {
    }
    AppModule = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["I" /* NgModule */])({
            declarations: [
                __WEBPACK_IMPORTED_MODULE_3__app_component__["a" /* MyApp */],
                __WEBPACK_IMPORTED_MODULE_4__pages_about_about__["a" /* AboutPage */],
                __WEBPACK_IMPORTED_MODULE_5__pages_contact_contact__["a" /* ContactPage */],
                __WEBPACK_IMPORTED_MODULE_6__pages_home_home__["a" /* HomePage */],
                __WEBPACK_IMPORTED_MODULE_7__pages_tabs_tabs__["a" /* TabsPage */],
                __WEBPACK_IMPORTED_MODULE_11__pages_scan_scan__["a" /* ScanPage */],
                __WEBPACK_IMPORTED_MODULE_29__pages_newhome_newhome__["a" /* NewHomePage */],
                __WEBPACK_IMPORTED_MODULE_32__pages_newDry_newDry__["a" /* DryPage */],
                __WEBPACK_IMPORTED_MODULE_33__pages_newDeadTree_newDeadTree__["a" /* DeadtreePage */],
                __WEBPACK_IMPORTED_MODULE_34__pages_newEnemy_newEnemy__["a" /* EnemyPage */],
                __WEBPACK_IMPORTED_MODULE_35__pages_newTrack_newTrack__["a" /* TrackPage */],
                __WEBPACK_IMPORTED_MODULE_14__pages_login_login__["a" /* LoginPage */],
                __WEBPACK_IMPORTED_MODULE_31__pages_newTrap_newTrap__["a" /* TrapPage */],
                __WEBPACK_IMPORTED_MODULE_30__pages_newSwitchProject_newSwitchProject__["a" /* switchProjectPage */],
                // DeviceBeetleFillPage,
                // DeviceForestFillPage,
                __WEBPACK_IMPORTED_MODULE_16__pages_locate_locate__["a" /* LocatePage */],
                __WEBPACK_IMPORTED_MODULE_19__pages_cache_cache__["a" /* CachePage */],
                // PhotoUploadPage,
                __WEBPACK_IMPORTED_MODULE_23__pages_maintenance_maintenance__["a" /* MaintenancePage */],
                __WEBPACK_IMPORTED_MODULE_25__pages_detail_detail__["a" /* DetailPage */],
                __WEBPACK_IMPORTED_MODULE_26__pages_device_data_device_data__["a" /* DeviceDataPage */]
            ],
            imports: [
                __WEBPACK_IMPORTED_MODULE_1__angular_platform_browser__["a" /* BrowserModule */],
                __WEBPACK_IMPORTED_MODULE_13__angular_common_http__["b" /* HttpClientModule */],
                __WEBPACK_IMPORTED_MODULE_2_ionic_angular__["d" /* IonicModule */].forRoot(__WEBPACK_IMPORTED_MODULE_3__app_component__["a" /* MyApp */], {
                    iconMode: 'ios',
                    mode: 'ios',
                    backButtonText: '返回'
                }, {
                    links: []
                })
            ],
            bootstrap: [__WEBPACK_IMPORTED_MODULE_2_ionic_angular__["c" /* IonicApp */]],
            entryComponents: [
                __WEBPACK_IMPORTED_MODULE_3__app_component__["a" /* MyApp */],
                __WEBPACK_IMPORTED_MODULE_4__pages_about_about__["a" /* AboutPage */],
                __WEBPACK_IMPORTED_MODULE_5__pages_contact_contact__["a" /* ContactPage */],
                __WEBPACK_IMPORTED_MODULE_6__pages_home_home__["a" /* HomePage */],
                __WEBPACK_IMPORTED_MODULE_7__pages_tabs_tabs__["a" /* TabsPage */],
                __WEBPACK_IMPORTED_MODULE_11__pages_scan_scan__["a" /* ScanPage */],
                __WEBPACK_IMPORTED_MODULE_29__pages_newhome_newhome__["a" /* NewHomePage */],
                __WEBPACK_IMPORTED_MODULE_32__pages_newDry_newDry__["a" /* DryPage */],
                __WEBPACK_IMPORTED_MODULE_33__pages_newDeadTree_newDeadTree__["a" /* DeadtreePage */],
                __WEBPACK_IMPORTED_MODULE_34__pages_newEnemy_newEnemy__["a" /* EnemyPage */],
                __WEBPACK_IMPORTED_MODULE_35__pages_newTrack_newTrack__["a" /* TrackPage */],
                __WEBPACK_IMPORTED_MODULE_30__pages_newSwitchProject_newSwitchProject__["a" /* switchProjectPage */],
                __WEBPACK_IMPORTED_MODULE_31__pages_newTrap_newTrap__["a" /* TrapPage */],
                __WEBPACK_IMPORTED_MODULE_14__pages_login_login__["a" /* LoginPage */],
                // DeviceBeetleFillPage,
                // DeviceForestFillPage,
                __WEBPACK_IMPORTED_MODULE_16__pages_locate_locate__["a" /* LocatePage */],
                __WEBPACK_IMPORTED_MODULE_19__pages_cache_cache__["a" /* CachePage */],
                // PhotoUploadPage,
                __WEBPACK_IMPORTED_MODULE_23__pages_maintenance_maintenance__["a" /* MaintenancePage */],
                __WEBPACK_IMPORTED_MODULE_25__pages_detail_detail__["a" /* DetailPage */],
                __WEBPACK_IMPORTED_MODULE_26__pages_device_data_device_data__["a" /* DeviceDataPage */]
            ],
            providers: [
                __WEBPACK_IMPORTED_MODULE_28__ionic_native_in_app_browser__["a" /* InAppBrowser */],
                __WEBPACK_IMPORTED_MODULE_27__ionic_native_app_version__["a" /* AppVersion */],
                __WEBPACK_IMPORTED_MODULE_8__ionic_native_status_bar__["a" /* StatusBar */],
                __WEBPACK_IMPORTED_MODULE_9__ionic_native_splash_screen__["a" /* SplashScreen */],
                __WEBPACK_IMPORTED_MODULE_10__ionic_native_qr_scanner__["a" /* QRScanner */],
                __WEBPACK_IMPORTED_MODULE_12__ionic_native_geolocation__["a" /* Geolocation */],
                __WEBPACK_IMPORTED_MODULE_15__common_base_js__["a" /* Base */],
                __WEBPACK_IMPORTED_MODULE_17__common_coordinate_convertor__["a" /* CoordinateConvertor */],
                __WEBPACK_IMPORTED_MODULE_18__ionic_native_native_page_transitions__["a" /* NativePageTransitions */],
                __WEBPACK_IMPORTED_MODULE_24__ionic_native_diagnostic__["a" /* Diagnostic */],
                __WEBPACK_IMPORTED_MODULE_22__ionic_native_camera__["a" /* Camera */],
                __WEBPACK_IMPORTED_MODULE_20__ionic_native_file__["a" /* File */],
                __WEBPACK_IMPORTED_MODULE_21__ionic_native_file_transfer__["a" /* FileTransfer */],
                { provide: __WEBPACK_IMPORTED_MODULE_0__angular_core__["u" /* ErrorHandler */], useClass: MyErrorHandler }
            ]
        })
    ], AppModule);
    return AppModule;
}());

//# sourceMappingURL=app.module.js.map

/***/ }),

/***/ 289:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return MyApp; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(7);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__ionic_native_status_bar__ = __webpack_require__(204);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__ionic_native_splash_screen__ = __webpack_require__(206);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__pages_newhome_newhome__ = __webpack_require__(207);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};





var MyApp = /** @class */ (function () {
    function MyApp(platform, statusBar, splashScreen) {
        this.rootPage = __WEBPACK_IMPORTED_MODULE_4__pages_newhome_newhome__["a" /* NewHomePage */];
        platform.ready().then(function () {
            // Okay, so the platform is ready and our plugins are available.
            // Here you can do any higher level native things you might need.
            statusBar.styleDefault();
            splashScreen.hide();
        });
    }
    MyApp = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["m" /* Component */])({template:/*ion-inline-start:"/Users/youkaiyu/Desktop/诱捕器项目/TrapAndroidFrontEnd的副本/src/app/app.html"*/'<ion-nav [root]="rootPage"></ion-nav>\n'/*ion-inline-end:"/Users/youkaiyu/Desktop/诱捕器项目/TrapAndroidFrontEnd的副本/src/app/app.html"*/
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["h" /* Platform */], __WEBPACK_IMPORTED_MODULE_2__ionic_native_status_bar__["a" /* StatusBar */], __WEBPACK_IMPORTED_MODULE_3__ionic_native_splash_screen__["a" /* SplashScreen */]])
    ], MyApp);
    return MyApp;
}());

//# sourceMappingURL=app.component.js.map

/***/ }),

/***/ 302:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return ContactPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(7);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};


var ContactPage = /** @class */ (function () {
    function ContactPage(navCtrl) {
        this.navCtrl = navCtrl;
    }
    ContactPage = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["m" /* Component */])({
            selector: 'page-contact',template:/*ion-inline-start:"/Users/youkaiyu/Desktop/诱捕器项目/TrapAndroidFrontEnd的副本/src/pages/contact/contact.html"*/'<ion-header>\n  <ion-navbar>\n    <ion-title>\n      Contact\n    </ion-title>\n  </ion-navbar>\n</ion-header>\n\n<ion-content>\n  <ion-list>\n    <ion-list-header>Follow us on Twitter</ion-list-header>\n    <ion-item>\n      <ion-icon name="ionic" item-start></ion-icon>\n      @ionicframework\n    </ion-item>\n  </ion-list>\n</ion-content>\n'/*ion-inline-end:"/Users/youkaiyu/Desktop/诱捕器项目/TrapAndroidFrontEnd的副本/src/pages/contact/contact.html"*/
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["f" /* NavController */]])
    ], ContactPage);
    return ContactPage;
}());

//# sourceMappingURL=contact.js.map

/***/ }),

/***/ 303:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return DeviceBeetleFillPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__device_forest_fill_device_forest_fill__ = __webpack_require__(217);

/**
 * Generated class for the DeviceBeetleFillPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
// @Component({
//   selector: 'page-device-beetle-fill',
//template:/*ion-inline-start:"/Users/youkaiyu/Desktop/诱捕器项目/TrapAndroidFrontEnd的副本/src/pages/device-beetle-fill/device-beetle-fill.html"*/'<!--\n  Generated template for the DeviceBeetleFillPage page.\n\n  See http://ionicframework.com/docs/components/#navigation for more info on\n  Ionic pages and navigation.\n-->\n<ion-header>\n\n  <ion-navbar>\n    <ion-title>天牛信息</ion-title>\n  </ion-navbar>\n\n</ion-header>\n\n\n<ion-content padding>\n  <ion-item>\n    <ion-label floating>更换次数</ion-label>\n    <ion-input type="number" value="" min="0"  [(ngModel)]="changeTimes"></ion-input>\n  </ion-item>\n  <ion-item>\n    <ion-label floating>天牛数量</ion-label>\n    <ion-input type="number" value="" min="0"  [(ngModel)]="beetleNum"></ion-input>\n  </ion-item>\n  <ion-item>\n    <ion-label floating>半径内死亡松树</ion-label>\n    <ion-input type="number" value="" min="0"  [(ngModel)]="pineDeathNum"></ion-input>\n  </ion-item>\n  <ion-item>\n    <!--<ion-label>样本是否存活</ion-label>-->\n    <div style="display: flex; flex-direction: row; justify-content: space-between; align-content: center">\n      <div>样本是否存活</div>\n      <input type="checkbox"  [(ngModel)]="sampleAlive" style="line-height: 100%; vertical-align: middle;"/>\n    </div>\n\n  </ion-item>\n  <ion-item>\n    <!--<ion-label>是否疫点小班</ion-label>-->\n    <div style="display: flex; flex-direction: row; justify-content: space-between; align-content: center">\n      <div>是否疫点小班</div>\n      <input type="checkbox"  [(ngModel)]="epidemicArea" style="line-height: 100%; vertical-align: middle;"/>\n    </div>\n\n  </ion-item>\n  <button ion-button="" (click)="submit()" block>提交</button>\n</ion-content>\n'/*ion-inline-end:"/Users/youkaiyu/Desktop/诱捕器项目/TrapAndroidFrontEnd的副本/src/pages/device-beetle-fill/device-beetle-fill.html"*/,
// })
var DeviceBeetleFillPage = /** @class */ (function () {
    function DeviceBeetleFillPage(navCtrl, navParams, httpClient, base, file) {
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.httpClient = httpClient;
        this.base = base;
        this.file = file;
        // 更换次数
        this.changeTimes = '';
        // 天牛数量
        this.beetleNum = '';
        // 半径内死亡松树
        this.pineDeathNum = '';
    }
    DeviceBeetleFillPage.prototype.ionViewDidLoad = function () {
        console.log('ionViewDidLoad DeviceBeetleFillPage');
    };
    DeviceBeetleFillPage.prototype.submit = function () {
        var _this = this;
        console.log("提交");
        var deviceBeetle = {};
        deviceBeetle["deviceId"] = this.navParams.get("id");
        deviceBeetle["changeTimes"] = this.changeTimes;
        deviceBeetle["beetleNum"] = this.beetleNum;
        deviceBeetle["sampleAlive"] = this.sampleAlive;
        deviceBeetle["epidemicArea"] = this.epidemicArea;
        this.httpClient.post(this.base.BASE_URL + 'auth_api/device_beetle', deviceBeetle, { headers: { token: localStorage['token'] } }).subscribe(function (res) {
            console.log(res);
        }, function (res) {
            alert('上传失败，缓存记录');
            // 缓存记录到localStorage中
            var deviceBeetleCache;
            deviceBeetleCache = localStorage.getItem('deviceBeetleCache');
            if (deviceBeetleCache == null) {
                deviceBeetleCache = [];
            }
            else {
                deviceBeetleCache = JSON.parse(deviceBeetleCache);
            }
            deviceBeetleCache.push(deviceBeetle);
            _this.file.writeFile(_this.file.externalDataDirectory, "new_file5.txt", JSON.stringify(deviceBeetleCache), { replace: true }).then(function (success) {
                console.log("newfile5");
                console.log(success);
                // success
            }, function (error) {
                console.log(error);
                // error
            });
            localStorage.setItem('deviceBeetleCache', JSON.stringify(deviceBeetleCache));
        }, function () {
        });
        this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_0__device_forest_fill_device_forest_fill__["a" /* DeviceForestFillPage */], { id: this.navParams.get('id') });
    };
    return DeviceBeetleFillPage;
}());

//# sourceMappingURL=device-beetle-fill.js.map

/***/ }),

/***/ 56:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return ScanPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(7);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__angular_common_http__ = __webpack_require__(14);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__ionic_native_qr_scanner__ = __webpack_require__(55);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__ionic_native_native_page_transitions__ = __webpack_require__(57);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__common_base_js__ = __webpack_require__(18);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};






/**
 * Generated class for the ScanPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
var ScanPage = /** @class */ (function () {
    function ScanPage(navCtrl, navParams, qrScanner, httpClient, viewCtrl, toastCtrl, nativePageTransitions, base) {
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.qrScanner = qrScanner;
        this.httpClient = httpClient;
        this.viewCtrl = viewCtrl;
        this.toastCtrl = toastCtrl;
        this.nativePageTransitions = nativePageTransitions;
        this.base = base;
        this.isShow = false; //控制显示背景，避免切换页面卡顿
        //默认为false
        this.light = false;
        this.frontCamera = false;
        this.callBack = this.navParams.get('callBack');
    }
    ScanPage.prototype.ionViewDidLoad = function () {
        var _this = this;
        this.qrScanner.prepare()
            .then(function (status) {
            if (status.authorized) {
                // camera permission was granted
                // start scanning
                _this.scanSub = _this.qrScanner.scan().subscribe(function (text) {
                    // alert(text)
                    // alert(text);
                    var geshi = true;
                    if (text.length != 15) {
                        geshi = false;
                    }
                    if (geshi) {
                        var shuzi = "1234567890";
                        for (var i = 0; i < text.length; i++) {
                            var c = text.charAt(i);
                            // indexof返回的是数字。。。。。。之前怎么可以的
                            if (shuzi.indexOf(c) < 0) {
                                geshi = false;
                            }
                        }
                    }
                    if (geshi) {
                        // let id = text.split('id:')[1];
                        var id_1 = text;
                        var device = {
                            "id": id_1,
                            "latitude": sessionStorage['latitude'],
                            "longitude": sessionStorage['longitude'],
                            "altitude": sessionStorage['altitude']
                        };
                        _this.hideCamera();
                        if (_this.scanSub) {
                            _this.scanSub.unsubscribe();
                        }
                        if (_this.qrScanner) {
                            _this.qrScanner.destroy();
                        }
                        _this.navCtrl.pop().then(function () {
                            _this.callBack({ id: id_1 });
                        });
                        /**
                        this.httpClient.post('http://39.108.184.47:8081/auth_api/device', device,
                                                      47.103.66.70
                          {headers: {token: localStorage['token']}}).subscribe(res => {
                          this.qrScanner.hide(); // hide camera preview
                          this.scanSub.unsubscribe(); // stop scanning
                          this.qrScanner.destroy();
                          this.toast('提交成功');
                          // this.navCtrl.pop();
                          this.nativePageTransitions.slide(this.base.transitionOptions);
                          // this.viewCtrl.dismiss({id: id});
                          // this.navCtrl.push(DeviceBeetleFillPage, {id: id});
                          // this.navCtrl.pop();
          
                          // pop返回方法
                          this.navCtrl.pop().then(() => {
                            this.callBack(id);
                          })
                        }, res => {
                          alert('上传失败，缓存记录');
                          // 缓存记录到localStorage中
                          let deviceCache: any;
                          deviceCache = localStorage.getItem('deviceCache');
                          if (deviceCache == null) {
                            deviceCache = [];
                          } else {
                            deviceCache = JSON.parse(deviceCache);
                          }
                          deviceCache.push(device);
                          localStorage.setItem('deviceCache', JSON.stringify(deviceCache));
                          this.qrScanner.hide(); // hide camera preview
                          this.scanSub.unsubscribe(); // stop scanning
                          this.qrScanner.destroy();
                          // this.toast('提交成功');
                          // this.navCtrl.pop();
                          this.nativePageTransitions.slide(this.base.transitionOptions);
                          // this.viewCtrl.dismiss({id: id});
                          // this.navCtrl.push(DeviceBeetleFillPage, {id: id});
                          // this.navCtrl.pop();
          
                          // pop返回方法
                          this.navCtrl.pop().then(() => {
                            this.callBack(id);
                          })
                        });
                        **/
                    }
                    else {
                        // 先注释掉这里
                        //this.toast('请扫描正确的二维码');
                        _this.base.showAlert('提示', '请扫描正确的二维码', function () { });
                    }
                    // this.qrScanner.hide(); // hide camera preview
                    // scanSub.unsubscribe(); // stop scanning
                    // this.qrScanner.destroy();
                    // this.nativePageTransitions.slide(this.base.transitionOptions);
                    // this.navCtrl.pop();
                });
                // show camera preview
                _this.qrScanner.show();
                // wait for user to scan something, then the observable callback will be called
            }
            else if (status.denied) {
                // camera permission was permanently denied
                // you must use QRScanner.openSettings() method to guide the user to the settings page
                // then they can grant the permission from there
            }
            else {
                // permission was denied, but not permanently. You can ask for permission again at a later time.
            }
        })
            .catch(function (e) { return console.log('Error is', e); });
    };
    ScanPage.prototype.autoScan = function () {
        var _this = this;
        var name = 'deviceid';
        var myid = '';
        this.base.showPrompt("可手动输入设备id", name, function (data) {
            myid = data[name];
            // this.base.showAlert('提示',myid,()=>{});
            var geshi = true;
            if (myid.length != 12) {
                geshi = false;
                //  this.base.showAlert('提示',myid.length,()=>{});
            }
            if (geshi) {
                // this.base.showAlert('提示','b',()=>{});
                var shuzi = "1234567890";
                for (var i = 0; i < myid.length; i++) {
                    var c = myid.charAt(i);
                    // indexof返回的是数字。。。。。。之前怎么可以的
                    if (shuzi.indexOf(c) < 0) {
                        geshi = false;
                    }
                }
            }
            if (geshi) {
                // this.base.showAlert('提示','c',()=>{});
                // let id = text.split('id:')[1];
                var id_2 = myid;
                if (_this.scanSub) {
                    _this.scanSub.unsubscribe();
                }
                if (_this.qrScanner) {
                    _this.qrScanner.destroy();
                }
                _this.navCtrl.pop().then(function () {
                    // this.base.showAlert('提示','d',()=>{});
                    _this.callBack({ id: id_2 });
                });
            }
            else {
                _this.base.showAlert('提示', '二维码格式有误，请重新输入', function () { });
            }
            // return
        }, function () { });
    };
    ScanPage.prototype.ionViewDidEnter = function () {
        //页面可见时才执行
        this.showCamera();
        this.isShow = true; //显示背景
    };
    /**
     * 闪光灯控制，默认关闭
     */
    ScanPage.prototype.toggleLight = function () {
        if (this.light) {
            this.qrScanner.disableLight();
        }
        else {
            this.qrScanner.enableLight();
        }
        this.light = !this.light;
    };
    /**
     * 前后摄像头互换
     */
    ScanPage.prototype.toggleCamera = function () {
        if (this.frontCamera) {
            this.qrScanner.useBackCamera();
        }
        else {
            this.qrScanner.useFrontCamera();
        }
        this.frontCamera = !this.frontCamera;
    };
    ScanPage.prototype.showCamera = function () {
        window.document.querySelector('ion-app').classList.add('cameraView');
    };
    ScanPage.prototype.hideCamera = function () {
        window.document.querySelector('ion-app').classList.remove('cameraView');
        this.qrScanner.hide(); //需要关闭扫描，否则相机一直开着
    };
    ScanPage.prototype.ionViewWillLeave = function () {
        this.hideCamera();
        if (this.scanSub) {
            this.scanSub.unsubscribe();
        }
        if (this.qrScanner) {
            this.qrScanner.destroy();
        }
    };
    ScanPage.prototype.toast = function (text) {
        var toast = this.toastCtrl.create({
            message: text,
            duration: 2000,
            position: 'bottom'
        });
        toast.onDidDismiss(function () {
        });
        toast.present();
    };
    ScanPage = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["m" /* Component */])({
            selector: 'page-scan',template:/*ion-inline-start:"/Users/youkaiyu/Desktop/诱捕器项目/TrapAndroidFrontEnd的副本/src/pages/scan/scan.html"*/'<!--\n  Generated template for the ScanPage page.\n\n  See http://ionicframework.com/docs/components/#navigation for more info on\n  Ionic pages and navigation.\n-->\n<ion-header >\n  <ion-navbar >\n  \n    <ion-title>扫描中……</ion-title>\n    <ion-buttons end>\n    <button  ion-button position=\'margin-right\' (click)="autoScan()">输入</button>\n  </ion-buttons>\n  </ion-navbar>\n\n</ion-header>\n<ion-content no-scroll [ngClass]="{\'qrscanner\':isShow}" >\n  <div [ngClass]="{\'qrscanner-area\':isShow}">\n  </div>\n  <div  [ngClass]="{\'through-line\':isShow}"></div>\n  <div class="button-bottom">\n    <button (click)="toggleLight()" ion-fab class="icon-camera" margin-right>\n      <ion-icon name="flash"></ion-icon>\n    </button>\n    <button (click)="toggleCamera()" ion-fab class="icon-camera">\n      <ion-icon name="reverse-camera"></ion-icon>\n    </button>\n  </div>\n  \n</ion-content>\n\n'/*ion-inline-end:"/Users/youkaiyu/Desktop/诱捕器项目/TrapAndroidFrontEnd的副本/src/pages/scan/scan.html"*/,
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["f" /* NavController */],
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["g" /* NavParams */],
            __WEBPACK_IMPORTED_MODULE_3__ionic_native_qr_scanner__["a" /* QRScanner */],
            __WEBPACK_IMPORTED_MODULE_2__angular_common_http__["a" /* HttpClient */],
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["j" /* ViewController */],
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["i" /* ToastController */],
            __WEBPACK_IMPORTED_MODULE_4__ionic_native_native_page_transitions__["a" /* NativePageTransitions */],
            __WEBPACK_IMPORTED_MODULE_5__common_base_js__["a" /* Base */]])
    ], ScanPage);
    return ScanPage;
}());

//# sourceMappingURL=scan.js.map

/***/ })

},[226]);
//# sourceMappingURL=main.js.map