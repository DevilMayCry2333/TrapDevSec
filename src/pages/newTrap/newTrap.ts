import {Component} from '@angular/core';
import {QRScanner} from '@ionic-native/qr-scanner';
import {NavController} from 'ionic-angular';
import {HttpClient, HttpParams} from "@angular/common/http";
import {ScanPage} from '../scan/scan'
import {Base} from '../../common/base.js'
import {Subscription} from "rxjs/Subscription";
import {Geolocation} from "@ionic-native/geolocation";
import {ChangeDetectorRef} from '@angular/core';
import {Camera, CameraOptions} from "@ionic-native/camera";
import {FileTransfer, FileTransferObject, FileUploadOptions} from "@ionic-native/file-transfer";
import {AboutPage} from '../about/about';
import {TrapQueryPage} from '../trap-query/trap-query';
import {File} from "@ionic-native/file";
import {LoadingController} from 'ionic-angular';
import {AlertController} from 'ionic-angular';
import {Platform, Events} from 'ionic-angular';
import {Network} from '@ionic-native/network'
import {ToastController} from 'ionic-angular';

@Component({
    selector: 'app-trap',
    templateUrl: 'newTrap.html',
})
export class TrapPage {
    deviceId: string 
    deviceSerial: string
    longtitude = "1.2"
    latitude = "1.2"
    altitude = "1.2"
    accuracy = "1.2"
    // longtitude: string
    // latitude: string
    // altitude: string
    // accuracy: string
    BeetleType: string
    injectTypeValue: string
    WorkContentValue: string
    indexList = [];

    isDisabled = false;
    picNotExist = false;

    canInput=true;

    have_submit: boolean
    imageData: null

    remarks = ''

    newbettle: string
    otherbettle: string
    // otherbettle="0"
    otherbettleType: any[]
    injectType: any[]
    workContent: any[]
    observers = [];
    isComplete = false;
    isSubProcessFin = false;
    // 定位订阅
    subscription: Subscription;
    // 是否定位成功
    location_ready = false;


