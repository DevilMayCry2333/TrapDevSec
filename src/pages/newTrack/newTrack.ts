import { Component } from '@angular/core';
import { QRScanner, QRScannerStatus } from '@ionic-native/qr-scanner';
import { NavController } from 'ionic-angular';
import { HttpClient, HttpParams } from "@angular/common/http";
import { ScanPage } from '../scan/scan'
import { Base } from '../../common/base.js'
import { Subscription } from "rxjs/Subscription";
import { Geolocation } from "@ionic-native/geolocation";
import { ChangeDetectorRef } from '@angular/core';
import { Camera, CameraOptions } from "@ionic-native/camera";
import { FileTransfer, FileTransferObject, FileUploadOptions } from "@ionic-native/file-transfer";
import { AboutPage } from '../about/about';
import { Base64 } from '@ionic-native/base64';
import { LoadingController } from 'ionic-angular';


@Component({
    selector: 'app-track',
    templateUrl: 'newTrack.html'
})
export class TrackPage {
    longtitude: string;
    longtitudeData: Array<string>;
    latitudeData: Array<string>;
    altitudeData: Array<string>;
    accuracyData: Array<string>;
    latitude: string;
    location_ready: boolean;
    recordTime: any = {};
    observers = [];
    photosum: number;
    photolib1: any;
    photolib2: any;
    photolib3: any;
    currentImg: any;
    currentNum = 0;
    isComplete = false;
    imageData: any;
    startRecordIsClick = false;
    endRecordIsClick = false;
    photoplib1: any;
    photoplib2: any;
    photoplib3: any;
    photoplib4: any;
    photoplib5: any;

    cachePhoto1:any;
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

    lineNameDis = false;

    ImageToBase: any[];
    picNotExist = false;
    have_submit: boolean;
    altitude: string;
    accuracy: string;
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

    constructor(
        public navCtrl: NavController,
        public qrScanner: QRScanner,
        private base: Base,
        private geolocation: Geolocation,
        private changeDetectorRef: ChangeDetectorRef,
        private httpClient: HttpClient,
        private camera: Camera,
        private fileTransfer: FileTransfer,
        private base64: Base64,
        public loadingCtrl: LoadingController
    ) {
        this.photosum = 0;
    }

    NavToMap() {
        this.navCtrl.push(AboutPage);
    }

