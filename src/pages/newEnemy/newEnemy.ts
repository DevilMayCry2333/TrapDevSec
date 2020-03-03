import {Component} from '@angular/core';
import {QRScanner, QRScannerStatus} from '@ionic-native/qr-scanner';
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
import {EnemyQueryPage} from '../enemy-query/enemy-query';
import {LoadingController} from 'ionic-angular';
import {AlertController} from 'ionic-angular';
import {Events} from 'ionic-angular';

@Component({
    selector: 'app-enemy',
    templateUrl: 'newEnemy.html'
})
export class EnemyPage {
    // longtitude = "1.1234567";
    // latitude = "1.1234567";
    // altitude = "1.1234567";
    // accuracy = "1.1234567";

    deviceId: string
    deviceSerial: string
    subscription: Subscription;

    longtitude: string
    latitude: string
    altitude: string
    accuracy: string

    imageData: null

    predatorsTypeValue: string
    have_submit: boolean
    releaseNum: string
    enemyType: any[]
    indexList = [];
    location_ready: boolean
    remarks = ""
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
    observers = [];
    isComplete = false;
    isSubProcessFin = false;

    constructor(
        public qrScanner: QRScanner,
        private base: Base,
        private alertCtrl: AlertController,
        private geolocation: Geolocation,
        private changeDetectorRef: ChangeDetectorRef,
        private httpClient: HttpClient,
        private camera: Camera,
        private fileTransfer: FileTransfer,
        public navCtrl: NavController,
        public loadingCtrl: LoadingController,
        public events: Events
    ) {
        this.checkNetWork();
        // this.testCache();
    }

    static checkNetworkState: boolean = false;

    checkNetWork() {
        this.events.subscribe('ONLINE', () => {
            if (!EnemyPage.checkNetworkState) {
                this.checkPostMaintenanceCache();
                this.checkPostBindCache();
                EnemyPage.checkNetworkState = true;
            }
        });
        this.events.subscribe('OFFLINE', () => {
            if (EnemyPage.checkNetworkState) {
                //TODO
                EnemyPage.checkNetworkState = false;
            }
        });
    }

    preSubmitted = 0;
    curSubmitted = 0;

    checkPostMaintenanceCache() {
        if (this.curSubmitted >= this.preSubmitted) {
            if (localStorage["enemyCache"]) {
                (async () => {
                    const tmpStorage = JSON.parse(localStorage["enemyCache"]);
                    this.preSubmitted = tmpStorage.length;
                    let tmpDeviceList = [];
                    this.indexList = [];
                    let resolved = 0, rejected = 0;
                    for (let i = 0; i < tmpStorage.length; ++i) {
                        await this.postEnemy(tmpStorage[i], this.httpClient, this.base, tmpStorage, i).then(
                            res => {
                                 
                                 
                                resolved++;
                            }, msg => {
                                 
                                 
                                rejected++;
                                tmpDeviceList.push(tmpStorage[i]);
                            }
                        ).catch((error) => {
                             
                        });
                        this.curSubmitted = resolved + rejected;
                    }
                    for (let i = 0; i < tmpDeviceList.length; ++i) {
                        this.indexList.push(tmpDeviceList[i]);
                         
                    }
                     
                     
                    if (this.indexList.length <= 0) {
                         
                        localStorage.removeItem('enemyCache');
                        this.preSubmitted = 0;
                        this.curSubmitted = 0;
                    } else {
                        localStorage.setItem('enemyCache', JSON.stringify(this.indexList));
                    }
                })();
            }
        }
    }

    checkPostBindCache() {
        if (localStorage["eneBind"]) {
            var tmpStorage2 = [];

            tmpStorage2 = JSON.parse(localStorage["eneBind"]);

             
            // localStorage.removeItem("trapBind");

             
            var i = 0;

            tmpStorage2.forEach(element => {

                 

                 
                 

                this.httpClient.post(this.base.BASE_URL + 'app/bindId', {},
                    {
                        headers: {token: localStorage['token']},
                        params: new HttpParams({fromObject: {scanId: element.scanId, serial: element.serial}})
                    })
                    .subscribe(res => {
                             
                            i++;
                            this.base.showAlert("成功绑定了", "", () => {
                            });
                            if (tmpStorage2.length == i) {
                                localStorage.removeItem("eneBind");
                                this.base.showAlert("清理了缓存", "", () => {
                                });
                            }
                        },
                        msg => {

                        })

            })


        }
    }

