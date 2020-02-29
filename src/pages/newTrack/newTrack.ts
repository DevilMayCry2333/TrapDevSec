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
import {AboutPage2} from '../about2/about';
import {Base64} from '@ionic-native/base64';
import {LoadingController} from 'ionic-angular';
import {AlertController} from 'ionic-angular';
import {Events} from 'ionic-angular';

@Component({
    selector: 'app-track',
    templateUrl: 'newTrack.html'
})
export class TrackPage {
    // longtitude: string;
    // latitude: string;
    // altitude: string;
    // accuracy: string;
    longtitude = "1.1234567";
    latitude = "1.1234567";
    altitude = "1.1234567";
    accuracy= "1.1234567";

    longtitudeData: Array<string>;
    latitudeData: Array<string>;
    altitudeData: Array<string>;
    accuracyData: Array<string>;

    location_ready: boolean;
    recordTime: any = {};
    i: any;
    observers = [];
    curTmpSotrage: any;
    curFail: boolean;
    indexList = [];
    photosum: number;
    photolib1: any;
    photolib2: any;
    photolib3: any;
    currentImg: any;
    currentNum = 0;
    isComplete = false;
    submitFail = false;
    curOptions: any;
    imageData: any;
    startRecordIsClick = false;
    endRecordIsClick = false;
    photoplib1: any;
    photoplib2: any;
    photoplib3: any;
    photoplib4: any;
    photoplib5: any;
    subProcessFin: any;

    cachePhoto1: any;
    cachePhoto2: any;
    cachePhoto3: any;
    cachePhoto4: any;
    cachePhoto5: any;

    picNotExsit1 = false;
    picNotExsit2 = false;
    picNotExsit3 = false;
    picNotExsit4 = false;
    picNotExsit5 = false;

    hasPic = false;

    current: number;

    isStopRecord = false;

    flag = 0;
    j: any;

    lineNameDis = false;

    ImageToBase: any[];
    picNotExist = false;
    // have_submit: boolean;
    myIntravl: any;
    subscription: Subscription;
    lineName: string;
    workContent: string;
    lateIntravl: string;
    remarks = "";
    fivePhotos = false;
    canSubmit = true;
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
    pic4: string;
    pic5: string;
    curtmpStorage: any;
    currOptions: any;


    constructor(
        public navCtrl: NavController,
        public qrScanner: QRScanner,
        private base: Base,
        private alertCtrl: AlertController,
        private geolocation: Geolocation,
        private changeDetectorRef: ChangeDetectorRef,
        private httpClient: HttpClient,
        private camera: Camera,
        private fileTransfer: FileTransfer,
        private base64: Base64,
        public loadingCtrl: LoadingController,
        public events: Events
    ) {
        this.photosum = 0;
        this.checkNetWork();
        // this.testCache();
    }

    static checkNetworkState: boolean = false;

    checkNetWork() {
        this.events.subscribe('ONLINE', () => {
            if (!TrackPage.checkNetworkState) {
                this.checkPostMaintenanceCache();
                TrackPage.checkNetworkState = true;
            }
        });
        this.events.subscribe('OFFLINE', () => {
            if (TrackPage.checkNetworkState) {
                //TODO
                TrackPage.checkNetworkState = false;
            }
        });
    }

    preSubmitted = 0;
    curSubmitted = 0;

    checkPostMaintenanceCache() {
        let that = this;
        if (this.curSubmitted >= this.preSubmitted) {
            if (localStorage["TrackCache"]) {
                (async () => {
                     
                    let tmpStorage = JSON.parse(localStorage["TrackCache"]);
                    if (localStorage["TrackCache1"]) {
                        this.photoplib1 = JSON.parse(localStorage["TrackCache1"]);
                    }
                    if (localStorage["TrackCache2"]) {
                        this.photoplib2 = JSON.parse(localStorage["TrackCache2"]);
                    }
                    if (localStorage["TrackCache3"]) {
                        this.photoplib3 = JSON.parse(localStorage["TrackCache3"]);
                    }
                    if (localStorage["TrackCache4"]) {
                        this.photoplib4 = JSON.parse(localStorage["TrackCache4"]);
                    }
                    if (localStorage["TrackCache5"]) {
                        this.photoplib5 = JSON.parse(localStorage["TrackCache5"]);
                    }
                    this.j = 0;
                    this.preSubmitted = tmpStorage.length;
                    let tmpDeviceList = [];
                    this.indexList = [];
                    let resolved = 0, rejected = 0;
                    this.curTmpSotrage = tmpStorage;
                     
                    for (let j = 0; j < tmpStorage.length; ++j) {
                        let element = tmpStorage[j];
                        that.curFail = false;
                        if (element.hasPic == true) {
                            for (let i = 1; i <= element.photoSum; ++i) {
                                that.i = i;
                                await this.postTrack(tmpStorage[j], this.httpClient, this.base, tmpStorage, j, i).then(
                                    res => {
                                         
                                         
                                        resolved++;
                                    }, msg => {
                                         
                                         
                                         
                                        if (!that.curFail) {
                                            tmpDeviceList.push(tmpStorage[j]);
                                        }
                                        that.curFail = true;
                                        rejected++;
                                    }
                                ).catch((error) => {
                                     
                                })
                            }
                        } else {
                            await this.postTrackPlus(tmpStorage[j], this.httpClient, this.base, tmpStorage, j).then(
                                res => {
                                     
                                     
                                    resolved++;
                                }, msg => {
                                     
                                     
                                    tmpDeviceList.push(tmpStorage[j]);
                                    rejected++;
                                }
                            ).catch((error) => {
                                 
                            })
                        }
                        this.curSubmitted = resolved + rejected;
                    }
                    this.preSubmitted = resolved + rejected;
                    for (let j = 0; j < tmpDeviceList.length; ++j) {
                        this.indexList.push(tmpDeviceList[j]);
                         
                    }
                     
                     
                    if (this.indexList.length <= 0) {
                         
                        localStorage.removeItem('TrackCache');
                        this.preSubmitted = 0;
                        this.curSubmitted = 0;
                    } else {
                        localStorage.setItem('TrackCache', JSON.stringify(this.indexList));
                    }
                })();
            }
        }
    }