    users: any[] = [
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
    curOptions: any;

    constructor(public navCtrl: NavController,
                public qrScanner: QRScanner,
                private base: Base,
                private alertCtrl: AlertController,
                private geolocation: Geolocation,
                private changeDetectorRef: ChangeDetectorRef,
                private httpClient: HttpClient,
                private camera: Camera,
                private fileTransfer: FileTransfer,
                public loadingCtrl: LoadingController,
                private file: File,
                public platform: Platform,
                public events: Events,
                public network: Network,
                public toast: ToastController) {
         
        this.checkNetWork();
        // this.testCache();
    }

    otherTypeSelect() {
        //  
        // console.log(this.otherbettleType[0])
        // console.log(this.otherbettleType[0].name)
        //  
        //  
        var otherId ='';
        var len=this.otherbettleType.length;
        for(var n=0;n<len;n++){
            //  
            //  
            //  
            if(this.otherbettleType[n].name=="无"){
                otherId=this.otherbettleType[n].id;
            }
        }
    
        if(otherId==this.BeetleType){
            this.canInput = true;
            this.otherbettle="0";
        }else {
            this.canInput = false;
        }

        
    }

    async test() {
        localStorage.removeItem('maintenanceCache');
        //一秒3500,4000报错
        for (var i = 0; i < 1; i++) {
             
            this.deviceId = Math.ceil(i + 10000).toString();
            this.longtitude = ((Math.random() * 0.1 + 119.23113951284115)).toString();
            this.latitude = ((Math.random() * 0.1 + 26.083115579358804)).toString();
            this.newbettle = "2";
            this.altitude = "14";
            this.injectTypeValue = "增强型";
            this.WorkContentValue = "3";
            this.otherbettle = "7";
            this.BeetleType = "7";
            // await new Promise((resovle,reject)=>{
            this.httpClient.post(this.base.BASE_URL + 'auth_api/maintenance', {},
                {
                    headers: {token: localStorage['token']}, params: {
                        deviceId: this.deviceId,
                        longitude: this.longtitude, latitude: this.latitude, num: this.newbettle,
                        maleNum: "1", femaleNum: "1", altitude: this.altitude,
                        drug: this.injectTypeValue, remark: this.remarks, workingContent: this.WorkContentValue,
                        otherNum: this.otherbettle, otherType: this.BeetleType
                    }
                }).toPromise().then(res => {
                // resovle('ok');
            }, (msg) => {
                // reject('error');
            });
            // })


        }

        // Base.popTo(this.navCtrl, 'switchProjectPage');


    }

    NavToQuery() {
        if (this.deviceId) {
            localStorage["TrapDeviceId"] = this.deviceId;
            this.navCtrl.push(TrapQueryPage);
        } else {
            this.base.showAlert("提示", "请先扫码或输入数字的设备ID!", () => {
            });

        }

    }

    bindNewId() {
        if (this.deviceId == undefined || this.deviceId == "" || this.deviceSerial == undefined || this.deviceSerial == "") {
            this.base.showAlert("提示", "请先输入设备ID和设备编号!", () => {
            })
        } else {
            this.httpClient.post(this.base.BASE_URL + 'app/bindId', {},
                {
                    headers: {token: localStorage['token']}, params: {
                        scanId: this.deviceId, serial: this.deviceSerial,
                        username: localStorage['username']
                    }
                })
                .subscribe(res => {
                     
                     
                    this.base.logger(JSON.stringify(res), "NonImg_maintenance_submit_function_fileTransferRes.txt");
                    this.base.showAlert('提示', '提交成功', () => {
                    });
                     

                    Base.popTo(this.navCtrl, 'switchProjectPage');
                }, (msg) => {

                    this.base.logger(JSON.stringify(msg), "NonImg_maintenance_submit_function_fileTransferError.txt");

                    this.base.showAlert("提交", "提交失败", () => {
                    });
                     
                     
                    var transferParam = {scanId: this.deviceId, serial: this.deviceSerial};
                    let BindIdCache: any;
                    BindIdCache = localStorage.getItem('trapBind');

                    if (BindIdCache == null) {
                        BindIdCache = [];
                    } else {
                        BindIdCache = JSON.parse(BindIdCache);
                    }
                    BindIdCache.push(transferParam);

                    localStorage.setItem("trapBind", JSON.stringify(BindIdCache));
                });

        }
        // this.httpClient.post(this.base.BASE_URL + 'app/bindId', {},
        //     {
        //         headers: { token: localStorage['token'] },
        //         params: new HttpParams({ fromObject: { scanId: this.deviceId, serial: this.deviceSerial } })
        //     })
        //     .subscribe(res => {
        //          
        //         this.base.showAlert("成功", "", () => { });
        //     },(msg) => {
        //          

        //              


        //         })
    }

    takePhoto() {
        const options: CameraOptions = {
            quality: 10,
            destinationType: this.camera.DestinationType.FILE_URI,
            sourceType: 1,
            encodingType: this.camera.EncodingType.JPEG,
            mediaType: this.camera.MediaType.PICTURE,
            allowEdit: false,
            correctOrientation: true,
            saveToPhotoAlbum: true
        };
        this.camera.getPicture(options).then((imageData) => {
            // this.submit(imageData)
            // this.navCtrl.popToRoot()
            this.imageData = imageData;
        }, (err) => {
            // Handle error
            // this.navCtrl.popToRoot()
        }).catch((error) => {
            console.log(error)
        });
    }

    resolvedList: Array<boolean>;
    xhr = false;

    postMaintenance(element, httpClient, base, tmpStorage, i) {
        /*if (this.xhr || this.resolvedList[i]) {
            return new Promise(() => {});
        }*/
        if (this.xhr) return;
        this.xhr = true;
        var that = this;
         
         

        if (element.img != null) {
            let options: FileUploadOptions = {};
            options.fileKey = "image";
            var time = Date.parse(Date());
            options.fileName = time + ".jpg";
            options.mimeType = "image/jpeg";
            options.chunkedMode = false;
            options.httpMethod = "POST";
            options.params = {
                deviceId: element.deviceId,
                longitude: element.longitude, latitude: element.latitude, num: element.num,
                maleNum: "1", femaleNum: "1", altitude: element.altitude,
                drug: element.drug, remark: element.remark, workingContent: element.workingContent,
                otherNum: element.otherNum, otherType: element.otherType, allLength: tmpStorage.length, curRow: i
            };
            options.headers = {token: localStorage['token']};
             
             


            //创建文件对象
            const fileTransfer: FileTransferObject = this.fileTransfer.create();
            that.curOptions = options.params;

            this.base.logger(JSON.stringify(options), "Img_maintenance_submit_function_fileTransferPar.txt");
            return new Promise((resolve, reject) => {
                fileTransfer.upload(element.img, this.base.BASE_URL + 'auth_api/maintenance', options)
                    .then((res) => {
                         
                         
                         

                         
                        if (JSON.parse(res.response).isComp == true) {
                            that.isComplete = true;
                        } else {
                            that.isComplete = false;
                        }

                        resolve('ok');

                    }, async (msg) => {
                         
                        await httpClient.post(this.base.BASE_URL + 'auth_api/maintenance', {},
                            {
                                headers: {token: localStorage['token']}, params: {
                                    deviceId: element.deviceId,
                                    longitude: element.longitude,
                                    latitude: element.latitude,
                                    num: element.num,
                                    maleNum: "1",
                                    femaleNum: "1",
                                    altitude: element.altitude,
                                    drug: element.drug,
                                    remark: element.remark,
                                    workingContent: element.workingContent,
                                    otherNum: element.otherNum,
                                    otherType: element.otherType,
                                    allLength: tmpStorage.length,
                                    curRow: i.toString()
                                }
                            })
                            .toPromise().then(res => {
                                 
                                if (JSON.parse(JSON.stringify(res)).isComp == true) {
                                    that.isComplete = true;
                                } else {
                                    that.isComplete = false;
                                }
                                that.isSubProcessFin = true;
                                // that.base.showAlert("提示", "无图片提交成功", () => { });
                                resolve('ok');
                            }, msg => {
                                 
                                that.isSubProcessFin = false;
                                reject('error');
                            })
                        if (that.isSubProcessFin == true) {
                            resolve('ok');
                        } else {
                            reject('error');
                        }
                        reject('error');
                    })
            })

            // if(that.picNotExist){
            //     let obs = await new Promise((resolve, reject) => {
            //         this.httpClient.post(this.base.BASE_URL + 'auth_api/maintenance', {},
            //             {
            //                 headers: { token: localStorage['token'] }, params: {
            //                     deviceId: element.deviceId,
            //                     longitude: element.longitude, latitude: element.latitude, num: element.num,
            //                     maleNum: "1", femaleNum: "1", altitude: element.altitude,
            //                     drug: element.drug, remark: element.remark, workingContent: element.workingContent,
            //                     otherNum: element.otherNum, otherType: element.otherType, allLength: tmpStorage.length, curRow: i.toString()
            //                 }
            //             })
            //             .toPromise().then(res => {
            //                  
            //                 if (JSON.parse(JSON.stringify(res)).isComp == true){
            //                     this.isComplete = true;
            //                 }else{
            //                     this.isComplete = false;
            //                 }
            //                 this.base.showAlert("提示", "无图片提交成功", () => { });
            //                 resolve('ok');
            //             }, msg => {
            //                  
            //                 reject('error');
            //             })

            //     }).catch((error) => {
            //          
            //     });
            //     that.observers.push(obs);
            // }


        } else {
            return new Promise((resolve, reject) => {
                 
                 
                this.xhr = httpClient.post(this.base.BASE_URL + 'auth_api/maintenance', {},
                    {
                        headers: {token: localStorage['token']}, params: {
                            deviceId: element.deviceId,
                            longitude: element.longitude,
                            latitude: element.latitude,
                            num: element.num,
                            maleNum: "1",
                            femaleNum: "1",
                            altitude: element.altitude,
                            drug: element.drug,
                            remark: element.remark,
                            workingContent: element.workingContent,
                            otherNum: element.otherNum,
                            otherType: element.otherType,
                            allLength: tmpStorage.length,
                            curRow: i.toString()
                        }
                    }).pipe(/*publishReplay()*//*share()*//*timeout(30000)*/)/*.timeout(1000)*/.toPromise().then(res => {
                     
                     
                    if (JSON.parse(JSON.stringify(res)).isComp == true) {
                        that.isComplete = true;
                    } else {
                        that.isComplete = false;
                    }
                    resolve('ok');
                }, (msg) => {
                     
                    reject('error');
                    // this.base.showAlert('提示', '提交失败', () => { });
                });
            })
        }
    }

    ionViewDidEnter() {
         
    }

    static checkNetworkState: boolean = false;

    checkNetWork() {
        this.events.subscribe('ONLINE', () => {
            if (!TrapPage.checkNetworkState) {
                this.checkPostMaintenanceCache();
                this.checkPostBindCache();
                TrapPage.checkNetworkState = true;
            }
        });
        this.events.subscribe('OFFLINE', () => {
            if (TrapPage.checkNetworkState) {
                //TODO
                TrapPage.checkNetworkState = false;
            }
        });
    }

    testCache() {
         
        let maintenanceCache: any;
        for (let i = 0; i < 100; i++) {
            const cacheExp = {
                deviceId: "10005",
                longitude: ((Math.random() * 0.1 + 119.23113951284115)).toString(),
                latitude: ((Math.random() * 0.1 + 26.083115579358804)).toString(),
                num: (i + 1).toString(),
                maleNum: "1",
                femaleNum: "1",
                altitude: "1.2",
                drug: "增强型",
                remark: "SB",
                workingContent: "3",
                otherNum: "666",
                otherType: "7"
            };
            maintenanceCache = localStorage.getItem('maintenanceCache');
            if (maintenanceCache == null) {
                maintenanceCache = [];
            } else {
                maintenanceCache = JSON.parse(maintenanceCache);
            }
            maintenanceCache.push(cacheExp);
            localStorage.setItem('maintenanceCache', JSON.stringify(maintenanceCache));
        }
    }

    preSubmitted = 0;
    curSubmitted = 0;

    checkPostMaintenanceCache() {
         
         
        if (this.curSubmitted >= this.preSubmitted) {
            if (localStorage["maintenanceCache"]) {
                (async () => {
                    const tmpStorage = JSON.parse(localStorage["maintenanceCache"]);
                     
                    this.preSubmitted = tmpStorage.length;
                    let tmpDeviceList = [];
                    this.indexList = [];
                    // this.resolvedList = new Array<boolean>(tmpStorage.length);
                    // this.resolvedList.fill(false);
                    let resolved = 0, rejected = 0;
                    for (let i = 0; i < tmpStorage.length; ++i) {
                        this.xhr = false;
                        await this.postMaintenance(tmpStorage[i], this.httpClient, this.base, tmpStorage, i).then(
                            res => {
                                 
                                 
                                resolved++;
                                // this.resolvedList[i] = true;
                            }, msg => {
                                 
                                 
                                rejected++;
                                // if (!this.resolvedList[i])
                                tmpDeviceList.push(tmpStorage[i]);
                            }
                        ).catch((error) => {
                             
                        });
                        this.curSubmitted = resolved + rejected;
                    }
                     
                     
                    this.preSubmitted = resolved + rejected;
                    for (let i = 0; i < tmpDeviceList.length; ++i) {
                        this.indexList.push(tmpDeviceList[i]);
                         
                    }
                     
                     
                    if (this.indexList.length <= 0) {
                         
                        localStorage.removeItem('maintenanceCache');
                        this.preSubmitted = 0;
                        this.curSubmitted = 0;
                    } else {
                        localStorage.setItem('maintenanceCache', JSON.stringify(this.indexList));
                    }
                })()/*.then(/!*todo*!/)()*/;
            }
        }
    }

    checkPostBindCache() {
        let i = 0;
        if (localStorage["trapBind"]) {
            var tmpStorage2 = [];

            tmpStorage2 = JSON.parse(localStorage["trapBind"]);

             
            // localStorage.removeItem("trapBind");

             

            tmpStorage2.forEach(element => {
                 

                 
                 

                this.httpClient.post(this.base.BASE_URL + 'app/bindId', {},
                    {
                        headers: {token: localStorage['token']},
                        params: new HttpParams({fromObject: {scanId: element.scanId, serial: element.serial}})
                    })
                    .subscribe(res => {
                             
                            i++;
                            if (tmpStorage2.length == i) {
                                localStorage.removeItem("trapBind");
                            }
                        },
                        msg => {
                        })
            })
        }
    }

    async ionViewDidLoad() {
         
         
         
         
         
         
        // localStorage.removeItem('maintenanceCache');
         
        if (localStorage["TrapWorkContent"]) {
             
            this.workContent = JSON.parse(localStorage["TrapWorkContent"]);
             
             
        }

        if (localStorage["otherbettleType"]) {
             
            this.otherbettleType = JSON.parse(localStorage["otherbettleType"]);
             
             
        }

        if (localStorage["TrapinjectType"]) {
             
            this.injectType = JSON.parse(localStorage["TrapinjectType"]);
             
             
        }


        var i = 0;
        /*if (localStorage["trapBind"]) {
            var tmpStorage2 = [];

            tmpStorage2 = JSON.parse(localStorage["trapBind"]);

             
            // localStorage.removeItem("trapBind");

             

            tmpStorage2.forEach(element => {
                 

                 
                 

                this.httpClient.post(this.base.BASE_URL + 'app/bindId', {},
                    {
                        headers: {token: localStorage['token']},
                        params: new HttpParams({fromObject: {scanId: element.scanId, serial: element.serial}})
                    })
                    .subscribe(res => {
                             
                            i++;
                            this.base.showAlert("提示", "成功绑定了", () => {
                            });
                            if (tmpStorage2.length == i) {
                                localStorage.removeItem("trapBind");
                                this.base.showAlert("提示", "清理了缓存", () => {
                                });
                            }
                        },
                        msg => {

                        })

            })


        }*/

        var that = this;
        /*if (localStorage["maintenanceCache"]) {
            const alert = this.alertCtrl.create({
                title: "有缓存数据，是否提交?",
                subTitle: "提示：4G以下网络环境提交时间可能会延长，建议Wi-Fi状况良好或者4G网络环境下提交。",
                buttons: [
                    {
                        text: '确认', handler: async () => {
                             
                            var tmpStorage = JSON.parse(localStorage["maintenanceCache"]);
                            let tmpDeviceList = [];
                            const loader = this.loadingCtrl.create({
                                content: "缓存数据正在提交，请勿退出",
                            });
                            loader.present();
                            // tmpStorage.forEach(element => {
                            for (let i = 0; i < tmpStorage.length; ++i) {
                                await this.postMaintenance(tmpStorage[i], this.httpClient, this.base, tmpStorage, i).then(
                                    res => {
                                         
                                         
                                    }, msg => {
                                         
                                         
                                        tmpDeviceList.push(tmpStorage[i]);
                                    }
                                ).catch((error) => {
                                     
                                })
                            }
                            for (let i = 0; i < tmpDeviceList.length; ++i) {
                                this.indexList.push(tmpDeviceList[i]);
                                 
                            }
                             
                             
                            if (this.indexList.length <= 0) {
                                 
                                localStorage.removeItem('maintenanceCache');
                            } else {
                                localStorage.setItem('maintenanceCache', JSON.stringify(this.indexList));
                            }
                            loader.dismiss();
                        }
                    }, {
                        text: '取消', handler: () => {
                             

                        }
                    }]
            });
            alert.present();

        }*/


        this.httpClient.post(this.base.BASE_URL + 'app/getBeetle', {},
            {
                headers: {token: localStorage['token']},
                params: new HttpParams({fromObject: {username: localStorage['username']}})
            })
            .subscribe(res => {
                    var c: any = res;
                    this.otherbettleType = Array.from(c);
                     
                    localStorage['otherbettleType'] = JSON.stringify(res);

                },
                res => {
                     
                })


        this.httpClient.post(this.base.BASE_URL + 'app/getInject', {},
            {
                headers: {token: localStorage['token']},
                params: new HttpParams({fromObject: {username: localStorage['username']}})
            })
            .subscribe(res => {
                    var c: any = res;
                    this.injectType = Array.from(c);
                     

                    localStorage['TrapinjectType'] = JSON.stringify(res);

                },
                res => {
                     
                })


        this.httpClient.post(this.base.BASE_URL + 'app/getWorkContent', {},
            {
                headers: {token: localStorage['token']},
                params: new HttpParams({fromObject: {username: localStorage['username']}})
            })
            .subscribe(res => {
                    var c: any = res;
                    this.workContent = Array.from(c);
                     
                     

                    localStorage['TrapWorkContent'] = JSON.stringify(res);

                },
                res => {
                     
                })

    }

    NavToMap() {
        this.navCtrl.push(AboutPage, {
            project: '1'
        });
    }



    callBack = (params) => {
        return new Promise((resolve, reject) => {
            if (params) {
                 
                var allDevice = JSON.parse(localStorage["device"]);
                 
                 
                 

                var flag = 0;
                 
                allDevice.forEach(element => {
                     
                    //  
                    if ((element.scanId == params.id && element.id.charAt(8) == '1')){
                        flag = 1;
                        this.deviceSerial = element.customSerial;
                    }
                });
                if (flag == 1) {
                    this.deviceId = params.id;
                    let options = {
                        enableHighAccuracy: true,
                        timeout: 99999999,
                        maximumAge: 0
                    };
                    let that = this
                    let watch = this.geolocation.watchPosition(options);
                    let tmp;
                    let tmp2;
                    console.log(watch);
                    this.subscription = watch.subscribe((data) => {
                        tmp = data;
                        console.log("GPS数据:" + data);
                        // data can be a set of coordinates, or an error (if an error occurred).
                        if (data['coords']) {
                            // setTimeout(() => {
                            this.latitude = String(data.coords.latitude);
                            sessionStorage['latitude'] = String(data.coords.latitude);
                            this.longtitude = String(data.coords.longitude);
                            sessionStorage['longitude'] = String(data.coords.longitude);
                            this.altitude = String(data.coords.altitude);
                            sessionStorage['altitude'] = String(data.coords.altitude);

                            this.accuracy = String(data.coords.accuracy);

                            // 不是可以在这里直接判断海拔是不是null吗。。。。
                            if (data.coords.altitude == null) {
                                this.altitude = '-10000';
                                sessionStorage['altitude'] = '-10000';
                                //this.base.showAlert('提示','gps信号弱，请等待',()=>{});

                            }
                            setTimeout(() => {
                                //this.location_ready = true;
                                this.location_ready = true;
                                that.changeDetectorRef.detectChanges()

                            }, 5000);
                            // document.getElementById('latitude').innerText="纬度:" + sessionStorage['latitude']
                            // document.getElementById('longitude').innerText="经度:" + sessionStorage['longitude']
                            // document.getElementById('altitude').innerText="海拔:" + sessionStorage['altitude']
                            // document.getElementById('sumbit_button').removeAttribute('disabled')
                            that.changeDetectorRef.detectChanges()
                            // },5);
                            // if(this.altitude==null){
                            //   this.location_ready = false;
                            //   this.base.showAlert('提示','海拔获取失败，请重新获取',()=>{});
                            // }
                        }
                        // else{
                        //   this.base.showAlert('提示','gps信号弱，请等待',()=>{});
                        // }
                    }, (res) => {
                        tmp2 = res;
                        console.log("错误数据:" + res);
                        // setTimeout(() => {
                        //    this.base.showAlert('提示','wu',()=>{});
                        this.location_ready = false;
                        that.changeDetectorRef.detectChanges()

                        // 这个是在数据更新后。。。强制刷一下页面。。。放在数据变更后才有用。。。
                        // },5);

                        // alert();
                    });
                    console.log(tmp);
                    console.log(tmp2);
                    
                    this.base.showConfirmAlert("成功", params.id, () => {
                    }, () => {
                    })
                } else {
                    this.base.showConfirmAlert("二维码无效", params.id, () => {
                    }, () => {
                    })
                }
            } else {

            }
        });
    };

    trapClick() {
         
    }

    scan() {
         
         
        this.navCtrl.push(ScanPage, {callBack: this.callBack});
    }

    test2() {
        localStorage.removeItem('maintenanceCache');
    }

    submit() {
        this.isDisabled = true;
        this.have_submit = true;
         
         
         
        //let num1 = 0;
        var r = /^(0|[1-9]\d*)$/;
        var flag1=r.test(this.newbettle);
        var flag2=r.test(this.otherbettle );
         
         
        // if (parseInt(this.newbettle) < 0 || parseInt(this.newbettle) == NaN) {
        //     this.base.showAlert('提示', '请输入数字', () => { });
        //     this.newbettle = "";
        // }
        // if (!this.newbettle) {
        //     this.base.showAlert('提示', '请输入数字', () => { });
        // }
        // num1 = parseInt(this.newbettle);
        // this.newbettle = '' + num1;
        // if (this.newbettle == 'NaN') {
        //     this.newbettle = "";
        //      this.base.showAlert('提示', '请输入数字', () => { });
        // }

        // let num2 = 0;
        // if (parseInt(this.otherbettle) < 0 || parseInt(this.otherbettle) == NaN) {
        //     this.otherbettle = "";
        //     this.base.showAlert('提示', '请输入数字', () => { });
        // }
        // if (!this.otherbettle) {
        //     this.otherbettle = "";
        //     this.base.showAlert('提示', '请输入数字', () => { });
        // }
        // num2 = parseInt(this.otherbettle);
        // this.otherbettle = '' + num2;
        // if (this.otherbettle == 'NaN') {
        //     this.otherbettle = "";
        //     this.base.showAlert('提示', '请输入数字', () => { });
        // }


        const beizhu = this.remarks.replace(/\s/g, '');
        const ischeck = /[^\a-\zA-\Z0-9\u4E00-\u9FA5]/;

        if (ischeck.test(beizhu)) {
            //this.remark = '';
            this.base.showAlert('提示', '备注存在不合法字符', () => {
            });
        } else {
            if (!flag1 || !flag2 || !this.otherbettle || this.otherbettle == 'NaN' || parseInt(this.otherbettle) < 0 || parseInt(this.otherbettle) >999999999 || parseInt(this.otherbettle) == NaN || this.newbettle == 'NaN' || !this.newbettle || parseInt(this.newbettle) < 0 || parseInt(this.newbettle) > 999999999|| parseInt(this.newbettle) == NaN || !this.altitude || !this.longtitude || !this.latitude || !this.accuracy || !this.injectTypeValue || !this.WorkContentValue || !this.BeetleType || !this.newbettle || !this.otherbettle) {
                this.base.showAlert("提示", "数据未填写，或填写格式错误！", () => {
                });
            } else {
                if (this.imageData != null) {
                    let options: FileUploadOptions = {};
                    options.fileKey = "image";
                    var time = Date.parse(Date());
                    options.fileName = time + ".jpg";
                    options.mimeType = "image/jpeg";
                    options.chunkedMode = false;
                    options.httpMethod = "POST";
                    options.params = {
                        deviceId: this.deviceId,
                        longitude: this.longtitude, latitude: this.latitude, num: this.newbettle,
                        maleNum: "1", femaleNum: "1", altitude: this.altitude,
                        drug: this.injectTypeValue, remark: this.remarks, workingContent: this.WorkContentValue,
                        otherNum: this.otherbettle, otherType: this.BeetleType
                    };
                    options.headers = {token: localStorage['token']};
                     
                     


                    //创建文件对象
                    const fileTransfer: FileTransferObject = this.fileTransfer.create();


                    this.base.logger(JSON.stringify(options), "Img_maintenance_submit_function_fileTransferPar.txt");

                    if (!this.otherbettle || this.otherbettle == 'NaN' || parseInt(this.otherbettle) < 0 || parseInt(this.otherbettle) >999999999 || parseInt(this.otherbettle) == NaN || this.newbettle == 'NaN' || !this.newbettle || parseInt(this.newbettle) < 0 || parseInt(this.newbettle) > 999999999|| parseInt(this.newbettle) == NaN || !this.altitude || !this.longtitude || !this.latitude || !this.accuracy || !this.injectTypeValue || !this.WorkContentValue || !this.BeetleType) {
                        this.base.showAlert("提示", "数据未填写，或填写格式错误！", () => {
                        });
                        return;
                    }

                    fileTransfer.upload(this.imageData, this.base.BASE_URL + 'auth_api/maintenance', options)
                        .then((res) => {
                             
                             
                             

                            this.base.logger(JSON.stringify(res), "Img_maintenance_submit_function_fileTransferRes.txt");

                            this.base.showAlert('提示', '提交成功', () => {
                            });
                            Base.popTo(this.navCtrl, 'switchProjectPage');
                        }, (error) => {//发送失败(网络出错等)
                            this.base.showAlert('提示', '提交失败', () => {
                            });
                            this.base.logger(JSON.stringify(error), "Img_maintenance_submit_function_fileTransferError.txt");

                            let cacheData = {
                                deviceId: this.deviceId,
                                longitude: this.longtitude, latitude: this.latitude, num: this.newbettle,
                                maleNum: "1", femaleNum: "1", altitude: this.altitude,
                                drug: this.injectTypeValue, remark: this.remarks, workingContent: this.WorkContentValue,
                                otherNum: this.otherbettle, otherType: this.BeetleType,
                                img: this.imageData
                            };
                            let maintenanceCache: any;
                            maintenanceCache = localStorage.getItem('maintenanceCache');
                            if (maintenanceCache == null) {
                                maintenanceCache = [];
                            } else {
                                maintenanceCache = JSON.parse(maintenanceCache);
                            }
                            maintenanceCache.push(cacheData);
                            //localStorage安全保存数据
                            // try{
                            //   localStorage.setItem('maintenanceCache', JSON.stringify(maintenanceCache));
                            // }catch(oException){
                            //     if(oException.name == 'QuotaExceededError'){
                            //         this.base.showAlert('提示', '无法提交，缓存容量不足，请及时处理', ()=>{});
                            //         // 
                            //             // 可进行超出限定大小之后的操作，如下面可以先清除记录，再次保存
                            //       // localStorage.clear();
                            //       // localStorage.setItem(key,value);
                            //     }
                            // }

                            localStorage.setItem('maintenanceCache', JSON.stringify(maintenanceCache));
                            //this.navCtrl.pop();
                            // confirm.dismiss()
                            Base.popTo(this.navCtrl, 'switchProjectPage');
                        })
                        .catch((error) => {//发送失败(文件不存在等)
                            this.httpClient.post(this.base.BASE_URL + 'auth_api/maintenance', {},
                                {
                                    headers: {token: localStorage['token']}, params: {
                                        deviceId: this.deviceId,
                                        longitude: this.longtitude,
                                        latitude: this.latitude,
                                        num: this.newbettle,
                                        maleNum: "1",
                                        femaleNum: "1",
                                        altitude: this.altitude,
                                        drug: this.injectTypeValue,
                                        remark: this.remarks,
                                        workingContent: this.WorkContentValue,
                                        otherNum: this.otherbettle,
                                        otherType: this.BeetleType
                                    }
                                })
                                .subscribe(res => {
                                     
                                     
                                    this.base.logger(JSON.stringify(res), "NonImg_maintenance_submit_function_fileTransferRes.txt");
                                    this.base.showAlert('提示', '提交成功', () => {
                                    });
                                    let cacheData = {
                                        deviceId: this.deviceId,
                                        longitude: this.longtitude,
                                        latitude: this.latitude,
                                        num: this.newbettle,
                                        maleNum: "1",
                                        femaleNum: "1",
                                        altitude: this.altitude,
                                        drug: this.injectTypeValue,
                                        remark: this.remarks,
                                        workingContent: this.WorkContentValue,
                                        otherNum: this.otherbettle,
                                        otherType: this.BeetleType
                                    };
                                     
                                     
                                })
                        })

                } else {
                    let options: FileUploadOptions = {};
                    options.params = {
                        deviceId: this.deviceId,
                        longitude: this.longtitude, latitude: this.latitude, num: this.newbettle,
                        maleNum: "1", femaleNum: "1", altitude: this.altitude,
                        drug: this.injectTypeValue, remark: this.remarks, workingContent: this.WorkContentValue,
                        otherNum: this.otherbettle, otherType: this.BeetleType
                    };
                    this.base.logger(JSON.stringify(options), "NonImg_TrapPar.txt");
                    if (!this.otherbettle || this.otherbettle == 'NaN' || parseInt(this.otherbettle) < 0 || parseInt(this.otherbettle) > 999999999|| parseInt(this.otherbettle) == NaN || this.newbettle == 'NaN' || !this.newbettle || parseInt(this.newbettle) < 0 || parseInt(this.newbettle) > 999999999|| parseInt(this.newbettle) == NaN || !this.altitude || !this.longtitude || !this.latitude || !this.accuracy || !this.injectTypeValue || !this.WorkContentValue || !this.BeetleType ) {
                        this.base.showAlert("提示", "数据未填写，或填写格式错误！", () => {
                        });
                        return;
                    }
                    this.httpClient.post(this.base.BASE_URL + 'auth_api/maintenance', {},
                        {
                            headers: {token: localStorage['token']}, params: {
                                deviceId: this.deviceId,
                                longitude: this.longtitude, latitude: this.latitude, num: this.newbettle,
                                maleNum: "1", femaleNum: "1", altitude: this.altitude,
                                drug: this.injectTypeValue, remark: this.remarks, workingContent: this.WorkContentValue,
                                otherNum: this.otherbettle, otherType: this.BeetleType
                            }
                        })
                        .subscribe(res => {
                             
                             
                            this.base.logger(JSON.stringify(res), "NonImg_maintenance_submit_function_fileTransferRes.txt");
                            this.base.showAlert('提示', '提交成功', () => {
                            });
                            let cacheData = {
                                deviceId: this.deviceId,
                                longitude: this.longtitude, latitude: this.latitude, num: this.newbettle,
                                maleNum: "1", femaleNum: "1", altitude: this.altitude,
                                drug: this.injectTypeValue, remark: this.remarks, workingContent: this.WorkContentValue,
                                otherNum: this.otherbettle, otherType: this.BeetleType
                            };
                             
                             

                            Base.popTo(this.navCtrl, 'switchProjectPage');
                        }, (msg) => {

                            this.base.logger(JSON.stringify(msg), "NonImg_maintenance_submit_function_fileTransferError.txt");

                            this.base.showAlert('提示', '提交失败', () => {
                            });
                            let cacheData = {
                                deviceId: this.deviceId,
                                longitude: this.longtitude, latitude: this.latitude, num: this.newbettle,
                                maleNum: "1", femaleNum: "1", altitude: this.altitude,
                                drug: this.injectTypeValue, remark: this.remarks, workingContent: this.WorkContentValue,
                                otherNum: this.otherbettle, otherType: this.BeetleType
                            };
                             
                             

                            let maintenanceCache: any;
                            maintenanceCache = localStorage.getItem('maintenanceCache');
                            if (maintenanceCache == null) {
                                maintenanceCache = [];
                            } else {
                                maintenanceCache = JSON.parse(maintenanceCache);
                            }
                            maintenanceCache.push(cacheData);
                            // try{
                            //   localStorage.setItem('maintenanceCache', JSON.stringify(maintenanceCache));
                            // }catch(oException){
                            //     if(oException.name == 'QuotaExceededError'){
                            //         this.base.showAlert('提示', '无法提交，缓存容量不足，请及时处理', ()=>{});
                            //         // 
                            //             // 可进行超出限定大小之后的操作，如下面可以先清除记录，再次保存
                            //       // localStorage.clear();
                            //       // localStorage.setItem(key,value);
                            //     }
                            // }
                            localStorage.setItem('maintenanceCache', JSON.stringify(maintenanceCache));
                             

                            //this.navCtrl.pop();
                            // confirm.dismiss();
                            Base.popTo(this.navCtrl, 'switchProjectPage');
                        });

                }
            }
        }

    }

    deviceIdInput() {
         
         
        let num1 = 0;
        if (parseInt(this.deviceId) < 0 || parseInt(this.deviceId) == NaN) {
            this.base.showAlert('提示', '设备ID不合法', () => {
            });
        }
        if (!this.deviceId) {
            this.base.showAlert('提示', '设备ID不合法', () => {
            });
        }
        num1 = parseInt(this.deviceId);
        this.deviceId = '' + num1;
        if (this.deviceId == 'NaN') {
            this.base.showAlert('提示', '设备ID不合法', () => {
            });
        }

    }

    newBettleInput() {
        let num1 = 0;
        if (parseInt(this.newbettle) < 0 || parseInt(this.newbettle) == NaN) {
            this.base.showAlert('提示', '请输入数字', () => {
            });
        }
        if (!this.newbettle) {
            this.base.showAlert('提示', '请输入数字', () => {
            });
        }
        num1 = parseInt(this.newbettle);
        this.newbettle = '' + num1;
        if (this.newbettle == 'NaN') {
            this.base.showAlert('提示', '请输入数字', () => {
            });
        }
    }

    otherBettleInput() {
        let num1 = 0;
        if (parseInt(this.otherbettle) < 0 || parseInt(this.otherbettle) == NaN) {
            this.base.showAlert('提示', '请输入数字', () => {
            });
        }
        if (!this.otherbettle) {
            this.base.showAlert('提示', '请输入数字', () => {
            });
        }
        num1 = parseInt(this.otherbettle);
        this.otherbettle = '' + num1;
        if (this.otherbettle == 'NaN') {
            this.base.showAlert('提示', '请输入数字', () => {
            });
        }
    }

    deviceSerialInput() {
         
    }

}
