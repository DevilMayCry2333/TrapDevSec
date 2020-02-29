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
import {DeadTreesQueryPage} from '../dead-trees-query/dead-trees-query';
import {LoadingController} from 'ionic-angular';
import {Base64} from '@ionic-native/base64';
import {File} from "@ionic-native/file";
import {AlertController} from 'ionic-angular';
import {Events} from 'ionic-angular';

@Component({
    selector: 'app-deadtree',
    templateUrl: 'newDeadTree.html'
})
export class DeadtreePage {
    deviceId: string;
    deviceSerial: string;
    longtitude: string;
    latitude: string;
    altitude: string;
    accuracy: string;
    batch = "1";
    currentImg: any;
    failI = -1;
    curFail: boolean;
    currentNum = 0;
    // longtitude="1.1234567";
    // latitude="1.1234567";
    // altitude="1.1234567";
    // accuracy="1.1234567";
    hasClear = false;
    diameter:number;
    height:number;
    volume = 0;
    observers = [];
    picture = [];
    observers2HasPic = [];
    observers2NoPic = [];
    picNotExist = false;
    have_submit: boolean;
    hasPic = false;
    photosum = 0;
    photolib1: any;
    subProcessFin: any;
    photolib2: any;
    photolib3: any;
    currentPic1: string;
    currentPic2: string;
    currentPic3: string;
    cachePhoto1: any;
    cachePhoto2: any;
    j: any;
    i: any;
    curTmpSotrage: any;
    curOptions: any;
    isComplete = false;
    submitFail = false;
    cachePhoto3: any;
    base641: any;
    base642: any;
    base643: any;
    killMethodsValue: string;
    killMethods: any[];
    imageData: null
    location_ready: boolean
    remarks = ""
    subscription: Subscription
    threePhotos = false;
    canSubmit = true;
    flag1=true;
    flag2=true;
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
    pic1: string;
    pic2: string;
    pic3: string;
    indexList = [];

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
        private base64: Base64,
        private file: File,
        public events: Events
    ) {
        this.checkNetwork();
        // this.testCache();
    }

    diameterInput() {
        //  
        //限制桩径和树高防止数据过大，代入公式计算会超出范围
        if(this.diameter>100000){
            this.flag1=false;
            // this.base.showAlert("提示", "桩径输入太大了!", () => {
            // })
        }else{
            this.flag1=true;
            var tmp: number = 0.714265437 * 0.0001 * Math.pow(this.diameter * 0.7, 1.867010) * Math.pow(this.height, 0.9014632);
            this.volume = tmp;
            //  
        }

    }

    heightInput() {
        //  
        if(this.height>100000){
            this.flag2=false;
            // this.base.showAlert("提示", "树高输入太大了!", () => {
            // })
        }else{
            this.flag2=true;
            var tmp: number = 0.714265437 * 0.0001 * Math.pow(this.diameter * 0.7, 1.867010) * Math.pow(this.height, 0.9014632);
            this.volume = tmp;
        }

    }
    static checkNetworkState: boolean = false;

    checkNetwork() {
        this.events.subscribe('ONLINE', () => {
            if (!DeadtreePage.checkNetworkState) {
                this.checkPostMaintenanceCache();
                this.checkPostBindCache();
                DeadtreePage.checkNetworkState = true;
            }
        });
        this.events.subscribe('OFFLINE', () => {
            if (DeadtreePage.checkNetworkState) {
                //TODO
                DeadtreePage.checkNetworkState = false;
            }
        });
    }

    preSubmitted = 0;
    curSubmitted = 0;

    checkPostMaintenanceCache() {
        let that = this;
        if (this.curSubmitted >= this.preSubmitted) {
            if (localStorage["deadCache"]) {
                (async () => {
                    const tmpStorage = JSON.parse(localStorage["deadCache"]);
                    //  
                    //  
                    //  
                    //  

                    if (localStorage["deadPhotoCache1"]) {
                        this.photolib1 = JSON.parse(localStorage["deadPhotoCache1"]);
                    }
                    if (localStorage["deadPhotoCache2"]) {
                        this.photolib2 = JSON.parse(localStorage["deadPhotoCache2"]);
                    }
                    if (localStorage["deadPhotoCache3"]) {
                        this.photolib3 = JSON.parse(localStorage["deadPhotoCache3"]);
                    }

                    this.i = 0;
                    //i是一条一条的记录
                    //  

                    // let n = this.awaitF();
                    //  
                    this.preSubmitted = tmpStorage.length;
                    let tmpDeviceList = [];
                    this.indexList = [];
                    let resolved = 0, rejected = 0;
                    this.curTmpSotrage = tmpStorage;
                     
                    for (let i = 0; i < tmpStorage.length; ++i) {
                        let element = tmpStorage[i];
                        that.curFail = false;
                        if (element.hasPic == true) {
                            for (let j = 1; j <= element.photoSum; ++j) {
                                that.j = j;
                                await this.postAdddeadtree(tmpStorage[i], this.httpClient, this.base, tmpStorage, i, j).then(
                                    res => {
                                         
                                         
                                        resolved++;
                                    }, msg => {
                                         
                                         
                                         
                                        rejected++;
                                        if (!that.curFail) {
                                            tmpDeviceList.push(tmpStorage[i]);
                                        }
                                        that.curFail = true;
                                    }
                                ).catch((error) => {
                                     
                                });
                            }
                        } else {
                            await this.postAdddeadtreePlus(tmpStorage[i], this.httpClient, this.base, tmpStorage, i).then(
                                res => {
                                     
                                     
                                    resolved++;
                                }, msg => {
                                     
                                     
                                    rejected++;
                                    tmpDeviceList.push(tmpStorage[i]);
                                }
                            ).catch((error) => {
                                 
                            })
                        }
                        this.curSubmitted = resolved + rejected;
                    }
                    this.preSubmitted = resolved + rejected;
                    for (let i = 0; i < tmpDeviceList.length; ++i) {
                        this.indexList.push(tmpDeviceList[i]);
                         
                    }
                     
                     
                    if (this.indexList.length <= 0) {
                         
                        localStorage.removeItem('deadCache');
                        this.preSubmitted = 0;
                        this.curSubmitted = 0;
                    } else {
                        localStorage.setItem('deadCache', JSON.stringify(this.indexList));
                    }
                })();
            }
        }
    }

    checkPostBindCache() {
        if (localStorage["deadBind"]) {

            var tmpStorage2 = [];

            tmpStorage2 = JSON.parse(localStorage["deadBind"]);

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
                                localStorage.removeItem("deadBind");
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
            project: '4'
        });
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
                    //  
                    //  
                    // this.base.logger(JSON.stringify(res), "NonImg_maintenance_submit_function_fileTransferRes.txt");
                    this.base.showAlert('提示', '提交成功', () => {
                    });
                    //  

                    Base.popTo(this.navCtrl, 'switchProjectPage');
                }, (msg) => {

                    // this.base.logger(JSON.stringify(msg), "NonImg_maintenance_submit_function_fileTransferError.txt");

                    this.base.showAlert("提交失败", "提交失败", () => {
                    });
                    //  
                    //  
                    var transferParam = {scanId: this.deviceId, serial: this.deviceSerial};
                    let BindIdCache: any;
                    BindIdCache = localStorage.getItem('trapBind');

                    if (BindIdCache == null) {
                        BindIdCache = [];
                    } else {
                        BindIdCache = JSON.parse(BindIdCache);
                    }
                    BindIdCache.push(transferParam);

                    localStorage.setItem("deadBind", JSON.stringify(BindIdCache));
                });
        }
    }

    test2() {
        localStorage.removeItem("deadCache");
        localStorage.removeItem("deadPhotoCache1");
        localStorage.removeItem("deadPhotoCache2");
        localStorage.removeItem("deadPhotoCache3");
    }

    // buttonChange(){
    //     this.threePhotos = false;
    //     this.canSubmit = true;
    //     if(this.photosum == 3){
    //         this.threePhotos = true;
    //         this.canSubmit = false;
    //     }
    // }

    sleep(tmpStorage) {
        //试试看可不可以用的
        for (var i = 0; i < tmpStorage.length; i++) {
            for (var j = 0; j < tmpStorage.length; j++) {
                ((i: number, j: number) => {
                    //  
                    //  
                })
            }
        }
    }

    testCache() {
         
        let maintenanceCache: any;
        for (let i = 0; i < 100; i++) {
            const cacheExp = {
                deviceId: Math.ceil(i + 16180).toString(),
                longitude: ((Math.random() * 0.1 + 119.23113951284115)).toString(),
                latitude: ((Math.random() * 0.1 + 26.083115579358804)).toString(),
                altitude: "14",
                accuracy: "22",
                diameter: "",
                height: "",
                volume: "",
                killMethodsValue: "",
                remarks: "SB" + (i + 1).toString(),
                batch: ""
            };
            maintenanceCache = localStorage.getItem('deadCache');
            if (maintenanceCache == null) {
                maintenanceCache = [];
            } else {
                maintenanceCache = JSON.parse(maintenanceCache);
            }
            maintenanceCache.push(cacheExp);
            localStorage.setItem('deadCache', JSON.stringify(maintenanceCache));
        }
    }

    postAdddeadtree(element, httpClient, base, tmpStorage, i, j) {
        var that = this;
         
         
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
            diameter: element.diameter,
            height: element.height,
            volume: element.volume,
            killMethodsValue: element.killMethodsValue,
            remarks: element.remarks,
            current: this.j,
            batch: element.batch,
            allLength: tmpStorage.length,
            curRow: i
        };
        options.headers = {token: localStorage['token']};
         
         
        //创建文件对象
        const fileTransfer: FileTransferObject = this.fileTransfer.create();
        var uploadAddress;
        this.j = j;
        this.i = i;
        if (this.j == 1) {
            uploadAddress = element.pic1;
            that.currentImg = that.photolib1;
        } else if (this.j == 2) {
            uploadAddress = element.pic2;
            that.currentImg = that.photolib2;
        } else if (this.j == 3) {
            uploadAddress = element.pic3;
            that.currentImg = that.photolib3;
        }
         
        that.picNotExist = false;

        this.curTmpSotrage = tmpStorage;
        this.curOptions = options.params;
        return new Promise((resolve, reject) => {
            fileTransfer.upload(uploadAddress, that.base.BASE_URL + 'app/AddDeadtreePhoto', options)
                .then((res) => {
                     
                     
                     
                    // that.picture.push(res.response["imgId"]);
                     
                     
                     
                    if (JSON.parse(res.response).isComp == true) {
                        this.isComplete = true;
                    } else {
                        this.isComplete = false;
                    }
                     
                    resolve('ok');
                }, async (msg) => {
                     
                     
                    that.picNotExist = true;
                    if (this.j <= 1) {
                         
                        await that.httpClient.post(that.base.BASE_URL + 'app/AddDeadtreePhoto', {},
                            {
                                headers: {token: localStorage['token']}, params: {
                                    deviceId: that.curOptions.deviceId,
                                    longitude: that.curOptions.longitude,
                                    latitude: that.curOptions.latitude,
                                    altitude: that.curOptions.altitude,
                                    accuracy: that.curOptions.accuracy,
                                    diameter: that.curOptions.diameter,
                                    height: that.curOptions.height,
                                    volume: that.curOptions.volume,
                                    killMethodsValue: that.curOptions.killMethodsValue,
                                    remarks: that.curOptions.remarks,
                                    batch: that.curOptions.batch,
                                    current: '1',
                                    allLength: '1',
                                    curRow: '1'
                                }
                            }).toPromise().then(res => {
                             
                             
                             

                            if (that.i >= that.curTmpSotrage.length - 1) {
                                that.isComplete = true;
                            } else {
                                that.isComplete = false;
                            }
                             
                            that.subProcessFin = true;
                            resolve('ok');
                            // that.base.showAlert("全部成功了", "", () => { });
                            //  
                            //  
                        }, (msg) => {
                             
                             
                            that.subProcessFin = false;
                            reject('error');
                            // this.base.showAlert('提示', '提交失败', () => { });
                        });
                        if (that.subProcessFin == true) {
                            resolve('ok');
                        } else {
                            reject('error');
                        }
                    }
                    reject('error');
                })
        })
        // })(i,j)
    }

    postAdddeadtreePlus(element, httpClient, base, tmpStorage, i) {
        var that = this;
        return new Promise((resolve, reject) => {
            httpClient.post(that.base.BASE_URL + 'app/AddDeadtreePhoto', {},
                {
                    headers: {token: localStorage['token']}, params: {
                        deviceId: element.deviceId,
                        longitude: element.longitude,
                        latitude: element.latitude,
                        altitude: element.altitude,
                        accuracy: element.accuracy,
                        diameter: element.diameter,
                        height: element.height,
                        volume: element.volume,
                        killMethodsValue: element.killMethodsValue,
                        remarks: element.remarks,
                        batch: element.batch
                    }
                }).toPromise().then(res => {
                 
                 
                if (that.i >= that.curTmpSotrage.length - 1) {
                    that.isComplete = true;
                } else {
                    that.isComplete = false;
                }
                 
                that.subProcessFin = true;
                resolve('ok');
            }, (msg) => {
                 
                reject('error');
                // this.base.showAlert('提示', '提交失败', () => { });
            });
        })

    }

    async awaitF() {

    }


    //以下内容注释掉
    // for ( var i = 0; i < tmpStorage.length; i++) {
    //     await (async (i)=>{
    //          

    //         var element = tmpStorage[i];
    //         if (element.hasPic == true) {
    //                     for (var j = 1; j <= element.photoSum; j = j + 1) {
    //                          await (async (i,j)=>{
    //                              
    //                             // (async (j)=>{
    //                             let options: FileUploadOptions = {};
    //                             options.fileKey = "image";
    //                             var time = Date.parse(Date());
    //                             options.fileName = time + ".jpg";
    //                             options.mimeType = "image/jpeg";
    //                             options.chunkedMode = false;
    //                             options.httpMethod = "POST";
    //                             options.params = {
    //                                 deviceId: element.deviceId, longitude: element.longitude, latitude: element.latitude, altitude: element.altitude,
    //                                 accuracy: element.accuracy, diameter: element.diameter, height: element.height, volume: element.volume,
    //                                 killMethodsValue: element.killMethodsValue, remarks: element.remarks, current: j, batch: element.batch,
    //                                 allLength: tmpStorage.length, curRow: i
    //                             };
    //                             options.headers = { token: localStorage['token'] };
    //                             //  
    //                             //  
    //                             const fileTransfer: FileTransferObject = that.fileTransfer.create();
    //                             //  
    //                             //  

    //                             //  

    //                             //  
    //                             //  
    //                             var uploadAddress;
    //                             if (j == 1) {
    //                                 uploadAddress = element.pic1;
    //                                 that.currentImg = that.photolib1;
    //                             } else if (j == 2) {
    //                                 uploadAddress = element.pic2;
    //                                 that.currentImg = that.photolib2;
    //                             } else if (j == 3) {
    //                                 uploadAddress = element.pic3;
    //                                 that.currentImg = that.photolib3;
    //                             }
    //                              
    //                              that.picNotExist = false;
    //                              this.j = j;
    //                              this.i = i;
    //                              this.curTmpSotrage = tmpStorage;
    //                              this.curOptions = options.params;
    //                             let observer = await new Promise((resolve, reject) => {
    //                                 fileTransfer.upload(uploadAddress, that.base.BASE_URL + 'app/AddDeadtreePhoto', options)
    //                                     .then((res) => {
    //                                          
    //                                          
    //                                          
    //                                         // that.picture.push(res.response["imgId"]);
    //                                          
    //                                          
    //                                          
    //                                         if (JSON.parse(res.response).isComp == true) {
    //                                             this.isComplete = true;
    //                                         } else {
    //                                             this.isComplete = false;
    //                                         }
    //                                          
    //                                         resolve('ok');
    //                                     },async (msg)=>{
    //                                          
    //                                              
    //                                             that.picNotExist = true;
    //                                             if (this.j <= 1) {
    //                                                  
    //                                                     await that.httpClient.post(that.base.BASE_URL + 'app/AddDeadtreePhoto', {},
    //                                                         {
    //                                                             headers: { token: localStorage['token'] }, params: {
    //                                                                 deviceId: that.curOptions.deviceId, longitude: that.curOptions.longitude, latitude: that.curOptions.latitude, altitude: that.curOptions.altitude,
    //                                                                 accuracy: that.curOptions.accuracy, diameter: that.curOptions.diameter, height: that.curOptions.height, volume: that.curOptions.volume,
    //                                                                 killMethodsValue: that.curOptions.killMethodsValue, remarks: that.curOptions.remarks, batch: that.curOptions.batch,
    //                                                                 current: '1', allLength: '1', curRow: '1'
    //                                                             }
    //                                                         }).toPromise().then(res => {
    //                                                              
    //                                                              
    //                                                              

    //                                                             if (that.i >= that.curTmpSotrage.length - 1) {
    //                                                                 that.isComplete = true;
    //                                                             }
    //                                                              
    //                                                             that.subProcessFin = true;
    //                                                             resolve('ok');
    //                                                             // that.base.showAlert("全部成功了", "", () => { });
    //                                                             //  
    //                                                             //  
    //                                                         }, (msg) => {
    //                                                              
    //                                                              
    //                                                             that.subProcessFin = false;
    //                                                             reject('error');
    //                                                             // this.base.showAlert('提示', '提交失败', () => { });
    //                                                         });
    //                                                         if(that.subProcessFin == true){
    //                                                             resolve('ok');
    //                                                         }else{
    //                                                             reject('error');
    //                                                         }
    //                                             }
    //                                             reject('error');
    //                                     })
    //                             }).catch((err) => {
    //                                  
    //                             })
    //                              
    //                             //  if (!that.picNotExist)
    //                                 this.observers.push(observer);
    //                               
    //                              

    //                                 //  
    //                         })(i,j)
    //                             // })(j)
    //                     }
    //         } else {
    //             //这个接口还要再改造下，判断是否全部传完了
    //             let obsernoPic = await new Promise((resolve,reject)=>{
    //                 that.httpClient.post(that.base.BASE_URL + 'app/AddDeadtreePhoto', {},
    //                     {
    //                         headers: { token: localStorage['token'] }, params: {
    //                             deviceId: element.deviceId, longitude: element.longitude, latitude: element.latitude, altitude: element.altitude,
    //                             accuracy: element.accuracy, diameter: element.diameter, height: element.height, volume: element.volume,
    //                             killMethodsValue: element.killMethodsValue, remarks: element.remarks, batch: element.batch
    //                         }
    //                     })
    //                     .subscribe(res => {
    //                         resolve('ok');
    //                     }, (msg) => {
    //                         reject('error');
    //                     });
    //             }).catch((reason)=>{
    //                  
    //             })
    //             that.observers.push(obsernoPic);
    //         }
    //     })(i)
    //     // })(i)
    // }


    //     Promise.all(this.observers).then((resolve) => {
    //          
    //          
    //         loader.dismiss();
    //          
    //         if (that.isComplete) {
    //              
    //             localStorage.removeItem('deadCache');
    //         }
    //     }, (reject) => {
    //          
    //         loader.dismiss();
    //     }).catch((reason) => {
    //         loader.dismiss();
    //          
    //     })


    async ionViewDidLoad() {
        // localStorage.removeItem('deadCache');
        this.threePhotos = false;
        this.canSubmit = true;
        var that = this;
        /*if (localStorage["deadBind"]) {

            var tmpStorage2 = [];

            tmpStorage2 = JSON.parse(localStorage["deadBind"]);

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
                                localStorage.removeItem("deadBind");
                                this.base.showAlert("清理了缓存", "", () => {
                                });
                            }
                        },
                        msg => {

                        })

            })


        }*/


        //deadCache
        /*if (localStorage["deadCache"]) {
            const alert = this.alertCtrl.create({
                title: "有缓存数据，是否提交?",
                subTitle: "提示：4G以下网络环境提交时间可能会延长，建议Wi-Fi状况良好或者4G网络环境下提交。",
                buttons: [
                    {
                        text: '确认', handler: async () => {
                             
                            var tmpStorage = JSON.parse(localStorage["deadCache"]);
                            //  
                            //  
                            //  
                            //  

                            if (localStorage["deadPhotoCache1"]) {
                                this.photolib1 = JSON.parse(localStorage["deadPhotoCache1"]);
                            }
                            if (localStorage["deadPhotoCache2"]) {
                                this.photolib2 = JSON.parse(localStorage["deadPhotoCache2"]);
                            }
                            if (localStorage["deadPhotoCache3"]) {
                                this.photolib3 = JSON.parse(localStorage["deadPhotoCache3"]);
                            }

                            this.i = 0;
                            //i是一条一条的记录
                            //  

                            // let n = this.awaitF();
                            //  

                            let tmpDeviceList = [];
                            this.curTmpSotrage = tmpStorage;
                             
                            const loader = this.loadingCtrl.create({
                                content: "缓存数据正在提交，请勿退出",
                            });
                            loader.present();
                            for (var i = 0; i < tmpStorage.length; ++i) {
                                var element = tmpStorage[i];
                                that.curFail = false;
                                if (element.hasPic == true) {
                                    for (var j = 1; j <= element.photoSum; ++j) {
                                        that.j = j;
                                        await this.postAdddeadtree(tmpStorage[i], this.httpClient, this.base, tmpStorage, i, j).then(
                                            res => {
                                                 
                                                 
                                            }, msg => {
                                                 
                                                 
                                                 
                                                if (!that.curFail) {
                                                    tmpDeviceList.push(tmpStorage[i]);
                                                }
                                                that.curFail = true;
                                            }
                                        ).catch((error) => {
                                             
                                        })
                                    }
                                } else {
                                    await this.postAdddeadtreePlus(tmpStorage[i], this.httpClient, this.base, tmpStorage, i).then(
                                        res => {
                                             
                                             
                                        }, msg => {
                                             
                                             
                                            tmpDeviceList.push(tmpStorage[i]);
                                        }
                                    ).catch((error) => {
                                         
                                    })
                                }
                            }
                            for (let i = 0; i < tmpDeviceList.length; ++i) {
                                this.indexList.push(tmpDeviceList[i]);
                                 
                            }
                             
                             
                            if (this.indexList.length <= 0) {
                                 
                                localStorage.removeItem('deadCache');
                            } else {
                                localStorage.setItem('deadCache', JSON.stringify(this.indexList));
                            }
                            loader.dismiss();
                        }
                    }, {
                        text: '取消', handler: () => {
                             

                        }
                    }]
            });
            alert.present();
            // this.sleep(tmpStorage);

        }*/

        if (localStorage["deadKill"]) {
            //  
            this.killMethods = JSON.parse(localStorage["deadKill"]);
            //  
            //  
        }
        this.httpClient.post(this.base.BASE_URL + 'app/getKillMethods', {},
            {
                headers: {token: localStorage['token']},
                params: new HttpParams({fromObject: {worker: localStorage['username']}})
            })
            .subscribe(res => {
                    var c: any = res;
                    this.killMethods = Array.from(c);
                    //  
                    //  
                    localStorage['deadKill'] = JSON.stringify(res);

                },
                res => {
                    //  
                })

    }

    NavToQuery() {
        if (this.deviceId) {
            localStorage["DeadMotherDeviceId"] = this.deviceId;
            this.navCtrl.push(DeadTreesQueryPage);
        } else {
            this.base.showAlert("提示", "请先扫码或输入数字的设备ID!", () => {
            });
        }

    }


    takePhoto() {
        this.hasPic = true;

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
            this.photosum = this.photosum + 1;
            if (this.photosum == 3) {
                this.threePhotos = true;
                this.canSubmit = false;
            }

            //注释掉
            // let options: FileUploadOptions = {};
            // options.fileKey = "image";
            // var time = Date.parse(Date());
            // options.fileName = time + ".jpg";
            // options.mimeType = "image/jpeg";
            // options.chunkedMode = false;
            // options.httpMethod = "POST";
            // options.params = {
            //     deviceId: this.deviceId, longitude: this.longtitude, latitude: this.latitude, altitude: this.altitude,
            //     accuracy: this.accuracy, diameter: this.diameter.toString(), height: this.height.toString(), volume: this.volume.toString(),
            //     killMethodsValue: this.killMethodsValue, remarks: this.remarks
            // };
            // options.params = {
            //     deviceId: this.deviceId, current:this.photosum
            // };

            // options.headers = { token: localStorage['token'] };
            //  
            //  

            //上传文件对象
            // const fileTransfer: FileTransferObject = this.fileTransfer.create();
            //此处整合进submit()
            // fileTransfer.upload(this.imageData, this.base.BASE_URL + 'app/AddDeadtreePhoto2', options)
            //     .then((res) => {
            //  
            //  
            //  

            // this.base.logger(JSON.stringify(res), "Img_maintenance_submit_function_fileTransferRes.txt");

            //     this.base.showAlert('提示', '提交成功', () => { });
            // }, (error) => {//发送失败(网络出错等)
            //     this.base.showAlert('提示', '提交失败', () => { });
            // this.base.logger(JSON.stringify(error), "Img_maintenance_submit_function_fileTransferError.txt");
            if (this.photosum == 1) {
                this.cachePhoto1 = this.imageData;
            } else if (this.photosum == 2) {
                this.cachePhoto2 = this.imageData;
            } else if (this.photosum == 3) {
                this.cachePhoto3 = this.imageData;
            }
            // let cacheData = {
            //     deviceId: this.deviceId,
            //     photoSum:this.photosum,
            //     img: this.imageData
            // };

            // let deadCache: any;
            //     deadCache = localStorage.getItem('deadPhotoCache' + this.photosum);
            // if (deadCache == null) {
            //     deadCache = [];
            // } else {
            //     deadCache = JSON.parse(deadCache);
            // }
            // deadCache.push(cacheData);
            //     localStorage.setItem('deadPhotoCache' + this.photosum.toString(), JSON.stringify(deadCache));

            // })
        }, (err) => {
            // Handle error
            // this.navCtrl.popToRoot()
        }).catch((error) => {
            // console.log(error)
        });
    }




    callBack = (params) => {
        return new Promise((resolve, reject) => {
            if (params) {
                var allDevice = JSON.parse(localStorage["device"]);

                var flag = 0;
                allDevice.forEach(element => {
                    if ((element.scanId == params.id)) {
                        flag = 1;
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

                    //此处整合进submit()
                    // this.httpClient.post(this.base.BASE_URL + 'app/addDeviceId', {},
                    //     {
                    //         headers: { token: localStorage['token'] }, params: {
                    //             deviceId: this.deviceId
                    //         }
                    //     }).subscribe(res => {
                    //         this.batch = res;
                    //     })

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
        //  
        //  
        this.navCtrl.push(ScanPage, {callBack: this.callBack});
    }

    async submit() {
        this.canSubmit = true;
        const loader = this.loadingCtrl.create({
            content: "缓存数据正在提交，请勿退出",
        });
        // this.have_submit = true;
        
        // let num1 = 0;
        // if (this.volume < 0 || this.volume == NaN || !this.volume) {
        //     // this.diameter = 0;
        //     // this.height = 0;
        //     // this.volume = 0;
        //     // this.base.showAlert('提示', '请输入数字', () => { });
        // }

        // num1 = this.volume;

        // if (!this.diameter){
        //     this.diameter = 0;
        // }
        // if (!this.height){
        //     this.height = 0;
        // }
        // if (!this.volume){
        //     this.volume = 0;
        // }
        // if (!this.killMethodsValue){
        //     this.killMethodsValue = "0";
        // }

        if (!this.flag1 ||!this.flag2 ) {
            this.base.showAlert("提示", "桩径或树高太大！", () => {
            });
            this.canSubmit = false;
        } else {
            // var options: string = "deviceId: " + this.id +
            //     "longitude:" + this.longitude + "latitude:" + this.latitude + "num:" + this.num +
            //     "maleNum:" + this.maleNum + "femaleNum:" + this.femaleNum + "altitude:" + this.altitude +
            //     "drug:" + this.drug + "remark:" + this.remark + "workingContent:" + this.workingContent + "otherNum:" + this.otherNum + "otherType:" + this.otherType;

            // this.base.logger(JSON.stringify(options), "NoImg_newDeadTreePar.txt");
            if (!this.altitude || !this.longtitude || !this.latitude || !this.accuracy || !this.killMethodsValue || !this.height || this.height < 0 || this.height == NaN || !this.diameter || this.diameter < 0 || this.diameter == NaN || !this.volume || this.volume < 0 || this.volume == NaN) {
                this.base.showAlert("提示", "数据未填写，或填写格式错误！", () => {
                });
                this.canSubmit = false;
                return;
            }
             

            if (this.photosum <= 0) {
                let observer = await new Promise((resolve, reject) => {
                    this.httpClient.post(this.base.BASE_URL + 'app/AddDeadtreePhoto', {},
                        {
                            headers: {token: localStorage['token']}, params: {
                                deviceId: this.deviceId,
                                longitude: this.longtitude,
                                latitude: this.latitude,
                                altitude: this.altitude,
                                accuracy: this.accuracy,
                                diameter: this.diameter.toString(),
                                height: this.height.toString(),
                                volume: this.volume.toString(),
                                killMethodsValue: this.killMethodsValue,
                                remarks: this.remarks,
                                current: "0",
                                batch: this.batch,
                                allLength: "1",
                                curRow: "1"
                            }
                        })
                        .toPromise().then(res => {
                        resolve('ok');
                    }, (msg) => {
                        reject('error');
                    }).catch((err) => {
                         
                        reject('error');
                    });
                }).catch((err) => {
                     
                })
                this.observers.push(observer);
            } else {
                for (var j = 1; j <= this.photosum; j = j + 1) {
                    await (async (j: string | number) => {
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
                            diameter: this.diameter,
                            height: this.height,
                            volume: this.volume,
                            killMethodsValue: this.killMethodsValue,
                            remarks: this.remarks,
                            current: j,
                            batch: this.batch,
                            allLength: "1",
                            curRow: "1"
                        };
                        options.headers = {token: localStorage['token']};
                        const fileTransfer: FileTransferObject = this.fileTransfer.create();
                        var uploadAddress: string;
                        if (j == 1) {
                            uploadAddress = this.cachePhoto1;
                            //this.currentImg = this.photolib1;
                        } else if (j == 2) {
                            uploadAddress = this.cachePhoto2;
                            // this.currentImg = this.photolib2;
                        } else if (j == 3) {
                            uploadAddress = this.cachePhoto3;
                            // this.currentImg = this.photolib3;
                        }

                        let observer = await new Promise((resolve, reject) => {
                            fileTransfer.upload(uploadAddress, this.base.BASE_URL + 'app/AddDeadtreePhoto', options)
                                .then((res) => {
                                    if (JSON.parse(res.response).isComp == true) {
                                        this.isComplete = true;
                                    } else {
                                        this.isComplete = false;
                                    }
                                    resolve('ok');
                                }).catch((error) => {
                                this.picNotExist = true;
                                reject('error');
                            })
                        }).catch((reason) => {
                             
                        })
                         
                        this.observers.push(observer);
                    })(j)
                }
            }

            Promise.all(this.observers).then((resolve) => {
                 
                loader.dismiss();
                for (var i = 0; i < resolve.length; i++) {
                    if (resolve[i] == undefined || resolve[i] == "") {
                        this.submitFail = true;
                    }
                }
                if (this.submitFail) {
                    let cacheData = {
                        deviceId: this.deviceId,
                        longitude: this.longtitude,
                        latitude: this.latitude,
                        altitude: this.altitude,
                        accuracy: this.accuracy,
                        diameter: this.diameter,
                        height: this.height,
                        volume: this.volume,
                        killMethodsValue: this.killMethodsValue,
                        remarks: this.remarks,
                        hasPic: this.hasPic,
                        photoSum: this.photosum,
                        batch: this.batch,
                        pic1: this.cachePhoto1,
                        pic2: this.cachePhoto2,
                        pic3: this.cachePhoto3,
                        allLength: 1,
                        curRow: 1
                    };
                    //  
                    //  

                    let deadCache: any;
                    deadCache = localStorage.getItem('deadCache');
                    if (deadCache == null) {
                        deadCache = [];
                    } else {
                        deadCache = JSON.parse(deadCache);
                    }
                    deadCache.push(cacheData);
                    localStorage.setItem('deadCache', JSON.stringify(deadCache));
                    this.base.showAlert('提示', '提交失败', () => {
                    });
                } else {
                    this.base.showAlert('提示', '提交成功', () => {
                    });
                }
                Base.popTo(this.navCtrl, 'switchProjectPage');
            }, (reject) => {
                 
                this.base.showAlert('提示', '提交失败', () => {
                });
                Base.popTo(this.navCtrl, 'switchProjectPage');
                loader.dismiss();
            }).catch((reason) => {
                 

                this.base.showAlert('提示', '提交失败', () => {
                });
                let cacheData = {
                    deviceId: this.deviceId,
                    longitude: this.longtitude,
                    latitude: this.latitude,
                    altitude: this.altitude,
                    accuracy: this.accuracy,
                    diameter: this.diameter,
                    height: this.height,
                    volume: this.volume,
                    killMethodsValue: this.killMethodsValue,
                    remarks: this.remarks,
                    hasPic: this.hasPic,
                    photoSum: this.photosum,
                    batch: this.batch,
                    pic1: this.cachePhoto1,
                    pic2: this.cachePhoto2,
                    pic3: this.cachePhoto3,
                    allLength: 1,
                    curRow: 1
                };
                //  
                //  

                let deadCache: any;
                deadCache = localStorage.getItem('deadCache');
                if (deadCache == null) {
                    deadCache = [];
                } else {
                    deadCache = JSON.parse(deadCache);
                }
                deadCache.push(cacheData);
                localStorage.setItem('deadCache', JSON.stringify(deadCache));
                Base.popTo(this.navCtrl, 'switchProjectPage');
                loader.dismiss();


            })

            // this.httpClient.post(this.base.BASE_URL + 'app/AddDeadtrees', {},
            //     {
            //         headers: { token: localStorage['token'] }, params: {
            //             deviceId: this.deviceId, longitude: this.longtitude, latitude: this.latitude, altitude: this.altitude,
            //             accuracy: this.accuracy, diameter: this.diameter.toString(), height: this.height.toString(), volume: this.volume.toString(),
            //             killMethodsValue: this.killMethodsValue, remarks: this.remarks, hasPic: this.hasPic.toString(), batch: this.batch
            //         }
            //     })
            //     .subscribe(res => {
            //         //  
            //         //  
            //         // this.base.logger(JSON.stringify(res), "NonImg_maintenance_submit_function_fileTransferRes.txt");
            //         this.base.showAlert('提示', '提交成功', () => { });
            //         let cacheData = {
            //             deviceId: this.deviceId, longitude: this.longtitude, latitude: this.latitude, altitude: this.altitude,
            //             accuracy: this.accuracy, diameter: this.diameter, height: this.height, volume: this.volume,
            //             killMethodsValue: this.killMethodsValue, remarks: this.remarks, hasPic: this.hasPic, batch: this.batch
            //         };
            //         //  
            //         //  

            //         Base.popTo(this.navCtrl, 'switchProjectPage');
            //     }, (msg) => {

            //         // this.base.logger(JSON.stringify(msg), "NonImg_maintenance_submit_function_fileTransferError.txt");

            //         this.base.showAlert('提示', '提交失败', () => { });
            //         let cacheData = {
            //             deviceId: this.deviceId, longitude: this.longtitude, latitude: this.latitude, altitude: this.altitude,
            //             accuracy: this.accuracy, diameter: this.diameter, height: this.height, volume: this.volume,
            //             killMethodsValue: this.killMethodsValue,
            //             remarks: this.remarks, hasPic: this.hasPic,
            //             photoSum: this.photosum, batch: this.batch,
            //             pic1:this.cachePhoto1,pic2:this.cachePhoto2,pic3:this.cachePhoto3
            //         };
            //         //  
            //         //  

            //         let deadCache: any;
            //         deadCache = localStorage.getItem('deadCache');
            //         if (deadCache == null) {
            //             deadCache = [];
            //         } else {
            //             deadCache = JSON.parse(deadCache);
            //         }
            //         deadCache.push(cacheData);
            //         localStorage.setItem('deadCache', JSON.stringify(deadCache));
            //             Base.popTo(this.navCtrl, 'switchProjectPage');
            //     });

        }

    }


    trapClick() {
        //  
    }

    test3() {

        for (var i = 0; i < 10000; i++) {
            (function (i) {
                setTimeout(function () {
                    this.deviceId = (i + 100000120000).toString();
                    this.longtitude = ((Math.random() * 0.1 + 119.23113951284115)).toString();
                    this.latitude = ((Math.random() * 0.1 + 26.083115579358804)).toString();
                    this.accuracy = "22";
                    this.altitude = "14";
                    this.remarks = "0";
                    this.height = 20
                    this.killMethodsValue = "4"
                    this.diameter = 5
                    this.volume = 20
                    this.httpClient.post(this.base.BASE_URL + 'app/AddDeadtrees', {},
                        {
                            headers: {token: localStorage['token']}, params: {
                                deviceId: this.deviceId,
                                longitude: this.longtitude,
                                latitude: this.latitude,
                                altitude: this.altitude,
                                accuracy: this.accuracy,
                                diameter: this.diameter.toString(),
                                height: this.height.toString(),
                                volume: this.volume.toString(),
                                killMethodsValue: this.killMethodsValue,
                                remarks: this.remarks
                            }
                        })
                        .subscribe(res => {
                            //  
                            //  
                            // this.base.logger(JSON.stringify(res), "NonImg_maintenance_submit_function_fileTransferRes.txt");
                            // this.base.showAlert('提示', '提交成功', () => { });
                            let cacheData = {
                                deviceId: this.deviceId,
                                longitude: this.longtitude,
                                latitude: this.latitude,
                                altitude: this.altitude,
                                accuracy: this.accuracy,
                                diameter: this.diameter.toString(),
                                height: this.height.toString(),
                                volume: this.volume.toString(),
                                killMethodsValue: this.killMethodsValue,
                                remarks: this.remarks
                            };
                            //  
                            //  

                            Base.popTo(this.navCtrl, 'switchProjectPage');
                        }, (msg) => {

                        });
                }, 100);
            })(i)


        }
    }

    test() {
        for (var i = 0; i < 10000; i++) {
            (function (i) {
                setTimeout(function () {
                    this.deviceId = (i + 100000120000).toString();
                    this.httpClient.post(this.base.BASE_URL + 'app/addDeviceId', {},
                        {
                            headers: {token: localStorage['token']}, params: {
                                deviceId: this.deviceId
                            }
                        }).subscribe(res => {
                        this.batch = res;
                    })
                }, 100);
            })(i)

        }
    }

    deviceIdInput() {
        //  
        //  
    }

    deviceSerialInput() {
        //  
    }

}