    NavToMap() {
        this.navCtrl.push(AboutPage2, {
            project: '6'
        });
    }

    testCache() {
         
        let maintenanceCache: any;
        for (let i = 0; i < 100; i++) {
            const cacheExp = {
                longtitudeData: ",119.23107,119.23107,119.23107,119.23107,119.23107,119.23107,119.231039,119.231039,119.231039,119.231039,119.231039,119.231039,119.231039,119.231039,119.231039,119.231039,119.231039,119.231039,119.231039",
                latitudeData: ",26.083094,26.083094,26.083094,26.083094,26.083094,26.083094,26.083105,26.083105,26.083105,26.083105,26.083105,26.083105,26.083105,26.083105,26.083105,26.083105,26.083105,26.083105,26.083105",
                altitudeData: ",-10000,-10000,-10000,-10000,-10000,-10000,-10000,-10000,-10000,-10000,-10000,-10000,-10000,-10000,-10000,-10000,-10000,-10000,-10000",
                accuracyData: "22",
                lineName: "😞",
                workContent: "1",
                lateIntravl: "2",
                remarks: "SB" + (i + 1).toString(),
                recordTime: ""
            };
            maintenanceCache = localStorage.getItem('TrackCache');
            if (maintenanceCache == null) {
                maintenanceCache = [];
            } else {
                maintenanceCache = JSON.parse(maintenanceCache);
            }
            maintenanceCache.push(cacheExp);
            localStorage.setItem('TrackCache', JSON.stringify(maintenanceCache));
        }
    }