    async ionViewDidLoad(){
        // localStorage.removeItem('TrackCache');
        // localStorage.removeItem('TrackCache1');
        // localStorage.removeItem('TrackCache2');
        // localStorage.removeItem('TrackCache3');
        // localStorage.removeItem('TrackCache4');
        // localStorage.removeItem('TrackCache5');
        var that = this;
        this.fivePhotos = false;
        this.canSubmit = true;

        console.log(localStorage["TrackCache"]);
        console.log(localStorage["TrackCache1"]);
        console.log(localStorage["TrackCache2"]);
        console.log(localStorage["TrackCache3"]);
        console.log(localStorage["TrackCache4"]);
        console.log(localStorage["TrackCache5"]);

        if (localStorage["TrackCache"]) {
            const loader = this.loadingCtrl.create({
                content: "缓存数据正在提交，请勿退出",
            });
            loader.present();
            var tmpStorage = JSON.parse(localStorage["TrackCache"]);


            // tmpStorage.forEach(element => {
                for(var j = 0 ; j < tmpStorage.length ; j++){
                    await (async (j)=>{
                    var element = tmpStorage[j];
                    console.log(element);

                if (element.hasPic ==true ) {

                    for(var i = 1; i <= element.photoSum; i++){
                        await (async (i,j)=>{
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
                        console.log("====当前第几条数据====");
                        console.log(j);
                        console.log("=====当前第几张照片====");
                        console.log(i);

                        let options: FileUploadOptions = {};
                        options.fileKey = "image";
                        var time = Date.parse(Date());
                        options.fileName = time + ".jpg";
                        options.mimeType = "image/jpeg";
                        options.chunkedMode = false;
                        options.httpMethod = "POST";
                        options.params = {
                            longtitudeData: element.longtitudeData.toString(), latitudeData: element.latitudeData.toString(), altitudeData: element.altitudeData.toString(),
                            accuracyData: element.accuracyData.toString(),lineName: element.lineName, workContent: element.workContent, lateIntravl: element.lateIntravl.toString(), remarks: element.remarks,
                            current: i, recordTime: element.recordTime,
                            allLength: tmpStorage.length, curRow: j
                        };
                        options.headers = { token: localStorage['token'] };
                        console.log("options");
                        console.log(options);
                        var uploadAddress;
                        if(i==1){
                            uploadAddress = element.pic1;
                        }else if(i==2){
                            uploadAddress = element.pic2;
                        }else if(i==3){
                            uploadAddress = element.pic3;
                        }else if(i==4){
                            uploadAddress = element.pic4;
                        }else if(i==5){
                            uploadAddress = element.pic5;
                        }
                            console.log(uploadAddress);
                        
                                //创建文件对象
                                const fileTransfer: FileTransferObject = this.fileTransfer.create();
                                let observer = await new Promise((resovle,reject)=>{
                                    fileTransfer.upload(uploadAddress, this.base.BASE_URL + 'app/AddPhoto2', options)
                                        .then((res) => {
                                            console.log(res);
                                            if (JSON.parse(res.response).isComp == true) {
                                                this.isComplete = true;
                                            } else {
                                                this.isComplete = false;
                                            }
                                            console.log("传输中isComp" + this.isComplete);

                                            resovle('ok');
                                            // this.base.logger(JSON.stringify(res), "Img_maintenance_submit_function_fileTransferRes.txt");

                                            // this.base.showAlert('提示', '提交成功', () => { });
                                            // Base.popTo(this.navCtrl, 'switchProjectPage');
                                        }, (error) => {//发送失败(网络出错等)
                                            this.picNotExsit1 = true;
                                                console.log(error);
                                            reject('error');
                                            // this.base.showAlert('提示', '提交失败', () => { });
                                            // this.base.logger(JSON.stringify(error), "Img_maintenance_submit_function_fileTransferError.txt");
                                        })
                                        .catch((error) => {//发送失败(文件不存在等)
                                            this.picNotExsit1 = true;
                                            console.log(error);
                                            
                                            reject('error');
                                        });
                                }).catch((err)=>{
                                    console.log(err);
                                })
                                this.observers.push(observer);


                        if(this.picNotExsit1){
                            let obs = await new Promise((resovle,reject)=>{
                                this.httpClient.post(this.base.BASE_URL + 'app/AddTrack2', {},
                                    {
                                        headers: { token: localStorage['token'] }, params: {
                                            longtitudeData: element.longtitudeData.toString(), latitudeData: element.latitudeData.toString(), altitudeData: element.altitudeData.toString(),
                                            accuracyData: element.accuracyData.toString(), lineName: element.lineName, workContent: element.workContent, lateIntravl: element.lateIntravl.toString(), remarks: element.remarks,
                                            current: "1", recordTime: element.recordTime
                                        }
                                    })
                                    .subscribe(res => {
                                        console.log(JSON.stringify(res));
                                        console.log(JSON.parse(JSON.stringify(res)).message);
                                        resovle('ok');
                                    }, (msg) => {
                                        console.log(msg);
                                        
                                        reject('error');
                                    });
                            }).catch((err)=>{
                                console.log(err);
                            })
                            this.observers.push(obs);
                        }

                        })(i,j)
                    }
                    // this.base.logger(JSON.stringify(options), "Img_maintenance_submit_function_fileTransferPar.txt");
                } else {
                    console.log(element);
                    let obs = await new Promise((resolve,reject)=>{
                        this.httpClient.post(this.base.BASE_URL + 'app/AddTrack2', {},
                            {
                                headers: { token: localStorage['token'] }, params: {
                                    longtitudeData: element.longtitudeData.toString(), latitudeData: element.latitudeData.toString(), altitudeData: element.altitudeData.toString(),
                                    accuracyData: element.accuracyData.toString(), lineName: element.lineName, workContent: element.workContent, lateIntravl: element.lateIntravl.toString(), remarks: element.remarks,
                                    current: "1", recordTime: element.recordTime
                                }
                            })
                            .subscribe(res => {
                                console.log(JSON.stringify(res));
                                console.log(JSON.parse(JSON.stringify(res)).message);
                                resolve('ok');
                                // this.base.showAlert('提示', '提交成功', () => { });
                            }, (msg) => {
                                console.log(msg);
                                
                                reject('error');
                                // this.base.showAlert('提示', '提交失败', () => { });
                            });
                    }).catch((err)=>{
                        console.log(err);
                    })
                    this.observers.push(obs);

                }
            // });
        
                })(j)
            }
            Promise.all(this.observers).then((resolve) => {
                console.log(resolve);
                loader.dismiss();
                if (this.isComplete) {
                    console.log("*****清除缓存了******");
                    localStorage.removeItem('TrackCache');
                    localStorage.removeItem('TrackCache1');
                    localStorage.removeItem('TrackCache2');
                    localStorage.removeItem('TrackCache3');
                    localStorage.removeItem('TrackCache4');
                    localStorage.removeItem('TrackCache5');
                }
            }, (reject) => {
                console.log(reject);
                loader.dismiss();
            }).catch((reason) => {
                console.log(reason);
                loader.dismiss();
            })
        }
    }
    deviceBind() {
        //这里还没有实现，先弹框
        this.base.showAlert("成功", "", () => { });
    }
    trapClick() {
        console.log('track');
    }
    submit() {
        if (this.isStopRecord == false || this.endRecordIsClick == false || this.startRecordIsClick == false) {
            this.base.showAlert("你还没有完成一个录制循环!", "你还没有完成一个录制循环", () => { });
        } else {
            this.have_submit = true;
            this.base.showAlert(this.flag, this.flag, () => { });

            console.log("======PATH======");
            console.log(this.imageData);
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
                this.base.showAlert("定位信息不准", "或者是数据没有填完整", () => { });
            } else {

                // var options: string = "deviceId: " + this.id +
                //     "longitude:" + this.longitude + "latitude:" + this.latitude + "num:" + this.num +
                //     "maleNum:" + this.maleNum + "femaleNum:" + this.femaleNum + "altitude:" + this.altitude +
                //     "drug:" + this.drug + "remark:" + this.remark + "workingContent:" + this.workingContent + "otherNum:" + this.otherNum + "otherType:" + this.otherType;


                // this.base.logger(options, "NonImg_maintenance_submit_function_fileTransferPar.txt");
                var options: FileUploadOptions = {};
                options.params = {
                    longtitudeData: this.longtitudeData.toString(), latitudeData: this.latitudeData.toString(), altitudeData: this.altitudeData.toString(),
                    accuracyData: this.accuracyData.toString(), lineName: this.lineName, workContent: this.workContent, lateIntravl: this.lateIntravl.toString(), remarks: this.remarks,
                    current: "1", recordTime: JSON.stringify(this.recordTime), myDate: new Date()
                };
                this.base.logger(JSON.stringify(options), "newTrackPar.txt");
                if (!this.altitude || !this.longtitude || !this.latitude || !this.accuracy || !this.lineName || !this.workContent || !this.lateIntravl) {
                    this.base.showAlert("定位信息不准", "或者是数据没有填完整", () => { });
                    return;
                }
                this.httpClient.post(this.base.BASE_URL + 'app/AddTrack', {},
                    {
                        headers: { token: localStorage['token'] }, params: {
                            longtitudeData: this.longtitudeData.toString(), latitudeData: this.latitudeData.toString(), altitudeData: this.altitudeData.toString(),
                            accuracyData: this.accuracyData.toString(), lineName: this.lineName, workContent: this.workContent, lateIntravl: this.lateIntravl.toString(), remarks: this.remarks,
                            current: "1", recordTime: JSON.stringify(this.recordTime)
                        }
                    })
                    .subscribe(res => {
                        console.log(JSON.stringify(res));
                        console.log(JSON.parse(JSON.stringify(res)).message);
                        // this.base.logger(JSON.stringify(res), "NonImg_maintenance_submit_function_fileTransferRes.txt");
                        this.base.showAlert('提示', '提交成功', () => { });
                        if (this.hasPic == true) {
                            let cacheData = {
                                longtitudeData: this.longtitudeData.toString(), latitudeData: this.latitudeData.toString(), altitudeData: this.altitudeData.toString(),
                                accuracyData: this.accuracyData.toString(), lineName: this.lineName, workContent: this.workContent, lateIntravl: this.lateIntravl.toString(), remarks: this.remarks,
                                current: "1", recordTime: JSON.stringify(this.recordTime), hasPic: true, photoSum: this.photosum
                            };
                        } else {
                            let cacheData = {
                                longtitudeData: this.longtitudeData.toString(), latitudeData: this.latitudeData.toString(), altitudeData: this.altitudeData.toString(),
                                lineName: this.lineName, workContent: this.workContent, lateIntravl: this.lateIntravl.toString(), remarks: this.remarks,
                                current: "1", recordTime: JSON.stringify(this.recordTime), hasPic: false, photoSum: 0
                            };
                        }

                        console.log("cacheData");

                        Base.popTo(this.navCtrl, 'switchProjectPage');
                    }, (msg) => {

                        // this.base.logger(JSON.stringify(msg), "NonImg_maintenance_submit_function_fileTransferError.txt");

                        this.base.showAlert('提示', '提交失败', () => { });
                        if (this.hasPic == true) {
                            let cacheData = {
                                longtitudeData: this.longtitudeData.toString(), latitudeData: this.latitudeData.toString(), altitudeData: this.altitudeData.toString(),
                                accuracyData: this.accuracyData.toString(), lineName: this.lineName, workContent: this.workContent, lateIntravl: this.lateIntravl.toString(), remarks: this.remarks,
                                current: "1", recordTime: JSON.stringify(this.recordTime), hasPic: true, photoSum: this.photosum, pic1: this.cachePhoto1, pic2: this.cachePhoto2, pic3: this.cachePhoto3,
                                pic4: this.cachePhoto4, pic5: this.cachePhoto5
                            };
                            let TrackCache: any;
                            TrackCache = localStorage.getItem('TrackCache');
                            if (TrackCache == null) {
                                TrackCache = [];
                            } else {
                                TrackCache = JSON.parse(TrackCache);
                            }
                            TrackCache.push(cacheData);
                            localStorage.setItem('TrackCache', JSON.stringify(TrackCache));
                            console.log("Hello");
                            Base.popTo(this.navCtrl, 'switchProjectPage');
                        } else {
                            let cacheData = {
                                longtitudeData: this.longtitudeData.toString(), latitudeData: this.latitudeData.toString(), altitudeData: this.altitudeData.toString(),
                                accuracyData: this.accuracyData.toString(), lineName: this.lineName, workContent: this.workContent, lateIntravl: this.lateIntravl.toString(), remarks: this.remarks,
                                current: "1", recordTime: JSON.stringify(this.recordTime), hasPic: false, photoSum: 0
                            };
                            let TrackCache: any;
                            TrackCache = localStorage.getItem('TrackCache');
                            if (TrackCache == null) {
                                TrackCache = [];
                            } else {
                                TrackCache = JSON.parse(TrackCache);
                            }
                            TrackCache.push(cacheData);
                            localStorage.setItem('TrackCache', JSON.stringify(TrackCache));
                            console.log("Hello");
                            Base.popTo(this.navCtrl, 'switchProjectPage');
                        }
                    });
            }
        }
    }

    takePhoto() {
        if (this.startRecordIsClick == false) {
            this.base.showAlert("请先输入线路名称并点击开始录制!", "请先输入线路名称并点击开始录制", () => { });
        } else {
            this.photosum += 1;
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

            this.base.showAlert(this.photosum, "", () => { });

            this.camera.getPicture(options).then((imageData) => {
                // this.submit(imageData)
                // this.navCtrl.popToRoot()
                this.imageData = imageData;
                if (this.photosum == 5) {
                    this.fivePhotos = true;
                    this.canSubmit = false;
                }

                let options: FileUploadOptions = {};
                options.fileKey = "image";
                var time = Date.parse(Date());
                options.fileName = time + ".jpg";
                options.mimeType = "image/jpeg";
                options.chunkedMode = false;
                options.httpMethod = "POST";
                options.params = {
                    lineName: this.lineName,
                    current: this.photosum
                };
                options.headers = { token: localStorage['token'] };
                console.log("options");
                console.log(options);

                console.log(this.photosum);
                console.log(this.imageData);

                console.log("======imageData====");
                console.log(imageData);
                console.log(this.imageData);





                //创建文件对象
                const fileTransfer: FileTransferObject = this.fileTransfer.create();

                fileTransfer.upload(this.imageData, this.base.BASE_URL + 'app/AddPhoto', options)
                    .then((res) => {
                        console.log(res);
                        console.log(JSON.stringify(res));
                        console.log(JSON.parse(JSON.stringify(res)).message);
                        // this.base.logger(JSON.stringify(res), "Img_maintenance_submit_function_fileTransferRes.txt");

                        this.base.showAlert('提示', '提交成功', () => { });
                        // Base.popTo(this.navCtrl, 'switchProjectPage');
                    }, (error) => {//发送失败(网络出错等)
                        this.base.showAlert('提示', '提交失败', () => { });
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

                        let cacheData = {
                            lineName: this.lineName,
                            current: this.current,
                            img: this.imageData,
                        };
                        let TrackCache: any;

                        TrackCache = localStorage.getItem('TrackCache' + this.current);
                        if (TrackCache == null) {
                            TrackCache = [];
                        } else {
                            TrackCache = JSON.parse(TrackCache);
                        }
                        TrackCache.push(cacheData);
                        //localStorage安全保存数据
                        // try{
                        //   localStorage.setItem('TrackCache', JSON.stringify(TrackCache));
                        // }catch(oException){
                        //     if(oException.name == 'QuotaExceededError'){
                        //         this.base.showAlert('提示', '无法提交，缓存容量不足，请及时处理', ()=>{});
                        //         //console.log('已经超出本地存储限定大小！');
                        //             // 可进行超出限定大小之后的操作，如下面可以先清除记录，再次保存
                        //       // localStorage.clear();
                        //       // localStorage.setItem(key,value);
                        //     }
                        // } 
                        localStorage.setItem('TrackCache' + this.photosum.toString(), JSON.stringify(TrackCache));
                        //this.navCtrl.pop();
                        // confirm.dismiss()
                        // Base.popTo(this.navCtrl, 'switchProjectPage');
                    })
                    .catch((error) => {//发送失败(文件不存在等)

                    });




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
        if (parseInt(this.lateIntravl) < 0 || parseInt(this.lateIntravl) == NaN) {
            this.base.showAlert('提示', '请输入数字', () => { });
        }
        if (!this.lateIntravl) {
            this.base.showAlert('提示', '请输入数字', () => { });
        }
        num1 = parseInt(this.lateIntravl);
        this.lateIntravl = '' + num1;
        if (this.lateIntravl == 'NaN') {
            this.base.showAlert('提示', '请输入数字', () => { });
        }
    }
    test(){
        localStorage.removeItem('TrackCache');
        localStorage.removeItem('TrackCache1');
        localStorage.removeItem('TrackCache2');
        localStorage.removeItem('TrackCache3');
        localStorage.removeItem('TrackCache4');
        localStorage.removeItem('TrackCache5');
    }
    startRecord() {
        if (!this.lateIntravl) {
            this.base.showAlert("请先输入延时间隔!", "请先输入延时间隔!", () => { });
        } else {
            this.lineNameDis = true;
            this.startRecordIsClick = true;
            this.httpClient.post(this.base.BASE_URL + 'app/addLineName', {},
                {
                    headers: { token: localStorage['token'] }, params: {
                        linename: this.lineName,
                    }
                }).subscribe(res => {
                    console.log(res);

                })

            this.recordTime.startTime = new Date(new Date().getTime() + 8 * 60 * 60 * 1000).toISOString().replace(/T/g, ' ').replace(/\.[\d]{3}Z/, '');
            console.log(this.recordTime.startTime);

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
                console.log(this.longtitude + "," + this.latitude + "," + this.altitude);
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
    stopRecord() {
        if (this.startRecordIsClick == false) {
            this.base.showAlert("你还没有开始录制!", "你还没有开始录制", () => { });
        } else {
            this.base.showAlert("停止录制成功!", "停止录制成功", () => { });
            this.isStopRecord = true;
            this.endRecordIsClick = true;
            clearInterval(this.myIntravl);
            this.recordTime.endTime = new Date(new Date().getTime() + 8 * 60 * 60 * 1000).toISOString().replace(/T/g, ' ').replace(/\.[\d]{3}Z/, '');
            console.log(this.recordTime.endTime);
        }

    }

}