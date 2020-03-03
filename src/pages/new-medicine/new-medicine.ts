import {Component} from '@angular/core';
import {QRScanner, QRScannerStatus} from '@ionic-native/qr-scanner';
import {NavController, NavParams} from 'ionic-angular';
import {HttpClient, HttpParams} from "@angular/common/http";
import {ScanPage} from '../scan/scan';
import {Base} from '../../common/base.js';
import {Subscription} from "rxjs/Subscription";
import {Geolocation} from "@ionic-native/geolocation";
import {ChangeDetectorRef} from '@angular/core';
import {Camera, CameraOptions} from "@ionic-native/camera";
import {FileTransfer, FileTransferObject, FileUploadOptions} from "@ionic-native/file-transfer";
import {AboutPage} from '../about/about';
import {MedicineQueryPage} from '../medicine-query/medicine-query';
import {LoadingController} from 'ionic-angular';
import {AlertController} from 'ionic-angular';
import {Events} from 'ionic-angular';

/**
 * Generated class for the NewMedicinePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
    selector: 'page-new-medicine',
    templateUrl: 'new-medicine.html',
})

export class NewMedicinePage {
    deviceId: string
    deviceSerial: string
    // longtitude = "1.789456"
    // latitude = "2.154548"
    // altitude = "1.564465"
    // accuracy = "0.999999"
    longtitude:string
    latitude:string
    altitude:string
    accuracy:string
    // woodStatusValue:string
    medicinename: any[]
    medicinenameValue: string     //
    medicinenumber:number;
    controlarea:number;
    medicineworkContent: any[]
    workContentValue: string      //
    have_submit: boolean
    subscription: Subscription;
    remarks = ''
    imageData: ""
    location_ready: boolean
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
    indexList = [];
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
            if (!NewMedicinePage.checkNetworkState) {
                this.checkPostMaintenanceCache();
                this.checkPostBindCache();
                NewMedicinePage.checkNetworkState = true;
            }
        });
        this.events.subscribe('OFFLINE', () => {
            if (NewMedicinePage.checkNetworkState) {
                //TODO
                NewMedicinePage.checkNetworkState = false;
            }
        });
    }

    preSubmitted = 0;
    curSubmitted = 0;

    checkPostMaintenanceCache() {
        if (this.curSubmitted >= this.preSubmitted) {
            if (localStorage["medicineCache"]) {
                (async () => {
                     
                    let tmpDeviceList = [];
                    const tmpStorage = JSON.parse(localStorage["medicineCache"]);
                    this.preSubmitted = tmpStorage.length;
                    this.indexList = [];
                    let resolved = 0, rejected = 0;
                    for (let i = 0; i < tmpStorage.length; i++) {
                        await this.postMedicine(tmpStorage[i], this.httpClient, this.base, tmpStorage, i).then(
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
                    this.preSubmitted = resolved + rejected;
                    for (let i = 0; i < tmpDeviceList.length; ++i) {
                        this.indexList.push(tmpDeviceList[i]);
                         
                    }
                     
                     
                    if (this.indexList.length <= 0) {
                         
                        localStorage.removeItem('medicineCache');
                        this.preSubmitted = 0;
                        this.curSubmitted = 0;
                    } else {
                        localStorage.setItem('medicineCache', JSON.stringify(this.indexList));
                    }
                })();
            }
        }
    }

    checkPostBindCache() {
        if (localStorage["medicineBind"]) {
            var tmpStorage2 = [];

            tmpStorage2 = JSON.parse(localStorage["medicineBind"]);

             
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
                                localStorage.removeItem("medicineBind");
                                this.base.showAlert("清理了缓存", "", () => {
                                });
                            }
                        },
                        msg => {

                        })
            })
        }
    }

    deviceBind() {
        //这里还没有实现，先弹框
        this.base.showAlert("成功", "", () => {
        });
    }

    NavToMap() {
        this.navCtrl.push(AboutPage, {
            project: '5'
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

                    localStorage.setItem("medicineBind", JSON.stringify(BindIdCache));
                });
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
                medicinenameValue: "3",
                medicinenumber: 20,
                remarks: "SB" + (i + 1).toString(),
                workContentValue: "",
                controlarea: "5"
            };
            maintenanceCache = localStorage.getItem('medicineCache');
            if (maintenanceCache == null) {
                maintenanceCache = [];
            } else {
                maintenanceCache = JSON.parse(maintenanceCache);
            }
            maintenanceCache.push(cacheExp);
            localStorage.setItem('medicineCache', JSON.stringify(maintenanceCache));
        }
    }

    postMedicine(element, httpClient, base, tmpStorage, i) {
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
                medicinenameValue: element.medicinenameValue,
                medicinenumber: element.medicinenumber,
                remarks: element.remarks,
                workContentValue: element.workContentValue,
                controlarea: element.controlarea,
                allLength: tmpStorage.length,
                curRow: i
            };
            options.headers = {token: localStorage['token']};
             
             


            //创建文件对象
            const fileTransfer: FileTransferObject = this.fileTransfer.create();
            that.curOptions = options.params;

            this.base.logger(JSON.stringify(options), "Img_maintenance_submit_function_fileTransferPar.txt");
            return new Promise((resolve, reject) => {
                fileTransfer.upload(element.img, base.BASE_URL + 'app/Addmedicine', options)
                    .then((res) => {
                         
                         
                         

                         
                        if (JSON.parse(res.response).isComp == true) {
                            that.isComplete = true;
                        } else {
                            that.isComplete = false;
                        }

                        resolve('ok');

                    }, async (msg) => {
                         
                        await httpClient.post(base.BASE_URL + 'app/Addmedicine', {},
                            {
                                headers: {token: localStorage['token']}, params: {
                                    deviceId: element.deviceId,
                                    longitude: element.longitude,
                                    latitude: element.latitude,
                                    altitude: element.altitude,
                                    accuracy: element.accuracy,
                                    medicinenameValue: element.medicinenameValue,
                                    medicinenumber: element.medicinenumber,
                                    remarks: element.remarks,
                                    workContentValue: element.workContentValue,
                                    controlarea: element.controlarea,
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
        } else {
            return new Promise((resolve, reject) => {
                 
                 
                httpClient.post(base.BASE_URL + 'app/Addmedicine', {},
                    {
                        headers: {token: localStorage['token']}, params: {
                            deviceId: element.deviceId,
                            longitude: element.longitude,
                            latitude: element.latitude,
                            altitude: element.altitude,
                            accuracy: element.accuracy,
                            medicinenameValue: element.medicinenameValue,
                            medicinenumber: element.medicinenumber,
                            remarks: element.remarks,
                            workContentValue: element.workContentValue,
                            controlarea: element.controlarea,
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
        //  
        /*if (localStorage["medicineBind"]) {
            var tmpStorage2 = [];

            tmpStorage2 = JSON.parse(localStorage["medicineBind"]);

             
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
                                localStorage.removeItem("medicineBind");
                                this.base.showAlert("清理了缓存", "", () => {
                                });
                            }
                        },
                        msg => {

                        })
            })
        }*/

         
         
        var that = this;
        /*if (localStorage["medicineCache"]) {
            const alert = this.alertCtrl.create({
                title: "有缓存数据，是否提交?",
                subTitle: "提示：4G以下网络环境提交时间可能会延长，建议Wi-Fi状况良好或者4G网络环境下提交。",
                buttons: [
                    {
                        text: '确认', handler: async () => {
                             
                            let tmpDeviceList = [];
                            var tmpStorage = JSON.parse(localStorage["medicineCache"]);
                            //var i = 0;
                            //tmpStorage.forEach(element => {
                            const loader = this.loadingCtrl.create({
                                content: "缓存数据正在提交，请勿退出",
                            });
                            loader.present();
                            for (var i = 0; i < tmpStorage.length; i++) {
                                await this.postMedicine(tmpStorage[i], this.httpClient, this.base, tmpStorage, i).then(
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
                                 
                                localStorage.removeItem('medicineCache');
                            } else {
                                localStorage.setItem('medicineCache', JSON.stringify(this.indexList));
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

        //         await (async (i)=>{
        //             var element = tmpStorage[i];
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
        //         accuracy: element.accuracy, medicinenameValue: element.medicinenameValue, medicinenumber: element.medicinenumber, remarks: element.remarks,
        //         workContentValue: element.workContentValue,controlarea:element.controlarea
        //     };
        //     options.headers = { token: localStorage['token'] };
        //      
        //      


        //     //创建文件对象
        //     const fileTransfer: FileTransferObject = this.fileTransfer.create();
        //     this.curOptions = options.params;


        //     // this.base.logger(JSON.stringify(options), "Img_maintenance_submit_function_fileTransferPar.txt");

        //     let observer = await new Promise((resolve,reject)=>{
        //         fileTransfer.upload(element.img, this.base.BASE_URL + 'app/Addmedicine', options)
        //             .then((res) => {
        //                      
        //                      
        //                      
        //                     if (JSON.parse(res.response).isComp == true) {
        //                         this.isComplete = true;
        //                     } else {
        //                         this.isComplete = false;
        //                     }

        //                     resolve('ok');

        //                 },async (msg)=>{
        //                     await that.httpClient.post(this.base.BASE_URL + 'app/Addmedicine', {},
        //                     {
        //                         headers: { token: localStorage['token'] }, params: {
        //                             deviceId: element.deviceId, longitude: element.longitude, latitude: element.latitude, altitude: element.altitude,
        //                             accuracy: element.accuracy,medicinenameValue: element.medicinenameValue, medicinenumber: element.medicinenumber, remarks: element.remarks,
        //                             workContentValue: element.workContentValue,controlarea:element.controlarea
        //                         }
        //                     })
        //                     .toPromise().then(res => {
        //                          
        //                         if (JSON.parse(JSON.stringify(res)).isComp == true){
        //                             this.isComplete = true;
        //                         }else{
        //                             this.isComplete = false;
        //                         }
        //                         this.isSubProcessFin = true;
        //                         this.base.showAlert("提示", "无图片提交成功", () => { });
        //                         resolve('ok');
        //                     }, msg => {
        //                          
        //                         this.isSubProcessFin = false;
        //                         reject('error');
        //                     })
        //                     if( this.isSubProcessFin == true){
        //                         resolve('ok');
        //                     }else{
        //                         reject('error');
        //                     }
        //                         reject('error');
        //                 })
        //         }).catch((error)=>{
        //              
        //         })
        //         that.observers.push(observer);
        //     i++;
        //     // this.base.logger(JSON.stringify(res), "Img_maintenance_submit_function_fileTransferRes.txt");

        //     // this.base.showAlert('提示', '提交成功', () => { });
        //     if (i >= tmpStorage.length)
        //         localStorage.removeItem('medicineCache');
        // }, (error) => {//发送失败(网络出错等)
        //      
        //         this.httpClient.post(this.base.BASE_URL + 'app/Addmedicine', {},
        //             {
        //                 headers: { token: localStorage['token'] }, params: {
        //                     deviceId: element.deviceId, longitude: element.longitude, latitude: element.latitude, altitude: element.altitude,
        //                     accuracy: element.accuracy,medicinenameValue: element.medicinenameValue, medicinenumber: element.medicinenumber, remarks: element.remarks,
        //                     workContentValue: element.workContentValue,controlarea:element.controlarea
        //                 }
        //             })
        //             .subscribe(res => {
        //                 i++;
        //                  
        //                  
        //                 // this.base.showAlert('提示', '提交成功', () => { });
        //                 if(i>=tmpStorage.length)
        //                     localStorage.removeItem('medicineCache');
        //             }, (msg) => {
        //                 // this.base.showAlert('提示', '提交失败', () => { });
        //             });
        //     // this.base.showAlert('提示', '提交失败', () => { });
        // })
        //         } else {
        //              
        //             let obs =  await new Promise((resolve,reject)=>{
        //             this.httpClient.post(this.base.BASE_URL + 'app/Addmedicine', {},
        //                 {
        //                     headers: { token: localStorage['token'] }, params: {
        //                         deviceId: element.deviceId, longitude: element.longitude, latitude: element.latitude, altitude: element.altitude,
        //                         accuracy: element.accuracy, medicinenameValue: element.medicinenameValue, medicinenumber: element.medicinenumber, remarks: element.remarks,
        //                         workContentValue: element.workContentValue,controlarea:element.controlarea
        //                     }
        //                 })
        //                 .subscribe(res => {
        //                     // i++;
        //                     //  
        //                     //  
        //                     // // this.base.showAlert('提示', '提交成功', () => { });
        //                     // if(i>=tmpStorage.length)
        //                     //     localStorage.removeItem('medicineCache');
        //                     if (JSON.parse(JSON.stringify(res)).isComp == true) {
        //                         this.isComplete = true;
        //                     } else {
        //                         this.isComplete = false;
        //                     }
        //                     resolve('ok');
        //                 }, (msg) => {
        //                      
        //                     reject('error');
        //                     // this.base.showAlert('提示', '提交失败', () => { });
        //                 });
        //             }).catch((error)=>{
        //                  
        //             })
        //             that.observers.push(obs);

        //         }
        //     // });
        //         })(i)
        //     }
        //                 Promise.all(that.observers).then((resolve) => {
        //                      
        //                     loader.dismiss();
        //                          
        //                     if (that.isComplete){
        //                         localStorage.removeItem('medicineCache');
        //                     }
        //                 }, (reject) => {
        //                      
        //                     loader.dismiss();
        //                 }).catch((reason) => {
        //                      
        //                     loader.dismiss();
        //                 })

        // }

        // 药剂名称
        if (localStorage["Medicinename"]) {
             
            this.medicinename = JSON.parse(localStorage["Medicinename"]);
             
             
        }

        this.httpClient.post(this.base.BASE_URL + 'app/getMedicinename', {},
            {
                headers: {token: localStorage['token']},
                params: new HttpParams({fromObject: {worker: localStorage['username']}})
            })
            .subscribe(res => {
                    var c: any = res;
                    this.medicinename = Array.from(c);
                     
                    localStorage['Medicinename'] = JSON.stringify(res);

                },
                res => {
                     
                })

        //药剂质量不需要后端获取


        // 工作内容
        if (localStorage["MedicineWorkContent"]) {
             
            this.medicineworkContent = JSON.parse(localStorage["MedicineWorkContent"]);
             
             
        }

        this.httpClient.post(this.base.BASE_URL + 'app/getMedicineWorkContent', {},
            {
                headers: {token: localStorage['token']},
                params: new HttpParams({fromObject: {worker: localStorage['username']}})
            })
            .subscribe(res => {
                    var c: any = res;
                    this.medicineworkContent = Array.from(c);
                     
                    localStorage['MedicineWorkContent'] = JSON.stringify(res);

                },
                res => {
                     
                })

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
                     
                    //  
                    if ((element.scanId == params.id && element.id.charAt(8) == '5')){
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

    NavToQuery() {
        if (this.deviceId) {
            localStorage["MedicineDeviceId"] = this.deviceId;
            this.navCtrl.push(MedicineQueryPage);
        } else {
            this.base.showAlert("提示", "请先扫码或输入数字的设备ID!", () => {
            });
        }

    }

    scan() {
         
         
        this.navCtrl.push(ScanPage, {callBack: this.callBack});
    }

    submit() {
        this.have_submit = true;
        // let num1 = 0;
        //  
        // // if (parseInt(this.medicinenumber) < 0 || parseInt(this.medicinenumber) == NaN) {
        // if (this.medicinenumber < 0 || this.medicinenumber == NaN) {
        //      
        //     this.medicinenumber = 0;
        //     // this.base.showAlert('提示', '请输入数字', () => { });
        // }
        // if (!this.medicinenumber) {
        //      
        //     this.medicinenumber = 0;
        //     // this.base.showAlert('提示', '请输入数字', () => { });
        // }
        // num1 = this.medicinenumber;
        // this.medicinenumber = num1;
        // if (this.medicinenumber == 'NaN') {
        //      
        //     this.medicinenumber = "";
        //     // this.base.showAlert('提示', '请输入数字', () => { });
        // }
        // let num2 = 0;
        // if (this.controlarea < 0 || this.controlarea == NaN) {
        //      
        //     this.controlarea = 0;
        //     // this.base.showAlert('提示', '请输入数字', () => { });
        // }
        // if (!this.controlarea) {
        //      
        //     this.controlarea = 0;
        //     // this.base.showAlert('提示', '请输入数字', () => { });
        // }
        // num2 = this.controlarea;
        // this.controlarea = num2;
        // if (this.controlarea == 'NaN') {
        //      
        //     this.controlarea = "";
        //     // this.base.showAlert('提示', '请输入数字', () => { });
        // }

        // if (!this.woodStatusValue){
        //     this.woodStatusValue = "0";
        // }
        // if (!this.medicinenumber){
        //     this.medicinenumber = "0";
        // }
        // if (!this.workContentValue){
        //     this.workContentValue = "0";
        // }

        // var r = /^(?:[1-9]\d*|0)(?:\.\d+)?$/;
        // var flag1=r.test(this.medicinenumber.toString())
        // var flag2=r.test(this.controlarea.toString())
        //  
        //  

        if ( !this.altitude || !this.longtitude || !this.latitude || !this.accuracy || !this.medicinenameValue || !this.workContentValue || !this.medicinenumber || this.medicinenumber < 0 || this.medicinenumber >999999999 || this.medicinenumber == NaN || !this.controlarea || this.controlarea < 0 || this.controlarea >999999999 || this.controlarea == NaN) {
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
                    medicinenameValue: this.medicinenameValue,
                    medicinenumber: this.medicinenumber,
                    remarks: this.remarks,
                    workContentValue: this.workContentValue,
                    controlarea: this.controlarea
                };
                options.headers = {token: localStorage['token']};
                 
                 

                //创建文件对象
                const fileTransfer: FileTransferObject = this.fileTransfer.create();


                this.base.logger(JSON.stringify(options), "Img_maintenance_submit_function_fileTransferPar.txt");
                if (!this.altitude || !this.longtitude || !this.latitude || !this.accuracy || !this.medicinenameValue || !this.workContentValue || !this.medicinenameValue || !this.workContentValue || !this.medicinenumber || this.medicinenumber < 0 || this.medicinenumber >999999999 || this.medicinenumber == NaN || !this.controlarea || this.controlarea < 0 || this.controlarea >999999999|| this.controlarea == NaN) {
                    this.base.showAlert("提示", "数据未填写，或填写格式错误！", () => {
                    });
                    return;
                }
                fileTransfer.upload(this.imageData, this.base.BASE_URL + 'app/Addmedicine', options)
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
                            medicinenameValue: this.medicinenameValue,
                            medicinenumber: this.medicinenumber,
                            remarks: this.remarks,
                            workContentValue: this.workContentValue,
                            controlarea: this.controlarea,
                            img: this.imageData
                        };
                        let medicineCache: any;
                        medicineCache = localStorage.getItem('medicineCache');
                        if (medicineCache == null) {
                            medicineCache = [];
                        } else {
                            medicineCache = JSON.parse(medicineCache);
                        }
                        medicineCache.push(cacheData);
                        //localStorage安全保存数据
                        // try{
                        //   localStorage.setItem('medicineCache', JSON.stringify(medicineCache));
                        // }catch(oException){
                        //     if(oException.name == 'QuotaExceededError'){
                        //         this.base.showAlert('提示', '无法提交，缓存容量不足，请及时处理', ()=>{});
                        //         // 
                        //             // 可进行超出限定大小之后的操作，如下面可以先清除记录，再次保存
                        //       // localStorage.clear();
                        //       // localStorage.setItem(key,value);
                        //     }
                        // }

                        localStorage.setItem('medicineCache', JSON.stringify(medicineCache));
                        //this.navCtrl.pop();
                        // confirm.dismiss()
                        Base.popTo(this.navCtrl, 'switchProjectPage');
                    })
                    .catch((error) => {//发送失败(文件不存在等)
                        this.httpClient.post(this.base.BASE_URL + 'app/Addmedicine', {},
                            {
                                headers: {token: localStorage['token']}, params: {
                                    deviceId: this.deviceId.toString(),
                                    longitude: this.longtitude.toString(),
                                    latitude: this.latitude.toString(),
                                    altitude: this.altitude.toString(),
                                    accuracy: this.accuracy.toString(),
                                    medicinenameValue: this.medicinenameValue.toString(),
                                    medicinenumber: this.medicinenumber.toString(),
                                    remarks: this.remarks,
                                    workContentValue: this.workContentValue,
                                    controlarea: this.controlarea.toString()
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
                                    medicinenameValue: this.medicinenameValue,
                                    medicinenumber: this.medicinenumber,
                                    remarks: this.remarks,
                                    workContentValue: this.workContentValue,
                                    controlarea: this.controlarea
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
                                    medicinenameValue: this.medicinenameValue,
                                    medicinenumber: this.medicinenumber,
                                    remarks: this.remarks,
                                    workContentValue: this.workContentValue,
                                    controlarea: this.controlarea
                                };
                                 
                                 

                                let medicineCache: any;
                                medicineCache = localStorage.getItem('medicineCache');
                                if (medicineCache == null) {
                                    medicineCache = [];
                                } else {
                                    medicineCache = JSON.parse(medicineCache);
                                }
                                medicineCache.push(cacheData);
                                // try{
                                //   localStorage.setItem('medicineCache', JSON.stringify(medicineCache));
                                // }catch(oException){
                                //     if(oException.name == 'QuotaExceededError'){
                                //         this.base.showAlert('提示', '无法提交，缓存容量不足，请及时处理', ()=>{});
                                //         // 
                                //             // 可进行超出限定大小之后的操作，如下面可以先清除记录，再次保存
                                //       // localStorage.clear();
                                //       // localStorage.setItem(key,value);
                                //     }
                                // }
                                localStorage.setItem('medicineCache', JSON.stringify(medicineCache));
                                 

                                //this.navCtrl.pop();
                                // confirm.dismiss();
                                Base.popTo(this.navCtrl, 'switchProjectPage');
                            });

                    });
            } else {

                // var options: string = "deviceId: " + this.id +
                //     "longitude:" + this.longitude + "latitude:" + this.latitude + "num:" + this.num +
                //     "maleNum:" + this.maleNum + "femaleNum:" + this.femaleNum + "altitude:" + this.altitude +
                //     "drug:" + this.drug + "remark:" + this.remark + "workingContent:" + this.workingContent + "otherNum:" + this.otherNum + "otherType:" + this.otherType;

                var options: FileUploadOptions = {};
                options.params = {
                    deviceId: this.deviceId, longitude: this.longtitude,
                    latitude: this.latitude, altitude: this.altitude,
                    accuracy: this.accuracy, medicinename: this.medicinenameValue,
                    medicinenumber: this.medicinenumber, remarks: this.remarks,
                    workContentValue: this.workContentValue,
                    controlarea: this.controlarea, myDate: new Date()
                };
                this.base.logger(JSON.stringify(options), "NoImg_MedicinePar.txt");
                if ( !this.altitude || !this.longtitude || !this.latitude || !this.accuracy || !this.medicinenameValue || !this.workContentValue || !this.medicinenumber || this.medicinenumber < 0 || this.medicinenumber >999999999 || this.medicinenumber == NaN || !this.controlarea || this.controlarea < 0 || this.controlarea >999999999 || this.controlarea == NaN) {
                    this.base.showAlert("提示", "数据未填写，或填写格式错误！", () => {
                    });
                    return;
                }
                this.httpClient.post(this.base.BASE_URL + 'app/Addmedicine', {},
                    {
                        headers: {token: localStorage['token']}, params: {
                            deviceId: this.deviceId.toString(),
                            longitude: this.longtitude.toString(),
                            latitude: this.latitude.toString(),
                            altitude: this.altitude.toString(),
                            accuracy: this.accuracy.toString(),
                            medicinenumber: this.medicinenumber.toString(),
                            remarks: this.remarks,
                            medicinenameValue: this.medicinenameValue.toString(),
                            workContentValue: this.workContentValue,
                            controlarea: this.controlarea.toString()
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
                            medicinenameValue: this.medicinenameValue,
                            medicinenumber: this.medicinenumber,
                            remarks: this.remarks,
                            workContentValue: this.workContentValue,
                            controlarea: this.controlarea
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
                            medicinenameValue: this.medicinenameValue,
                            medicinenumber: this.medicinenumber,
                            remarks: this.remarks,
                            workContentValue: this.workContentValue,
                            controlarea: this.controlarea
                        };
                         
                         

                        let medicineCache: any;
                        medicineCache = localStorage.getItem('medicineCache');
                        if (medicineCache == null) {
                            medicineCache = [];
                        } else {
                            medicineCache = JSON.parse(medicineCache);
                        }
                        medicineCache.push(cacheData);
                        // try{
                        //   localStorage.setItem('medicineCache', JSON.stringify(medicineCache));
                        // }catch(oException){
                        //     if(oException.name == 'QuotaExceededError'){
                        //         this.base.showAlert('提示', '无法提交，缓存容量不足，请及时处理', ()=>{});
                        //         // 
                        //             // 可进行超出限定大小之后的操作，如下面可以先清除记录，再次保存
                        //       // localStorage.clear();
                        //       // localStorage.setItem(key,value);
                        //     }
                        // }
                        localStorage.setItem('medicineCache', JSON.stringify(medicineCache));
                         

                        //this.navCtrl.pop();
                        // confirm.dismiss();
                        Base.popTo(this.navCtrl, 'switchProjectPage');
                    });

            }
        }

    }

    medicineClick() {
         
    }

    deviceIdInput() {
         
         
    }

    deviceSerialInput() {
         
    }


    test() {
        for (var i = 0; i < 2000; i++) {
            this.deviceId = Math.ceil(i + 20201).toString();
            this.longtitude = ((Math.random() * 0.1 + 119.23113951284115)).toString();
            this.latitude = ((Math.random() * 0.1 + 26.083115579358804)).toString();
            this.accuracy = "22"
            this.altitude = "14";
            this.remarks = "0";
            this.medicinenumber = 20
            this.medicinenameValue = "3"
            this.workContentValue = "2"
            this.controlarea = 5
            this.httpClient.post(this.base.BASE_URL + 'app/Addmedicine', {},
                {
                    headers: {token: localStorage['token']}, params: {
                        deviceId: this.deviceId.toString(),
                        longitude: this.longtitude.toString(),
                        latitude: this.latitude.toString(),
                        altitude: this.altitude.toString(),
                        accuracy: this.accuracy.toString(),
                        medicinenumber: this.medicinenumber.toString(),
                        remarks: this.remarks,
                        medicinenameValue: this.medicinenameValue.toString(),
                        workContentValue: this.workContentValue,
                        controlarea: this.controlarea.toString()
                    }
                })
                .subscribe(res => {

                }, (msg) => {


                });
        }
    }


//药剂数量
    medicinenumberInput() {
        let num1 = 0;
        if (this.medicinenumber < 0 || this.medicinenumber == NaN) {
            this.base.showAlert('提示', '请输入数字', () => {
            });
        }
        if (!this.medicinenumber) {
            this.base.showAlert('提示', '请输入数字', () => {
            });
        }
        num1 = this.medicinenumber;
        this.medicinenumber = 0 + num1;
        // if (this.medicinenumber == 'NaN') {
        //     this.base.showAlert('提示', '请输入数字', () => { });
        // }
    }

// 防治面积
    controlareaInput() {
        let num1 = 0;
        // if (parseInt(this.  controlarea) < 0 || parseInt(this.controlarea) == NaN) {
        if (this.controlarea < 0 || this.controlarea == NaN) {
            this.base.showAlert('提示', '请输入数字', () => {
            });
        }
        if (!this.controlarea) {
            this.base.showAlert('提示', '请输入数字', () => {
            });
        }
        num1 = this.controlarea;
        this.controlarea = 0 + num1;
        // if (this.controlarea == 'NaN') {
        //     this.base.showAlert('提示', '请输入数字', () => { });
        // }
    }

}

