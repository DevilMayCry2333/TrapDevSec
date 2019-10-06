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
@Component({
    selector: 'app-home',
    templateUrl: 'newTrack.html'
})
export class TrackPage {
    longtitude: string;
    longtitudeData:Array<string>;
    latitudeData:Array<string>;
    altitudeData:Array<string>;
    accuracyData: Array<string>;
    latitude: string;
    location_ready:boolean;
    recordTime: any = {};
    photosum:number;
    imageData:null;
    have_submit:boolean;
    altitude: string;
    accuracy: string;
    myIntravl:any;
    subscription:Subscription;
    lineName:string;
    workContent:string;
    lateIntravl:number;
    remarks:"1"
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
        private fileTransfer: FileTransfer
        ) {
            this.photosum = 0;
        }

    NavToMap() {
        this.navCtrl.push(AboutPage);
    }

    ionViewDidLoad(){
        if (localStorage["TrackCache"]) {
            var tmpStorage = JSON.parse(localStorage["TrackCache"]);
            tmpStorage.forEach(element => {
                console.log(element);
                if (element.img != null) {
                    let options: FileUploadOptions = {};
                    options.fileKey = "image";
                    var time = Date.parse(Date());
                    options.fileName = time + ".jpg";
                    options.mimeType = "image/jpeg";
                    options.chunkedMode = false;
                    options.httpMethod = "POST";
                    options.params = {
                        longtitudeData: element.longtitudeData.toString(), latitudeData: element.latitudeData.toString(), altitudeData: element.altitudeData.toString(),
                        lineName: element.lineName, workContent: element.workContent, lateIntravl: element.lateIntravl.toString(), remarks: element.remarks,
                        current: "1", recordTime: JSON.stringify(element.recordTime)
                    };
                    options.headers = { token: localStorage['token'] };
                    console.log("options");
                    console.log(options);


                    //创建文件对象
                    const fileTransfer: FileTransferObject = this.fileTransfer.create();


                    // this.base.logger(JSON.stringify(options), "Img_maintenance_submit_function_fileTransferPar.txt");

                    fileTransfer.upload(element.img, this.base.BASE_URL + 'app/AddTrack', options)
                        .then((res) => {
                            console.log(res);
                            console.log(JSON.stringify(res));
                            console.log(JSON.parse(JSON.stringify(res)).message);

                            // this.base.logger(JSON.stringify(res), "Img_maintenance_submit_function_fileTransferRes.txt");

                            this.base.showAlert('提示', '提交成功', () => { });
                            localStorage.removeItem('TrackCache');
                        }, (error) => {//发送失败(网络出错等)
                            this.base.showAlert('提示', '提交失败', () => { });
                        })
                } else {
                    console.log(element);
                    this.httpClient.post(this.base.BASE_URL + 'app/AddTrack', {},
                        {
                            headers: { token: localStorage['token'] }, params: {
                                longtitudeData: element.longtitudeData.toString(), latitudeData: element.latitudeData.toString(), altitudeData: element.altitudeData.toString(),
                                lineName: element.lineName, workContent: element.workContent, lateIntravl: element.lateIntravl.toString(), remarks: element.remarks,
                                current: "1", recordTime:JSON.stringify(element.recordTime)
                            }
                        })
                        .subscribe(res => {
                            console.log(JSON.stringify(res));
                            console.log(JSON.parse(JSON.stringify(res)).message);
                            this.base.showAlert('提示', '提交成功', () => { });
                            localStorage.removeItem('TrackCache');
                        }, (msg) => {
                            this.base.showAlert('提示', '提交失败', () => { });
                        });
                }
            });
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
        this.have_submit = true;
        console.log(this.longtitudeData.toString());
        console.log(this.imageData);
        if (this.imageData != null) {
            let options: FileUploadOptions = {};
            options.fileKey = "image";
            var time = Date.parse(Date());
            options.fileName = time + ".jpg";
            options.mimeType = "image/jpeg";
            options.chunkedMode = false;
            options.httpMethod = "POST";
            options.params = {
                longtitudeData: this.longtitudeData.toString(), latitudeData: this.latitudeData.toString(), altitudeData: this.altitudeData.toString(),
                lineName: this.lineName, workContent: this.workContent, lateIntravl: this.lateIntravl.toString(), remarks: this.remarks,
                current: "1", recordTime: JSON.stringify(this.recordTime)
            };
            options.headers = { token: localStorage['token'] };
            console.log("options");
            console.log(options);


            //创建文件对象
            const fileTransfer: FileTransferObject = this.fileTransfer.create();

            // this.base.logger(JSON.stringify(options), "Img_maintenance_submit_function_fileTransferPar.txt");
                fileTransfer.upload(this.imageData, this.base.BASE_URL + 'app/AddTrack', options)
                    .then((res) => {
                        console.log(res);
                        console.log(JSON.stringify(res));
                        console.log(JSON.parse(JSON.stringify(res)).message);

                        // this.base.logger(JSON.stringify(res), "Img_maintenance_submit_function_fileTransferRes.txt");

                        this.base.showAlert('提示', '提交成功', () => { });
                        // Base.popTo(this.navCtrl, 'DetailPage');
                    }, (error) => {//发送失败(网络出错等)
                        this.base.showAlert('提示', '提交失败', () => { });
                        // this.base.logger(JSON.stringify(error), "Img_maintenance_submit_function_fileTransferError.txt");

                        let cacheData = {
                            longtitudeData: this.longtitudeData.toString(), latitudeData: this.latitudeData.toString(), altitudeData: this.altitudeData.toString(),
                            lineName: this.lineName, workContent: this.workContent, lateIntravl: this.lateIntravl.toString(), remarks: this.remarks,
                            current: "1",
                            img: this.imageData, recordTime: JSON.stringify(this.recordTime)
                        };
                        let TrackCache: any;
                        TrackCache = localStorage.getItem('TrackCache');
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

                        localStorage.setItem('TrackCache', JSON.stringify(TrackCache));
                        //this.navCtrl.pop();
                        // confirm.dismiss()
                        // Base.popTo(this.navCtrl, 'DetailPage');
                    })
            //.catch((error) => {//发送失败(文件不存在等)
            // alert("出错" + error);
            //alert('失败');
            //console.log(error);
            //});
        } else {

            // var options: string = "deviceId: " + this.id +
            //     "longitude:" + this.longitude + "latitude:" + this.latitude + "num:" + this.num +
            //     "maleNum:" + this.maleNum + "femaleNum:" + this.femaleNum + "altitude:" + this.altitude +
            //     "drug:" + this.drug + "remark:" + this.remark + "workingContent:" + this.workingContent + "otherNum:" + this.otherNum + "otherType:" + this.otherType;


            // this.base.logger(options, "NonImg_maintenance_submit_function_fileTransferPar.txt");

            this.httpClient.post(this.base.BASE_URL + 'app/AddTrack', {},
                {
                    headers: { token: localStorage['token'] }, params: {
                        longtitudeData: this.longtitudeData.toString(), latitudeData: this.latitudeData.toString(), altitudeData: this.altitudeData.toString(),
                        lineName: this.lineName, workContent: this.workContent, lateIntravl: this.lateIntravl.toString(), remarks: this.remarks,
                        current: "1", recordTime: JSON.stringify(this.recordTime)
                    }
                })
                .subscribe(res => {
                    console.log(JSON.stringify(res));
                    console.log(JSON.parse(JSON.stringify(res)).message);
                    // this.base.logger(JSON.stringify(res), "NonImg_maintenance_submit_function_fileTransferRes.txt");
                    this.base.showAlert('提示', '提交成功', () => { });
                    let cacheData = {
                        longtitudeData: this.longtitudeData.toString(), latitudeData: this.latitudeData.toString(), altitudeData: this.altitudeData.toString(),
                        lineName: this.lineName, workContent: this.workContent, lateIntravl: this.lateIntravl.toString(), remarks: this.remarks,
                        current: "1", recordTime: JSON.stringify(this.recordTime)
                    };
                    console.log("cacheData");
                    console.log(cacheData);

                    // Base.popTo(this.navCtrl, 'DetailPage');
                }, (msg) => {

                    // this.base.logger(JSON.stringify(msg), "NonImg_maintenance_submit_function_fileTransferError.txt");

                    this.base.showAlert('提示', '提交失败', () => { });
                    let cacheData = {
                        longtitudeData: this.longtitudeData.toString(), latitudeData: this.latitudeData.toString(), altitudeData: this.altitudeData.toString(),
                        lineName: this.lineName, workContent: this.workContent, lateIntravl: this.lateIntravl.toString(), remarks: this.remarks,
                        current: "1", recordTime: JSON.stringify(this.recordTime)
                    };
                    console.log("cacheData");
                    console.log(cacheData);

                    let TrackCache: any;
                    TrackCache = localStorage.getItem('TrackCache');
                    if (TrackCache == null) {
                        TrackCache = [];
                    } else {
                        TrackCache = JSON.parse(TrackCache);
                    }
                    TrackCache.push(cacheData);
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
                    localStorage.setItem('TrackCache', JSON.stringify(TrackCache));
                    console.log("Hello");

                    //this.navCtrl.pop();
                    // confirm.dismiss();
                    // Base.popTo(this.navCtrl, 'DetailPage');
                });

        }

    }

    takePhoto() {
        this.photosum += 1;
        const options: CameraOptions = {
            quality: 10,
            destinationType: this.camera.DestinationType.FILE_URI,
            sourceType: 1,
            encodingType: this.camera.EncodingType.JPEG,
            mediaType: this.camera.MediaType.PICTURE,
            allowEdit: false,
            correctOrientation: true
        };
        this.base.showAlert(this.photosum, "", () => { });
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

    startRecord(){
        if (!this.lateIntravl){
            this.base.showAlert("请先输入延时间隔!","请先输入延时间隔!",()=>{});
        }else{
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

            this.myIntravl = setInterval(()=>{
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
            },this.lateIntravl*1000);

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
    stopRecord(){
        clearInterval(this.myIntravl);
        this.recordTime.endTime = new Date(new Date().getTime() + 8 * 60 * 60 * 1000).toISOString().replace(/T/g, ' ').replace(/\.[\d]{3}Z/, '');
        console.log(this.recordTime.endTime);



    }

}