    postTrack(element, httpClient, base, tmpStorage, j, i) {
        var that = this;
         
         
        let options: FileUploadOptions = {};
        options.fileKey = "image";
        var time = Date.parse(Date());
        options.fileName = time + ".jpg";
        options.mimeType = "image/jpeg";
        options.chunkedMode = false;
        options.httpMethod = "POST";
        options.params = {
            longtitudeData: element.longtitudeData,
            latitudeData: element.latitudeData,
            altitudeData: element.altitudeData,
            accuracyData: element.accuracyData,
            lineName: element.lineName,
            workContent: element.workContent,
            lateIntravl: element.lateIntravl.toString(),
            remarks: element.remarks,
            current: i,
            recordTime: element.recordTime,
            allLength: tmpStorage.length,
            curRow: j
        };
        options.headers = {token: localStorage['token']};
         
         
        //创建文件对象
        const fileTransfer: FileTransferObject = this.fileTransfer.create();
        var uploadAddress;
        this.j = j;
        this.i = i;
        if (this.i == 1) {
            uploadAddress = element.pic1;     //改了这里
        } else if (i == 2) {
            uploadAddress = element.pic2;
        } else if (i == 3) {
            uploadAddress = element.pic3;
        } else if (i == 4) {
            uploadAddress = element.pic4;
        } else if (i == 5) {
            uploadAddress = element.pic5;
        }
         
        that.picNotExist = false;

        this.curTmpSotrage = tmpStorage;
        this.curOptions = options.params;
        return new Promise((resolve, reject) => {
            fileTransfer.upload(uploadAddress, that.base.BASE_URL + 'app/AddPhoto2', options)
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
                         
                        await that.httpClient.post(that.base.BASE_URL + 'app/AddPhoto2', {},
                            {
                                headers: {token: localStorage['token']}, params: {
                                    longtitudeData: that.curOptions.longtitudeData,
                                    latitudeData: that.curOptions.latitudeData,
                                    altitudeData: that.curOptions.altitudeData.toString(),
                                    accuracyData: that.curOptions.accuracyData,
                                    lineName: that.curOptions.lineName,
                                    workContent: that.curOptions.workContent,
                                    lateIntravl: that.curOptions.lateIntravl.toString(),
                                    remarks: that.curOptions.remarks,
                                    current: "1",
                                    recordTime: that.curOptions.recordTime.toString()
                                }
                            }).toPromise().then(res => {
                             
                             
                             

                            if (that.j >= that.curTmpSotrage.length - 1) {
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
    }

    postTrackPlus(element, httpClient, base, tmpStorage, j) {
        var that = this;
        return new Promise((resolve, reject) => {
            httpClient.post(that.base.BASE_URL + 'app/AddPhoto2', {},
                {
                    headers: {token: localStorage['token']}, params: {
                        longtitudeData: element.longtitudeData,
                        latitudeData: element.latitudeData,
                        altitudeData: element.altitudeData,
                        accuracyData: element.accuracyData,
                        lineName: element.lineName,
                        workContent: element.workContent,
                        lateIntravl: element.lateIntravl.toString(),
                        remarks: element.remarks,
                        current: "1",
                        recordTime: element.recordTime.toString()
                    }
                }).toPromise().then(res => {
                 
                 
                if (that.j >= that.curTmpSotrage.length - 1) {
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

    async ionViewDidLoad() {
        // localStorage.removeItem('TrackCache');
        // localStorage.removeItem('TrackCache1');
        // localStorage.removeItem('TrackCache2');
        // localStorage.removeItem('TrackCache3');
        // localStorage.removeItem('TrackCache4');
        // localStorage.removeItem('TrackCache5');
        var that = this;
        this.fivePhotos = false;
        this.canSubmit = true;

         
         
         
         
         
         

        /*if (localStorage["TrackCache"]) {
            const alert = this.alertCtrl.create({
                title: "有缓存数据，是否提交?",
                subTitle: "提示：4G以下网络环境提交时间可能会延长，建议Wi-Fi状况良好或者4G网络环境下提交。",
                buttons: [
                    {
                        text: '确认', handler: async () => {
                             
                            var tmpStorage = JSON.parse(localStorage["TrackCache"]);
                            if (localStorage["TrackCache1"]) {
                                this.photoplib1 = JSON.parse(localStorage["TrackCache1"]);
                            }
                            if (localStorage["TrackCache2"]) {
                                this.photoplib2 = JSON.parse(localStorage["TrackCache2"]);
                            }
                            if (localStorage["TrackCache3"]) {
                                this.photoplib3 = JSON.parse(localStorage["TrackCache3"]);
                            }
                            if (localStorage["TrackCache4"]) {
                                this.photoplib4 = JSON.parse(localStorage["TrackCache4"]);
                            }
                            if (localStorage["TrackCache5"]) {
                                this.photoplib5 = JSON.parse(localStorage["TrackCache5"]);
                            }
                            this.j = 0;

                            let tmpDeviceList = [];
                            this.curTmpSotrage = tmpStorage;
                             
                            const loader = this.loadingCtrl.create({
                                content: "缓存数据正在提交，请勿退出",
                            });
                            loader.present();
                            for (var j = 0; j < tmpStorage.length; ++j) {
                                var element = tmpStorage[j];
                                that.curFail = false;
                                if (element.hasPic == true) {
                                    for (var i = 1; i <= element.photoSum; ++i) {
                                        that.i = i;
                                        await this.postTrack(tmpStorage[j], this.httpClient, this.base, tmpStorage, j, i).then(
                                            res => {
                                                 
                                                 
                                            }, msg => {
                                                 
                                                 
                                                 
                                                if (!that.curFail) {
                                                    tmpDeviceList.push(tmpStorage[j]);
                                                }
                                                that.curFail = true;
                                            }
                                        ).catch((error) => {
                                             
                                        })
                                    }
                                } else {
                                    await this.postTrackPlus(tmpStorage[j], this.httpClient, this.base, tmpStorage, j).then(
                                        res => {
                                             
                                             
                                        }, msg => {
                                             
                                             
                                            tmpDeviceList.push(tmpStorage[j]);
                                        }
                                    ).catch((error) => {
                                         
                                    })
                                }
                            }
                            for (let j = 0; j < tmpDeviceList.length; ++j) {
                                this.indexList.push(tmpDeviceList[j]);
                                 
                            }
                             
                             
                            if (this.indexList.length <= 0) {
                                 
                                localStorage.removeItem('TrackCache');
                            } else {
                                localStorage.setItem('TrackCache', JSON.stringify(this.indexList));
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
    }


    //以下注释掉
    // if (localStorage["TrackCache"]) {
    //     const loader = this.loadingCtrl.create({
    //         content: "缓存数据正在提交，请勿退出",
    //     });
    //     loader.present();
    //     var tmpStorage = JSON.parse(localStorage["TrackCache"]);


    //     // tmpStorage.forEach(element => {
    //         for(var j = 0 ; j < tmpStorage.length ; j++){
    //             await (async (j)=>{
    //             var element = tmpStorage[j];
    //              

    //         if (element.hasPic ==true ) {

    //             for(var i = 1; i <= element.photoSum; i++){
    //                 await (async (i,j)=>{
    //                     if (localStorage["TrackCache1"]) {
    //                         this.photoplib1 = JSON.parse(localStorage["TrackCache1"]);
    //                     }
    //                     if (localStorage["TrackCache2"]) {
    //                         this.photoplib2 = JSON.parse(localStorage["TrackCache2"]);
    //                     }
    //                     if (localStorage["TrackCache3"]) {
    //                         this.photoplib3 = JSON.parse(localStorage["TrackCache3"]);
    //                     }
    //                     if (localStorage["TrackCache4"]) {
    //                         this.photoplib4 = JSON.parse(localStorage["TrackCache4"]);
    //                     }
    //                     if (localStorage["TrackCache5"]) {
    //                         this.photoplib5 = JSON.parse(localStorage["TrackCache5"]);
    //                     }
    //                  
    //                  
    //                  
    //                  

    //                  
    //                      
    //                      
    //                      

    //                 let options: FileUploadOptions = {};
    //                 options.fileKey = "image";
    //                 var time = Date.parse(Date());
    //                 options.fileName = time + ".jpg";
    //                 options.mimeType = "image/jpeg";
    //                 options.chunkedMode = false;
    //                 options.httpMethod = "POST";
    //                 options.params = {
    //                     longtitudeData: element.longtitudeData.toString(), latitudeData: element.latitudeData.toString(), altitudeData: element.altitudeData.toString(),
    //                     accuracyData: element.accuracyData.toString(),lineName: element.lineName, workContent: element.workContent, lateIntravl: element.lateIntravl.toString(), remarks: element.remarks,
    //                     current: i, recordTime: element.recordTime,
    //                     allLength: tmpStorage.length, curRow: j
    //                 };
    //                 options.headers = { token: localStorage['token'] };
    //                  
    //                  
    //                 var uploadAddress;
    //                 if(i==1){
    //                     uploadAddress = element.pic1;     //改了这里
    //                 }else if(i==2){
    //                     uploadAddress = element.pic2;
    //                 }else if(i==3){
    //                     uploadAddress = element.pic3;
    //                 }else if(i==4){
    //                     uploadAddress = element.pic4;
    //                 }else if(i==5){
    //                     uploadAddress = element.pic5;
    //                 }
    //                      
    //                     this.picNotExsit1 = false;
    //                     this.i = i;
    //                     this.j = j;
    //                     this.curtmpStorage = tmpStorage;
    //                     this.currOptions = options.params;
    //                      
    //                      
    //                         //创建文件对象
    //                         const fileTransfer: FileTransferObject = this.fileTransfer.create();
    //                         let observer = await new Promise((resovle,reject)=>{
    //                             fileTransfer.upload(uploadAddress, this.base.BASE_URL + 'app/AddPhoto2', options)
    //                                 .then((res) => {
    //                                      

    //                                      
    //                                     if (JSON.parse(res.response).isComp == true) {
    //                                         this.isComplete = true;
    //                                     } else {
    //                                         this.isComplete = false;
    //                                     }
    //                                      

    //                                     resovle('ok');
    //                                     // this.base.logger(JSON.stringify(res), "Img_maintenance_submit_function_fileTransferRes.txt");

    //                                     // this.base.showAlert('提示', '提交成功', () => { });
    //                                     // Base.popTo(this.navCtrl, 'switchProjectPage');
    //                                 },async (msg)=>{
    //                                          
    //                                          
    //                                         that.picNotExsit1 = true;
    //                                         if (this.i <= 1) {
    //                                              
    //                                                 await this.httpClient.post(this.base.BASE_URL + 'app/AddPhoto2', {},
    //                                                     {
    //                                                         headers: { token: localStorage['token'] }, params: {
    //                                                             longtitudeData: that.currOptions.longtitudeData.toString(), latitudeData: that.currOptions.latitudeData.toString(), altitudeData: that.currOptions.altitudeData.toString(),
    //                                                             accuracyData: that.currOptions.accuracyData.toString(), lineName: that.currOptions.lineName, workContent: that.currOptions.workContent, lateIntravl: that.currOptions.lateIntravl.toString(), remarks: that.currOptions.remarks,
    //                                                             current: "1", recordTime: that.currOptions.recordTime.toString()
    //                                                         }
    //                                                     })
    //                                                     .toPromise().then(res => {
    //                                                          
    //                                                          
    //                                                          
    //                                                         if (that.j >= that.curtmpStorage.length-1)
    //                                                             that.isComplete = true;
    //                                                         that.subProcessFin = true;
    //                                                         resovle('ok');
    //                                                     }, (msg) => {
    //                                                          
    //                                                          
    //                                                         that.subProcessFin = false;
    //                                                         reject('error');
    //                                                     });
    //                                                     if(that.subProcessFin == true){
    //                                                         resovle('ok');
    //                                                     }else{
    //                                                         reject('error');
    //                                                     }
    //                                         }
    //                                         reject('error');
    //                                 })
    //                         }).catch((err)=>{
    //                              
    //                         })

    //                     // if (!that.picNotExsit1)
    //                             this.observers.push(observer);
    //                          
    //                          
    //                          
    //                          
    //                          

    //                     if (that.picNotExsit1 && i <= 1 ){

    //                 }

    //                 })(i,j)
    //             }
    //             // this.base.logger(JSON.stringify(options), "Img_maintenance_submit_function_fileTransferPar.txt");
    //         } else {
    //              
    //             let obs = await new Promise((resolve,reject)=>{
    //                 this.httpClient.post(this.base.BASE_URL + 'app/AddPhoto2', {},
    //                     {
    //                         headers: { token: localStorage['token'] }, params: {
    //                             longtitudeData: element.longtitudeData.toString(), latitudeData: element.latitudeData.toString(), altitudeData: element.altitudeData.toString(),
    //                             accuracyData: element.accuracyData.toString(), lineName: element.lineName, workContent: element.workContent, lateIntravl: element.lateIntravl.toString(), remarks: element.remarks,
    //                             current: "1", recordTime: element.recordTime.toString()
    //                         }
    //                     })
    //                     .subscribe(res => {
    //                          
    //                          
    //                         resolve('ok');
    //                         // this.base.showAlert('提示', '提交成功', () => { });
    //                     }, (msg) => {
    //                          

    //                         reject('error');
    //                         // this.base.showAlert('提示', '提交失败', () => { });
    //                     });
    //             }).catch((err)=>{
    //                  
    //             })
    //             this.observers.push(obs);

    //         }
    //     // });

    //         })(j)
    //     }
    //     Promise.all(this.observers).then((resolve) => {
    //          
    //          
    //         loader.dismiss();
    //          

    //         if (this.isComplete) {
    //              
    //             localStorage.removeItem('TrackCache');
    //             localStorage.removeItem('TrackCache1');
    //             localStorage.removeItem('TrackCache2');
    //             localStorage.removeItem('TrackCache3');
    //             localStorage.removeItem('TrackCache4');
    //             localStorage.removeItem('TrackCache5');
    //         }
    //     }, (reject) => {
    //          
    //         loader.dismiss();
    //     }).catch((reason) => {
    //          
    //         loader.dismiss();
    //     })
    // }
    // }
    deviceBind() {
        //这里还没有实现，先弹框

    }

    trapClick() {
         
    }

    async submit() {
        const loader = this.loadingCtrl.create({
            content: "缓存数据正在提交，请勿退出",
        });
        //this.canSubmit = true;
        if (this.isStopRecord == false || this.endRecordIsClick == false || this.startRecordIsClick == false) {
            this.base.showAlert("提示", "你还没有完成一个录制循环!", () => {
            });
            this.canSubmit = false;
        } else {
            // this.have_submit = true;
            this.canSubmit = true;

             
             
            var myImage: string = this.imageData;

            // if (!this.lineName){
            //     this.lineName = "0";
            // }
            // if (!this.workContent){
            //     this.workContent = "0";
            // }
            // if (!this.lateIntravl){
            //     this.lateIntravl = "10";
            // }

            if (!this.altitude || !this.longtitude || !this.latitude || !this.accuracy || !this.lineName || !this.workContent || !this.lateIntravl) {
                this.base.showAlert("提示", "定位信息不准确！", () => { });
                this.canSubmit = false;
            } else {

                // var options: string = "deviceId: " + this.id +
                //     "longitude:" + this.longitude + "latitude:" + this.latitude + "num:" + this.num +
                //     "maleNum:" + this.maleNum + "femaleNum:" + this.femaleNum + "altitude:" + this.altitude +
                //     "drug:" + this.drug + "remark:" + this.remark + "workingContent:" + this.workingContent + "otherNum:" + this.otherNum + "otherType:" + this.otherType;


                // this.base.logger(options, "NonImg_maintenance_submit_function_fileTransferPar.txt");
                // var options: FileUploadOptions = {};
                // options.params = {
                //     longtitudeData: this.longtitudeData.toString(), latitudeData: this.latitudeData.toString(), altitudeData: this.altitudeData.toString(),
                //     accuracyData: this.accuracyData.toString(), lineName: this.lineName, workContent: this.workContent, lateIntravl: this.lateIntravl.toString(), remarks: this.remarks,
                //     current: "1", recordTime: JSON.stringify(this.recordTime), myDate: new Date()
                // };
                // this.base.logger(JSON.stringify(options), "newTrackPar.txt");
                //if (!this.altitude || !this.longtitude || !this.latitude || !this.accuracy || !this.lineName || !this.workContent || !this.lateIntravl) {
                    // this.base.showAlert("提示", "定位信息不准或者是数据没有填完整", () => { });
                    // this.canSubmit = false;
                    // return;
                //}
                 
                if (this.photosum <= 0) {
                    let observer = await new Promise((resolve, reject) => {
                        this.httpClient.post(this.base.BASE_URL + 'app/AddPhoto2', {},
                            {
                                headers: {token: localStorage['token']}, params: {
                                    longtitudeData: this.longtitudeData,
                                    latitudeData: this.latitudeData,
                                    altitudeData: this.altitudeData,
                                    accuracyData: this.accuracyData,
                                    lineName: this.lineName,
                                    workContent: this.workContent,
                                    lateIntravl: this.lateIntravl,
                                    remarks: this.remarks,
                                    current: "0",
                                    recordTime: JSON.stringify(this.recordTime),
                                    allLength: "1",
                                    curRow: "1",
                                    hasPic: "true"
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
                        await (async (j) => {
                            let options: FileUploadOptions = {};
                            options.fileKey = "image";
                            var time = Date.parse(Date());
                            options.fileName = time + ".jpg";
                            options.mimeType = "image/jpeg";
                            options.chunkedMode = false;
                            options.httpMethod = "POST";
                            options.params = {
                                longtitudeData: this.longtitudeData.toString(),
                                latitudeData: this.latitudeData.toString(),
                                altitudeData: this.altitudeData.toString(),
                                accuracyData: this.accuracyData.toString(),
                                lineName: this.lineName,
                                workContent: this.workContent,
                                lateIntravl: this.lateIntravl.toString(),
                                remarks: this.remarks,
                                current: j,
                                recordTime: JSON.stringify(this.recordTime),
                                allLength: "1",
                                curRow: "1",
                                hasPic: "true"
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
                            } else if (j == 4) {
                                uploadAddress = this.cachePhoto4;

                            } else if (j == 5) {
                                uploadAddress = this.cachePhoto5;

                            }

                            let observer = await new Promise((resolve, reject) => {
                                fileTransfer.upload(uploadAddress, this.base.BASE_URL + 'app/AddPhoto2', options)
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
                    // this.base.showAlert(resolve[0],"",()=>{});
                    // this.base.showAlert(typeof (resolve[0]), "", () => { });
                     
                     

                    for (var i = 0; i < resolve.length; i++) {
                         
                         
                        if (resolve[i] == undefined || resolve[i] == "") {
                            this.submitFail = true;
                        }
                    }
                    if (this.submitFail) {
                        let cacheData = {
                            longtitudeData: this.longtitudeData.toString(),
                            latitudeData: this.latitudeData.toString(),
                            altitudeData: this.altitudeData.toString(),
                            accuracyData: this.accuracyData.toString(),
                            lineName: this.lineName,
                            workContent: this.workContent,
                            lateIntravl: this.lateIntravl.toString(),
                            remarks: this.remarks,
                            photoSum: this.photosum,
                            recordTime: JSON.stringify(this.recordTime),
                            pic1: this.cachePhoto1,
                            pic2: this.cachePhoto2,
                            pic3: this.cachePhoto3,
                            pic4: this.cachePhoto4,
                            pic5: this.cachePhoto5,
                            allLength: 1,
                            curRow: 1,
                            hasPic: this.hasPic
                        };
                        //  
                        //  

                        let TrackCache: any;
                        TrackCache = localStorage.getItem('TrackCache');
                        if (TrackCache == null) {
                            TrackCache = [];
                        } else {
                            TrackCache = JSON.parse(TrackCache);
                        }
                        TrackCache.push(cacheData);
                        localStorage.setItem('TrackCache', JSON.stringify(TrackCache));
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
                        longtitudeData: this.longtitudeData.toString(),
                        latitudeData: this.latitudeData.toString(),
                        altitudeData: this.altitudeData.toString(),
                        accuracyData: this.accuracyData.toString(),
                        lineName: this.lineName,
                        workContent: this.workContent,
                        lateIntravl: this.lateIntravl.toString(),
                        remarks: this.remarks,
                        photoSum: this.photosum,
                        recordTime: JSON.stringify(this.recordTime),
                        pic1: this.cachePhoto1,
                        pic2: this.cachePhoto2,
                        pic3: this.cachePhoto3,
                        pic4: this.cachePhoto4,
                        pic5: this.cachePhoto5,
                        allLength: 1,
                        curRow: 1,
                        hasPic: this.hasPic
                    };
                    //  
                    //  

                    let TrackCache: any;
                    TrackCache = localStorage.getItem('TrackCache');
                    if (TrackCache == null) {
                        TrackCache = [];
                    } else {
                        TrackCache = JSON.parse(TrackCache);
                    }
                    TrackCache.push(cacheData);
                    localStorage.setItem('TrackCache', JSON.stringify(TrackCache));
                    Base.popTo(this.navCtrl, 'switchProjectPage');
                    loader.dismiss();
                })


                // this.httpClient.post(this.base.BASE_URL + 'app/AddTrack', {},
                //     {
                //         headers: { token: localStorage['token'] }, params: {
                //             longtitudeData: this.longtitudeData.toString(), latitudeData: this.latitudeData.toString(), altitudeData: this.altitudeData.toString(),
                //             accuracyData: this.accuracyData.toString(), lineName: this.lineName, workContent: this.workContent, lateIntravl: this.lateIntravl.toString(), remarks: this.remarks,
                //             current: "1", recordTime: JSON.stringify(this.recordTime)
                //         }
                //     })
                // .subscribe(res => {
                //      
                //      
                //     // this.base.logger(JSON.stringify(res), "NonImg_maintenance_submit_function_fileTransferRes.txt");
                //     this.base.showAlert('提示', '提交成功', () => { });
                //     if (this.hasPic == true) {
                //         let cacheData = {
                //             longtitudeData: this.longtitudeData.toString(), latitudeData: this.latitudeData.toString(), altitudeData: this.altitudeData.toString(),
                //             accuracyData: this.accuracyData.toString(), lineName: this.lineName, workContent: this.workContent, lateIntravl: this.lateIntravl.toString(), remarks: this.remarks,
                //             current: "1", recordTime: JSON.stringify(this.recordTime), hasPic: true, photoSum: this.photosum
                //         };
                //     } else {
                //         let cacheData = {
                //             longtitudeData: this.longtitudeData.toString(), latitudeData: this.latitudeData.toString(), altitudeData: this.altitudeData.toString(),
                //             lineName: this.lineName, workContent: this.workContent, lateIntravl: this.lateIntravl.toString(), remarks: this.remarks,
                //             current: "1", recordTime: JSON.stringify(this.recordTime), hasPic: false, photoSum: 0
                //         };
                //     }

                //      
                //     //这一行
                //     Base.popTo(this.navCtrl, 'switchProjectPage');
                // }, (msg) => {

                //     // this.base.logger(JSON.stringify(msg), "NonImg_maintenance_submit_function_fileTransferError.txt");

                //     this.base.showAlert('提示', '提交失败', () => { });
                //     if (this.hasPic == true) {
                //         let cacheData = {
                //             longtitudeData: this.longtitudeData.toString(), latitudeData: this.latitudeData.toString(), altitudeData: this.altitudeData.toString(),
                //             accuracyData: this.accuracyData.toString(), lineName: this.lineName, workContent: this.workContent, lateIntravl: this.lateIntravl.toString(), remarks: this.remarks,
                //             current: "1", recordTime: JSON.stringify(this.recordTime), hasPic: true, photoSum: this.photosum, pic1: this.cachePhoto1, pic2: this.cachePhoto2, pic3: this.cachePhoto3,
                //             pic4: this.cachePhoto4, pic5: this.cachePhoto5
                //         };
                //         let TrackCache: any;
                //         TrackCache = localStorage.getItem('TrackCache');
                //         if (TrackCache == null) {
                //             TrackCache = [];
                //         } else {
                //             TrackCache = JSON.parse(TrackCache);
                //         }
                //         TrackCache.push(cacheData);
                //         localStorage.setItem('TrackCache', JSON.stringify(TrackCache));
                //          
                //         //还有这一行
                //         Base.popTo(this.navCtrl, 'switchProjectPage');
                //     } else {
                //         let cacheData = {
                //             longtitudeData: this.longtitudeData.toString(), latitudeData: this.latitudeData.toString(), altitudeData: this.altitudeData.toString(),
                //             accuracyData: this.accuracyData.toString(), lineName: this.lineName, workContent: this.workContent, lateIntravl: this.lateIntravl.toString(), remarks: this.remarks,
                //             current: "1", recordTime: JSON.stringify(this.recordTime), hasPic: false, photoSum: 0
                //         };
                //         let TrackCache: any;
                //         TrackCache = localStorage.getItem('TrackCache');
                //         if (TrackCache == null) {
                //             TrackCache = [];
                //         } else {
                //             TrackCache = JSON.parse(TrackCache);
                //         }
                //         TrackCache.push(cacheData);
                //         localStorage.setItem('TrackCache', JSON.stringify(TrackCache));
                //          
                //         //还有这一行
                //         Base.popTo(this.navCtrl, 'switchProjectPage');
                //     }
                // });
            }
        }
    }

    takePhoto() {
        if (this.startRecordIsClick == false) {
            this.base.showAlert("提示", "请先输入线路名称、工作内容、延时设置，并点击开始录制", () => {
            });
        } else {
            //this.photosum += 1;
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

            //this.base.showAlert(this.photosum, "", () => { });

            this.camera.getPicture(options).then((imageData) => {
                // this.submit(imageData)
                // this.navCtrl.popToRoot()
                this.photosum = this.photosum + 1;
                this.imageData = imageData;
                if (this.photosum == 5) {
                    this.fivePhotos = true;
                    this.canSubmit = false;
                }

                // let options: FileUploadOptions = {};
                // options.fileKey = "image";
                // var time = Date.parse(Date());
                // options.fileName = time + ".jpg";
                // options.mimeType = "image/jpeg";
                // options.chunkedMode = false;
                // options.httpMethod = "POST";
                // options.params = {
                //     lineName: this.lineName,
                //     current: this.photosum
                // };
                // options.headers = { token: localStorage['token'] };
                //  
                //  

                //  
                //  

                //  
                //  
                //  


                //创建文件对象
                // const fileTransfer: FileTransferObject = this.fileTransfer.create();

                // fileTransfer.upload(this.imageData, this.base.BASE_URL + 'app/AddPhoto', options)
                //     .then((res) => {
                //          
                //          
                //          
                // this.base.logger(JSON.stringify(res), "Img_maintenance_submit_function_fileTransferRes.txt");

                // this.base.showAlert('提示', '提交成功', () => { });
                // Base.popTo(this.navCtrl, 'switchProjectPage');
                // }, (error) => {//发送失败(网络出错等)
                //     this.base.showAlert('提示', '提交失败', () => { });
                // this.base.logger(JSON.stringify(error), "Img_maintenance_submit_function_fileTransferError.txt");
                if (this.photosum == 1) {
                    this.cachePhoto1 = this.imageData;
                } else if (this.photosum == 2) {
                    this.cachePhoto2 = this.imageData;
                } else if (this.photosum == 3) {
                    this.cachePhoto3 = this.imageData;
                } else if (this.photosum == 4) {
                    this.cachePhoto4 = this.imageData;
                } else if (this.photosum == 5) {
                    this.cachePhoto5 = this.imageData;
                }

                // let cacheData = {
                //     lineName: this.lineName,
                //     current: this.current,
                //     img: this.imageData,
                // };
                // let TrackCache: any;

                // TrackCache = localStorage.getItem('TrackCache' + this.current);
                // if (TrackCache == null) {
                //     TrackCache = [];
                // } else {
                //     TrackCache = JSON.parse(TrackCache);
                // }
                // TrackCache.push(cacheData);

                //localStorage安全保存数据
                // try{
                //   localStorage.setItem('TrackCache', JSON.stringify(TrackCache));
                // }catch(oException){
                //     if(oException.name == 'QuotaExceededError'){
                //         this.base.showAlert('提示', '无法提交，缓存容量不足，请及时处理', ()=>{});
                //         // 
                //             // 可进行超出限定大小之后的操作，如下面可以先清除记录，再次保存
                //       // localStorage.clear();
                //       // localStorage.setItem(key,value);
                //     }
                // }

                // localStorage.setItem('TrackCache' + this.photosum.toString(), JSON.stringify(TrackCache));

                //this.navCtrl.pop();
                // confirm.dismiss()
                // Base.popTo(this.navCtrl, 'switchProjectPage');
                // })
                // .catch((error) => {//发送失败(文件不存在等)

                // });

            }, (err) => {
                // Handle error
                // this.navCtrl.popToRoot()
            }).catch((error) => {
                console.log(error)
            });
        }


    }

    LateInput() {
        let num1 = 0;
        if (parseInt(this.lateIntravl) < 0 || parseInt(this.lateIntravl) == NaN || '' + parseInt(this.lateIntravl) == 'NaN' || !this.lateIntravl) {
            this.base.showAlert('提示', '请输入数字', () => {
            });
        }
        // if (!this.lateIntravl) {
        //     this.base.showAlert('提示', '请输入数字', () => {
        //     });
        // }
        // num1 = parseInt(this.lateIntravl);
        // this.lateIntravl = '' + num1;
        // if (this.lateIntravl == 'NaN') {
        //     this.base.showAlert('提示', '请输入数字', () => {
        //     });
        // }
    }

    test() {
        localStorage.removeItem('TrackCache');
        localStorage.removeItem('TrackCache1');
        localStorage.removeItem('TrackCache2');
        localStorage.removeItem('TrackCache3');
        localStorage.removeItem('TrackCache4');
        localStorage.removeItem('TrackCache5');
    }

    startRecord() {
         
         
        
        var r = /^([\w\u4E00-\u9FA5_\-.]+)+$/;  //中英文、数字和符号“.”、“-”、“_”、“()”、“（）”
        var flag1=r.test(this.lineName);  //线路名称
        var flag2=r.test(this.workContent);  //工作内容
         
         
        
        if (!this.lateIntravl ||this.lateIntravl == 'NaN' || !this.workContent || !this.lineName ) {
            this.base.showAlert("提示", "请先输入线路名称、工作内容和延时间隔!", () => {
            });
        } else {
                if(!flag1 || !flag2 || Number(this.lateIntravl) < 0 || Number(this.lateIntravl) == 0){
                    this.base.showAlert("提示", "线路名称及工作内容，只可填写汉字、英文、数字和符号“-”、“_”,和“.”。延时设置须填写大于0的数。", () => {
                    });
                }
                else{
                    this.lineNameDis = true;
                    this.startRecordIsClick = true;
                    this.base.showAlert("提示", "正在录制中，请开始施工!", () => {
                    });
                    //此处整合进submit
                    // this.httpClient.post(this.base.BASE_URL + 'app/addLineName', {},
                    //     {
                    //         headers: { token: localStorage['token'] }, params: {
                    //             linename: this.lineName,
                    //         }
                    //     }).subscribe(res => {
                    //          
                    //     })

                    this.recordTime.startTime = new Date(new Date().getTime() + 8 * 60 * 60 * 1000).toISOString().replace(/T/g, ' ').replace(/\.[\d]{3}Z/, '');
                     

                    let options = {
                        enableHighAccuracy: true,
                        timeout: 99999999,
                        maximumAge: 0
                    };
                    let that = this
                    let watch = this.geolocation.watchPosition(options);
                    let longtitudeData: Array<string> = [];
                    let latitudeData: Array<string> = [];
                    let altitudeData: Array<string> = [];
                    let accuracyData: Array<string> = [];

                    this.myIntravl = setInterval(() => {
                        // this.base.showAlert("注意", this.longtitude + "," + this.latitude + "," + this.altitude,()=>{ });
                        // this.location_ready = true;
                        longtitudeData.push(this.longtitude);
                        latitudeData.push(this.latitude);
                        altitudeData.push(this.altitude);
                        accuracyData.push(this.accuracy);
                        this.longtitudeData = longtitudeData;
                        this.latitudeData = latitudeData;
                        this.altitudeData = altitudeData;
                        this.accuracyData = accuracyData;
                         
                    }, Number(this.lateIntravl) * 1000);

                    this.subscription = watch.subscribe((data) => {
                        // data can be a set of coordinates, or an error (if an error occurred).
                        if (data['coords']) {
                            // this.changeDetectorRef.detectChanges();
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
                }
            }
    }

    stopRecord() {
        if (this.startRecordIsClick == false) {
            this.base.showAlert("提示", "你还没有开始录制", () => {
            });
        } else {
            this.base.showAlert("提示", "停止录制成功", () => {
            });
            this.isStopRecord = true;
            this.endRecordIsClick = true;
            clearInterval(this.myIntravl);
            this.recordTime.endTime = new Date(new Date().getTime() + 8 * 60 * 60 * 1000).toISOString().replace(/T/g, ' ').replace(/\.[\d]{3}Z/, '');
             
        }

    }

}