    NavToMap() {
        this.navCtrl.push(AboutPage, {
            project: '3'
        });
    }

    releaseNumInput() {
        let num1 = 0;
        if (parseInt(this.releaseNum) < 0 || parseInt(this.releaseNum) == NaN) {
            this.base.showAlert('提示', '请输入数字', () => {
            });
        }
        if (!this.releaseNum) {
            this.base.showAlert('提示', '请输入数字', () => {
            });
        }
        num1 = parseInt(this.releaseNum);
        this.releaseNum = '' + num1;
        if (this.releaseNum == 'NaN') {
            this.base.showAlert('提示', '请输入数字', () => {
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
                        scanId: this.deviceId, serial: this.deviceSerial, username: localStorage['username']
                    }
                })
                .subscribe(res => {
                     
                     
                    this.base.logger(JSON.stringify(res), "NonImg_maintenance_submit_function_fileTransferRes.txt");
                    this.base.showAlert('提示', '提交成功', () => {
                    });
                     

                    Base.popTo(this.navCtrl, 'switchProjectPage');
                }, (msg) => {

                    this.base.logger(JSON.stringify(msg), "NonImg_maintenance_submit_function_fileTransferError.txt");

                    this.base.showAlert("提交失败", "提交失败", () => {
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

                    localStorage.setItem("eneBind", JSON.stringify(BindIdCache));
                });
        }
    }

    postEnemy(element, httpClient, base, tmpStorage, i) {
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
                longitude: element.longitude,
                latitude: element.latitude,
                altitude: element.altitude,
                accuracy: element.accuracy,
                predatorsTypeValue: element.predatorsTypeValue,
                releaseNum: element.releaseNum,
                remarks: element.remarks,
                allLength: tmpStorage.length,
                curRow: i
            };
            options.headers = {token: localStorage['token']};
             
             


            //创建文件对象
            const fileTransfer: FileTransferObject = this.fileTransfer.create();
            that.curOptions = options.params;

            this.base.logger(JSON.stringify(options), "Img_maintenance_submit_function_fileTransferPar.txt");
            return new Promise((resolve, reject) => {
                fileTransfer.upload(element.img, base.BASE_URL + 'app/AddEnemy', options)
                    .then((res) => {
                         
                         
                         

                         
                        if (JSON.parse(res.response).isComp == true) {
                            that.isComplete = true;
                        } else {
                            that.isComplete = false;
                        }

                        resolve('ok');

                    }, async (msg) => {
                         
                        await httpClient.post(base.BASE_URL + 'app/AddEnemy', {},
                            {
                                headers: {token: localStorage['token']}, params: {
                                    deviceId: element.deviceId,
                                    longitude: element.longitude,
                                    latitude: element.latitude,
                                    altitude: element.altitude,
                                    accuracy: element.accuracy,
                                    predatorsTypeValue: element.predatorsTypeValue,
                                    releaseNum: element.releaseNum,
                                    remarks: element.remarks,
                                    allLength: tmpStorage.length,
                                    curRow: i
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
        } else {
            return new Promise((resolve, reject) => {
                 
                 
                httpClient.post(base.BASE_URL + 'app/AddEnemy', {},
                    {
                        headers: {token: localStorage['token']}, params: {
                            deviceId: element.deviceId,
                            longitude: element.longitude,
                            latitude: element.latitude,
                            altitude: element.altitude,
                            accuracy: element.accuracy,
                            predatorsTypeValue: element.predatorsTypeValue,
                            releaseNum: element.releaseNum,
                            remarks: element.remarks,
                            allLength: tmpStorage.length,
                            curRow: i
                        }
                    }).toPromise().then(res => {
                     
                     
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

    async ionViewDidLoad() {

        /*if (localStorage["eneBind"]) {
            var tmpStorage2 = [];

            tmpStorage2 = JSON.parse(localStorage["eneBind"]);

             
            // localStorage.removeItem("trapBind");

             
            var i = 0;

            tmpStorage2.forEach(element => {

                 

                 
                 

                this.httpClient.post(this.base.BASE_URL + 'app/bindId', {},
                    {
                        headers: {token: localStorage['token']},
                        params: new HttpParams({fromObject: {scanId: element.scanId, serial: element.serial}})
                    })
                    .subscribe(res => {
                             
                            i++;
                            this.base.showAlert("成功绑定了", "", () => {
                            });
                            if (tmpStorage2.length == i) {
                                localStorage.removeItem("eneBind");
                                this.base.showAlert("清理了缓存", "", () => {
                                });
                            }
                        },
                        msg => {

                        })

            })


        }*/

         
         
        //var i = 0;

        /*var that = this;
        if (localStorage["enemyCache"]) {
            const alert = this.alertCtrl.create({
                title: "有缓存数据，是否提交?",
                subTitle: "提示：4G以下网络环境提交时间可能会延长，建议Wi-Fi状况良好或者4G网络环境下提交。",
                buttons: [
                    {
                        text: '确认', handler: async () => {
                             
                            const loader = this.loadingCtrl.create({
                                content: "缓存数据正在提交，请勿退出",
                            });
                            loader.present();
                            var tmpStorage = JSON.parse(localStorage["enemyCache"]);
                            let tmpDeviceList = [];
                            //  tmpStorage.forEach(element => {
                            for (let i = 0; i < tmpStorage.length; ++i) {
                                await this.postEnemy(tmpStorage[i], this.httpClient, this.base, tmpStorage, i).then(
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
                                 
                                localStorage.removeItem('enemyCache');
                            } else {
                                localStorage.setItem('enemyCache', JSON.stringify(this.indexList));
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


        //     await (async (i)=>{
        //         var element = tmpStorage[i];
        //          
        //          
        //  
        // if (element.img != null) {
        //     let options: FileUploadOptions = {};
        //     options.fileKey = "image";
        //     var time = Date.parse(Date());
        //     options.fileName = time + ".jpg";
        //     options.mimeType = "image/jpeg";
        //     options.chunkedMode = false;
        //     options.httpMethod = "POST";
        //     options.params = {
        //         deviceId: element.deviceId, longitude: element.longitude, latitude: element.latitude, altitude: element.altitude,
        //         accuracy: element.accuracy, predatorsTypeValue: element.predatorsTypeValue, releaseNum: element.releaseNum, remarks: element.remarks
        //     };
        //     options.headers = { token: localStorage['token'] };
        //      
        //      


        //     //创建文件对象
        //     const fileTransfer: FileTransferObject = this.fileTransfer.create();
        //     this.curOptions = options.params;


        //     // this.base.logger(JSON.stringify(options), "Img_maintenance_submit_function_fileTransferPar.txt");
        //     let observer = await new Promise((resolve,reject)=>{
        //     fileTransfer.upload(element.img, this.base.BASE_URL + 'app/AddEnemy', options)
        //         .then((res) => {
        //             //i++;
        //              
        //              
        //              


        //             if (JSON.parse(res.response).isComp == true) {
        //                 this.isComplete = true;
        //             } else {
        //                 this.isComplete = false;
        //             }

        //             resolve('ok');

        //         },async (msg)=>{
        //             await that.httpClient.post(this.base.BASE_URL + 'app/AddEnemy', {},
        //             {
        //                 headers: { token: localStorage['token'] }, params: {
        //                     deviceId: element.deviceId, longitude: element.longitude, latitude: element.latitude, altitude: element.altitude,
        //                     accuracy: element.accuracy, predatorsTypeValue: element.predatorsTypeValue, releaseNum: element.releaseNum, remarks: element.remarks
        //                 }
        //             })
        //             .toPromise().then(res => {
        //                  
        //                 if (JSON.parse(JSON.stringify(res)).isComp == true){
        //                     this.isComplete = true;
        //                 }else{
        //                     this.isComplete = false;
        //                 }
        //                 this.isSubProcessFin = true;
        //                 this.base.showAlert("提示", "无图片提交成功", () => { });
        //                 resolve('ok');
        //             }, msg => {
        //                  
        //                 this.isSubProcessFin = false;
        //                 reject('error');
        //             })
        //             if( this.isSubProcessFin == true){
        //                 resolve('ok');
        //             }else{
        //                 reject('error');
        //             }
        //                 reject('error');
        //         })
        // }).catch((error)=>{
        //      
        // })
        // that.observers.push(observer);


        // this.base.logger(JSON.stringify(res), "Img_maintenance_submit_function_fileTransferRes.txt");

        // this.base.showAlert('提示', '提交成功', () => { });
        //     if (i >= tmpStorage.length)
        //         localStorage.removeItem('enemyCache');
        // }, (error) => {//发送失败(网络出错等)
        //     // this.base.showAlert('提示', '提交失败', () => { });

        //         this.httpClient.post(this.base.BASE_URL + 'app/AddEnemy', {},
        //             {
        //                 headers: { token: localStorage['token'] }, params: {
        //                     deviceId: element.deviceId, longitude: element.longitude, latitude: element.latitude, altitude: element.altitude,
        //                     accuracy: element.accuracy, predatorsTypeValue: element.predatorsTypeValue, releaseNum: element.releaseNum, remarks: element.remarks
        //                 }
        //             })
        //             .subscribe(res => {
        //                 i++;
        //                  
        //                  
        //                 // this.base.showAlert('提示', '提交成功', () => { });
        //                 if (i >= tmpStorage.length)
        //                     localStorage.removeItem('enemyCache');
        //             }, (msg) => {
        //                 // this.base.showAlert('提示', '提交失败', () => { });
        //             });


        // })
        //             } else {
        //                 let obs =  await new Promise((resolve,reject)=>{
        //                  
        //                 this.httpClient.post(this.base.BASE_URL + 'app/AddEnemy', {},
        //                     {
        //                         headers: { token: localStorage['token'] }, params: {
        //                             deviceId: element.deviceId, longitude: element.longitude, latitude: element.latitude, altitude: element.altitude,
        //                             accuracy: element.accuracy, predatorsTypeValue: element.predatorsTypeValue, releaseNum: element.releaseNum, remarks: element.remarks
        //                         }
        //                     })
        //                     .subscribe(res => {
        //                         //i++;
        //                          
        //                          
        //                         if (JSON.parse(JSON.stringify(res)).isComp == true) {
        //                             this.isComplete = true;
        //                         } else {
        //                             this.isComplete = false;
        //                         }
        //                         resolve('ok');
        //                     }, (msg) => {
        //                          
        //                         reject('error');
        //                         // this.base.showAlert('提示', '提交失败', () => { });
        //                     });
        //             }).catch((error)=>{
        //                  
        //             })
        //             that.observers.push(obs);

        //         }
        //     // });
        //         })(i)
        //     }

        //     Promise.all(that.observers).then((resolve) => {
        //          
        //         loader.dismiss();
        //              
        //         if (that.isComplete){
        //             localStorage.removeItem('enemyCache');
        //         }
        //     }, (reject) => {
        //          
        //         loader.dismiss();
        //     }).catch((reason) => {
        //          
        //         loader.dismiss();
        //     })

        // }
        // this.base.showAlert('提示', '提交成功', () => { });
        //                 if(i>=tmpStorage.length)
        //                     localStorage.removeItem('enemyCache');
        //             }, (msg) => {
        //                 // this.base.showAlert('提示', '提交失败', () => { });
        //             });
        //     }
        // });
        //     if (JSON.parse(JSON.stringify(res)).isComp == true) {
        //                             this.isComplete = true;
        //                         } else {
        //                             this.isComplete = false;
        //                         }
        //                         resolve('ok');
        //                     }, (msg) => {
        //                          
        //                         reject('error');
        //                         // this.base.showAlert('提示', '提交失败', () => { });
        //                     });
        //             }).catch((error)=>{
        //                  
        //             })
        //             that.observers.push(obs);

        //         }
        //     // });
        //         })(i)
        //     }
        // }
        if (localStorage["EnemyType"]) {
             
            this.enemyType = JSON.parse(localStorage["EnemyType"]);
             
             
        }

        this.httpClient.post(this.base.BASE_URL + 'app/getEnemyType', {},
            {
                headers: {token: localStorage['token']},
                params: new HttpParams({fromObject: {worker: localStorage['username']}})
            })
            .subscribe(res => {
                    var c: any = res;
                    this.enemyType = Array.from(c);
                     
                    localStorage['EnemyType'] = JSON.stringify(res);
                },
                res => {
                     
                })

    }


    deviceBind() {
        //这里还没有实现，先弹框
        this.base.showAlert("成功", "", () => {
        });
    }

    testCache(){
         
        let maintenanceCache: any;
        for (let i = 0; i < 100; i++) {
            const cacheExp = {
                deviceId: Math.ceil(i + 16180).toString(),
                longitude: ((Math.random() * 0.1 + 119.23113951284115)).toString(),
                latitude: ((Math.random() * 0.1 + 26.083115579358804)).toString(),
                altitude: "14",
                accuracy: "22",
                predatorsTypeValue: "1",
                releaseNum: "20",
                remarks: "SB" + (i + 1).toString(),
            };
            maintenanceCache = localStorage.getItem('enemyCache');
            if (maintenanceCache == null) {
                maintenanceCache = [];
            } else {
                maintenanceCache = JSON.parse(maintenanceCache);
            }
            maintenanceCache.push(cacheExp);
            localStorage.setItem('enemyCache', JSON.stringify(maintenanceCache));
        }
    }

    test() {
        for (var i = 0; i < 2000; i++) {
            this.deviceId = Math.ceil(i + 18201).toString();
            this.longtitude = ((Math.random() * 0.1 + 119.23113951284115)).toString();
            this.latitude = ((Math.random() * 0.1 + 26.083115579358804)).toString();
            this.accuracy = "22"
            this.altitude = "14";
            this.remarks = "0";
            this.predatorsTypeValue = "1"
            this.releaseNum = "20"
            this.httpClient.post(this.base.BASE_URL + 'app/AddEnemy', {},
                {
                    headers: {token: localStorage['token']}, params: {
                        deviceId: this.deviceId,
                        longitude: this.longtitude,
                        latitude: this.latitude,
                        altitude: this.altitude,
                        accuracy: this.accuracy,
                        predatorsTypeValue: this.predatorsTypeValue,
                        releaseNum: this.releaseNum,
                        remarks: this.remarks
                    }
                })
                .subscribe(res => {

                }, (msg) => {

                });
        }
    }


    NavToQuery() {
        // localStorage.setItem("queryEnemyID",this.deviceId);
        if (this.deviceId) {
            localStorage['queryEnemyID'] = this.deviceId;
            this.navCtrl.push(EnemyQueryPage);
        } else {
            this.base.showAlert("提示", "请先扫码或输入数字的设备ID!!!", () => {
            });
        }
        // localStorage["queryEnemyID"] = this.deviceId.toString();


    }

    enemyClick() {
         
    }

    deviceIdInput() {
         
         
    }

    deviceSerialInput() {
         
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

    callBack = (params) => {
        return new Promise((resolve, reject) => {
            if (params) {
                 
                var allDevice = JSON.parse(localStorage["device"]);
                 
                 
                 

                var flag = 0;
                allDevice.forEach(element => {
                     
                     
                    if ((element.scanId == params.id && element.id.charAt(8) == '3')){
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

                    this.subscription = watch.subscribe((data) => {
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
                    }, res => {
                        // setTimeout(() => {
                        //    this.base.showAlert('提示','wu',()=>{});
                        this.location_ready = false;
                        that.changeDetectorRef.detectChanges()

                        // 这个是在数据更新后。。。强制刷一下页面。。。放在数据变更后才有用。。。
                        // },5);

                        // alert();
                    });

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

    scan() {
         
         
        this.navCtrl.push(ScanPage, {callBack: this.callBack});
    }

    submit() {
        // let num1 = 0;
        // if (parseInt(this.releaseNum) < 0 || parseInt(this.releaseNum) == NaN) {
        //     this.releaseNum = "";
        //     // this.base.showAlert('提示', '请输入数字', () => { });
        // }
        // if (!this.releaseNum) {
        //     this.releaseNum = "";
        //     // this.base.showAlert('提示', '请输入数字', () => { });
        // }
        // num1 = parseInt(this.releaseNum);
        // this.releaseNum = '' + num1;
        // if (this.releaseNum == 'NaN') {
        //     this.releaseNum = "";
        //     // this.base.showAlert('提示', '请输入数字', () => { });
        // }

        // if (!this.predatorsTypeValue){
        //     this.predatorsTypeValue = "0";
        // }
        // if (!this.releaseNum){
        //     this.releaseNum = "0";
        // }
        this.have_submit = true;

        var r = /^([1-9]\d*|[0]{1,1})$/;
        var flag=r.test(this.releaseNum);
         
        if (!flag || !this.altitude || !this.longtitude || !this.latitude || !this.accuracy || !this.predatorsTypeValue || !this.releaseNum || parseInt(this.releaseNum) < 0 || parseInt(this.releaseNum) > 999999999 || parseInt(this.releaseNum) == NaN || !this.releaseNum || this.releaseNum == 'NaN') {
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
                    longitude: this.longtitude,
                    latitude: this.latitude,
                    altitude: this.altitude,
                    accuracy: this.accuracy,
                    predatorsTypeValue: this.predatorsTypeValue,
                    releaseNum: this.releaseNum,
                    remarks: this.remarks
                };
                options.headers = {token: localStorage['token']};
                 
                 

                //创建文件对象
                const fileTransfer: FileTransferObject = this.fileTransfer.create();


                this.base.logger(JSON.stringify(options), "Img_maintenance_submit_function_fileTransferPar.txt");
                if (!this.altitude || !this.longtitude || !this.latitude || !this.accuracy || !this.predatorsTypeValue || !this.releaseNum || parseInt(this.releaseNum) < 0 || parseInt(this.releaseNum) > 999999999 || parseInt(this.releaseNum) == NaN || !this.releaseNum || this.releaseNum == 'NaN') {
                    this.base.showAlert("提示", "数据未填写，或填写格式错误！", () => {
                    });
                }
                fileTransfer.upload(this.imageData, this.base.BASE_URL + 'app/AddEnemy', options)
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
                            longitude: this.longtitude,
                            latitude: this.latitude,
                            altitude: this.altitude,
                            accuracy: this.accuracy,
                            predatorsTypeValue: this.predatorsTypeValue,
                            releaseNum: this.releaseNum,
                            remarks: this.remarks,
                            img: this.imageData
                        };
                        let enemyCache: any;
                        enemyCache = localStorage.getItem('enemyCache');
                        if (enemyCache == null) {
                            enemyCache = [];
                        } else {
                            enemyCache = JSON.parse(enemyCache);
                        }
                        enemyCache.push(cacheData);
                        //localStorage安全保存数据
                        // try{
                        //   localStorage.setItem('enemyCache', JSON.stringify(enemyCache));
                        // }catch(oException){
                        //     if(oException.name == 'QuotaExceededError'){
                        //         this.base.showAlert('提示', '无法提交，缓存容量不足，请及时处理', ()=>{});
                        //         // 
                        //             // 可进行超出限定大小之后的操作，如下面可以先清除记录，再次保存
                        //       // localStorage.clear();
                        //       // localStorage.setItem(key,value);
                        //     }
                        // }

                        localStorage.setItem('enemyCache', JSON.stringify(enemyCache));
                        //this.navCtrl.pop();
                        // confirm.dismiss()
                        Base.popTo(this.navCtrl, 'switchProjectPage');
                    }).catch((error) => {
                    return new Promise((resolve, reject) => {
                        this.httpClient.post(this.base.BASE_URL + 'app/AddEnemy', {},
                            {
                                headers: {token: localStorage['token']}, params: {
                                    deviceId: this.deviceId,
                                    longitude: this.longtitude,
                                    latitude: this.latitude,
                                    altitude: this.altitude,
                                    accuracy: this.accuracy,
                                    predatorsTypeValue: this.predatorsTypeValue,
                                    releaseNum: this.releaseNum,
                                    remarks: this.remarks
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
                                    altitude: this.altitude,
                                    accuracy: this.accuracy,
                                    predatorsTypeValue: this.predatorsTypeValue,
                                    releaseNum: this.releaseNum,
                                    remarks: this.remarks
                                };
                                 
                                 

                                Base.popTo(this.navCtrl, 'switchProjectPage');
                            }, (msg) => {

                                this.base.logger(JSON.stringify(msg), "NonImg_maintenance_submit_function_fileTransferError.txt");

                                this.base.showAlert('提示', '提交失败', () => {
                                });
                                let cacheData = {
                                    deviceId: this.deviceId,
                                    longitude: this.longtitude,
                                    latitude: this.latitude,
                                    altitude: this.altitude,
                                    accuracy: this.accuracy,
                                    predatorsTypeValue: this.predatorsTypeValue,
                                    releaseNum: this.releaseNum,
                                    remarks: this.remarks
                                };
                                 
                                 

                                let enemyCache: any;
                                enemyCache = localStorage.getItem('enemyCache');
                                if (enemyCache == null) {
                                    enemyCache = [];
                                } else {
                                    enemyCache = JSON.parse(enemyCache);
                                }
                                enemyCache.push(cacheData);
                                // try{
                                //   localStorage.setItem('enemyCache', JSON.stringify(enemyCache));
                                // }catch(oException){
                                //     if(oException.name == 'QuotaExceededError'){
                                //         this.base.showAlert('提示', '无法提交，缓存容量不足，请及时处理', ()=>{});
                                //         // 
                                //             // 可进行超出限定大小之后的操作，如下面可以先清除记录，再次保存
                                //       // localStorage.clear();
                                //       // localStorage.setItem(key,value);
                                //     }
                                // }
                                localStorage.setItem('enemyCache', JSON.stringify(enemyCache));
                                 
                                Base.popTo(this.navCtrl, 'switchProjectPage');
                            });

                    })

                });
            } else {

                // var options: string = "deviceId: " + this.id +
                //     "longitude:" + this.longitude + "latitude:" + this.latitude + "num:" + this.num +
                //     "maleNum:" + this.maleNum + "femaleNum:" + this.femaleNum + "altitude:" + this.altitude +
                //     "drug:" + this.drug + "remark:" + this.remark + "workingContent:" + this.workingContent + "otherNum:" + this.otherNum + "otherType:" + this.otherType;

                let options: FileUploadOptions = {};
                options.params = {
                    deviceId: this.deviceId,
                    longitude: this.longtitude,
                    latitude: this.latitude,
                    altitude: this.altitude,
                    accuracy: this.accuracy,
                    predatorsTypeValue: this.predatorsTypeValue,
                    releaseNum: this.releaseNum,
                    remarks: this.remarks
                };
                this.base.logger(JSON.stringify(options), "NoImg_newEnemyPar.txt");
                if (!this.altitude || !this.longtitude || !this.latitude || !this.accuracy || !this.predatorsTypeValue || !this.releaseNum || parseInt(this.releaseNum) < 0 || parseInt(this.releaseNum) > 999999999 || parseInt(this.releaseNum) == NaN || !this.releaseNum || this.releaseNum == 'NaN') {
                    this.base.showAlert("提示", "数据未填写，或填写格式错误！", () => {
                    });

                }
                this.httpClient.post(this.base.BASE_URL + 'app/AddEnemy', {},
                    {
                        headers: {token: localStorage['token']}, params: {
                            deviceId: this.deviceId,
                            longitude: this.longtitude,
                            latitude: this.latitude,
                            altitude: this.altitude,
                            accuracy: this.accuracy,
                            predatorsTypeValue: this.predatorsTypeValue,
                            releaseNum: this.releaseNum,
                            remarks: this.remarks
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
                            altitude: this.altitude,
                            accuracy: this.accuracy,
                            predatorsTypeValue: this.predatorsTypeValue,
                            releaseNum: this.releaseNum,
                            remarks: this.remarks
                        };
                         
                         

                        Base.popTo(this.navCtrl, 'switchProjectPage');
                    }, (msg) => {

                        this.base.logger(JSON.stringify(msg), "NonImg_maintenance_submit_function_fileTransferError.txt");

                        this.base.showAlert('提示', '提交失败', () => {
                        });
                        let cacheData = {
                            deviceId: this.deviceId,
                            longitude: this.longtitude,
                            latitude: this.latitude,
                            altitude: this.altitude,
                            accuracy: this.accuracy,
                            predatorsTypeValue: this.predatorsTypeValue,
                            releaseNum: this.releaseNum,
                            remarks: this.remarks
                        };
                         
                         

                        let enemyCache: any;
                        enemyCache = localStorage.getItem('enemyCache');
                        if (enemyCache == null) {
                            enemyCache = [];
                        } else {
                            enemyCache = JSON.parse(enemyCache);
                        }
                        enemyCache.push(cacheData);
                        // try{
                        //   localStorage.setItem('enemyCache', JSON.stringify(enemyCache));
                        // }catch(oException){
                        //     if(oException.name == 'QuotaExceededError'){
                        //         this.base.showAlert('提示', '无法提交，缓存容量不足，请及时处理', ()=>{});
                        //         // 
                        //             // 可进行超出限定大小之后的操作，如下面可以先清除记录，再次保存
                        //       // localStorage.clear();
                        //       // localStorage.setItem(key,value);
                        //     }
                        // }
                        localStorage.setItem('enemyCache', JSON.stringify(enemyCache));
                         
                        Base.popTo(this.navCtrl, 'switchProjectPage');
                    });

            }
        }

    }


}
