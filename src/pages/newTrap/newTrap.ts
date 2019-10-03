import { Component } from '@angular/core';
import { QRScanner, QRScannerStatus } from '@ionic-native/qr-scanner';
import { NavController } from 'ionic-angular';
import { HttpClient, HttpParams } from "@angular/common/http";
import { ScanPage} from '../scan/scan'
import {Base} from '../../common/base.js'
import { Subscription } from "rxjs/Subscription";
import { Geolocation } from "@ionic-native/geolocation";
import { ChangeDetectorRef } from '@angular/core';
import { Camera, CameraOptions } from "@ionic-native/camera";
import { FileTransfer, FileTransferObject, FileUploadOptions } from "@ionic-native/file-transfer";

@Component({
    selector: 'app-home',
    templateUrl: 'newTrap.html',
})
export class TrapPage {
    deviceId: string
    deviceSerial: string
    longtitude: string
    latitude: string
    BeetleType: string
    injectTypeValue: string
    WorkContentValue: string
    altitude: string
    accuracy: string
    have_submit:boolean
    imageData: null
    remarks: "1"
    newbettle: string
    otherbettleType:any[]
    injectType:any[]
    workContent:any[]
    // 定位订阅
    subscription: Subscription;
    // 是否定位成功
    location_ready = false;
    otherbettle:string

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

    deviceBind(){
        //这里还没有实现，先弹框
        this.base.showAlert("成功","",()=>{});
    }
    takePhoto() {
        const options: CameraOptions = {
            quality: 10,
            destinationType: this.camera.DestinationType.FILE_URI,
            sourceType: 1,
            encodingType: this.camera.EncodingType.JPEG,
            mediaType: this.camera.MediaType.PICTURE,
            allowEdit: false,
            correctOrientation: true
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

    ionViewDidLoad() {
        console.log('ionViewDidLoad LocatePage');
        console.log(localStorage['device']);
        console.log(localStorage["maintenanceCache"]);

        if (localStorage["maintenanceCache"]){
            var tmpStorage = JSON.parse(localStorage["maintenanceCache"]);
            tmpStorage.forEach(element => {
                console.log(element);
                if(element.img!=null){
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
                        otherNum: element.otherNum, otherType: element.otherType
                    };
                    options.headers = { token: localStorage['token'] };
                    console.log("options");
                    console.log(options);


                    //创建文件对象
                    const fileTransfer: FileTransferObject = this.fileTransfer.create();


                    // this.base.logger(JSON.stringify(options), "Img_maintenance_submit_function_fileTransferPar.txt");

                    fileTransfer.upload(element.img, this.base.BASE_URL + 'auth_api/maintenance', options)
                        .then((res) => {
                            console.log(res);
                            console.log(JSON.stringify(res));
                            console.log(JSON.parse(JSON.stringify(res)).message);

                            // this.base.logger(JSON.stringify(res), "Img_maintenance_submit_function_fileTransferRes.txt");

                            this.base.showAlert('提示', '提交成功', () => { });
                            localStorage.removeItem('maintenanceCache');
                        }, (error) => {//发送失败(网络出错等)
                            this.base.showAlert('提示', '提交失败', () => { });
                        })
                }else{
                    console.log(element);
                    this.httpClient.post('http://192.168.1.6:8081/auth_api/maintenance', {},
                        {
                            headers: { token: localStorage['token'] }, params: {
                                deviceId: element.deviceId,
                                longitude: element.longitude, latitude: element.latitude, num: element.num,
                                maleNum: "1", femaleNum: "1", altitude: element.altitude,
                                drug: element.drug, remark: element.remark, workingContent: element.workingContent,
                                otherNum: element.otherNum, otherType: element.otherType
                            }
                        })
                        .subscribe(res => {
                            console.log(JSON.stringify(res));
                            console.log(JSON.parse(JSON.stringify(res)).message);
                            this.base.showAlert('提示', '提交成功', () => { });
                            localStorage.removeItem('maintenanceCache');
                        }, (msg) => {
                                this.base.showAlert('提示', '提交失败', () => { });
                        });
                }
            });
        }

        this.httpClient.post("http://192.168.1.6:8081/app/" + 'getBeetle', {},
            { headers: { token: localStorage['token'] }, 
            params: new HttpParams({ fromObject: { username: localStorage['username']} }) })
            .subscribe(res => {
                var c:any = res;
                this.otherbettleType = Array.from(c);
                console.log(this.otherbettleType);

            },
                res => {
                    console.log(res);
                })

        this.httpClient.post("http://192.168.1.6:8081/app/" + 'getInject', {},
            {
                headers: { token: localStorage['token'] },
                params: new HttpParams({ fromObject: { username: localStorage['username'] } })
            })
            .subscribe(res => {
                var c: any = res;
                this.injectType = Array.from(c);
                console.log(this.injectType);

            },
                res => {
                    console.log(res);
                })

        this.httpClient.post("http://192.168.1.6:8081/app/" + 'getWorkContent', {},
            {
                headers: { token: localStorage['token'] },
                params: new HttpParams({ fromObject: { username: localStorage['username'] } })
            })
            .subscribe(res => {
                var c: any = res;
                this.workContent = Array.from(c);
                console.log(this.workContent);
                console.log(this.workContent);

            },
                res => {
                    console.log(res);
                })

    }

    constructor(public navCtrl: NavController, 
        public qrScanner: QRScanner, 
        private base: Base, 
        private geolocation: Geolocation,
        private changeDetectorRef: ChangeDetectorRef,
        private httpClient: HttpClient,
        private camera: Camera,
        private fileTransfer: FileTransfer) { }

    callBack = (params) => {
        return new Promise((resolve, reject) => {
            if (params) {
                console.log(params.id);
                var allDevice = JSON.parse(localStorage["device"]);
                console.log(localStorage["device"]);
                console.log("Array");
                console.log(allDevice[0]);

                var flag = 0;
                allDevice.forEach(element => {
                    console.log("element");
                    console.log(element);
                    if(element.id == params.id)
                        flag=1;
                });
                if(flag==1){
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
                    }, () => { })
                }else{
                    this.base.showConfirmAlert("二维码无效", params.id, () => {
                    }, () => { })
                }
            } else {

            }
        });
    };
    trapClick() {
        console.log("trap");
    }

    scan() {
        console.log("scan");
        console.log(localStorage['username']);
        this.navCtrl.push(ScanPage,{callBack:this.callBack});
    }
    
    submit(){
        this.have_submit = true;
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
            options.headers = { token: localStorage['token'] };
            console.log("options");
            console.log(options);


            //创建文件对象
            const fileTransfer: FileTransferObject = this.fileTransfer.create();


            // this.base.logger(JSON.stringify(options), "Img_maintenance_submit_function_fileTransferPar.txt");

            fileTransfer.upload(this.imageData, this.base.BASE_URL + 'auth_api/maintenance', options)
                .then((res) => {
                    console.log(res);
                    console.log(JSON.stringify(res));
                    console.log(JSON.parse(JSON.stringify(res)).message);

                    // this.base.logger(JSON.stringify(res), "Img_maintenance_submit_function_fileTransferRes.txt");

                    this.base.showAlert('提示', '提交成功', () => { });
                    Base.popTo(this.navCtrl, 'DetailPage');
                }, (error) => {//发送失败(网络出错等)
                    this.base.showAlert('提示', '提交失败', () => { });
                    // this.base.logger(JSON.stringify(error), "Img_maintenance_submit_function_fileTransferError.txt");

                    let cacheData = {
                        deviceId: this.deviceId,
                        longitude: this.longtitude, latitude: this.latitude, num: this.newbettle,
                        maleNum: "1", femaleNum: "1", altitude: this.altitude,
                        drug: this.injectTypeValue, remark: this.remarks, workingContent: this.WorkContentValue,
                        otherNum: this.otherbettle, otherType: this.BeetleType,
                        img:this.imageData
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
                    //         //console.log('已经超出本地存储限定大小！');
                    //             // 可进行超出限定大小之后的操作，如下面可以先清除记录，再次保存
                    //       // localStorage.clear();
                    //       // localStorage.setItem(key,value);
                    //     }
                    // } 

                    localStorage.setItem('maintenanceCache', JSON.stringify(maintenanceCache));
                    //this.navCtrl.pop();
                    // confirm.dismiss()
                    Base.popTo(this.navCtrl, 'DetailPage');
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

            this.httpClient.post('http://192.168.1.6:8081/auth_api/maintenance', {},
                {
                    headers: {token: localStorage['token']}, params:{
                        deviceId: this.deviceId,
                        longitude: this.longtitude, latitude: this.latitude, num: this.newbettle,
                        maleNum: "1", femaleNum: "1", altitude: this.altitude,
                        drug: this.injectTypeValue, remark: this.remarks, workingContent: this.WorkContentValue,
                        otherNum: this.otherbettle, otherType: this.BeetleType
                    }
                })
                .subscribe(res => {
                    console.log(JSON.stringify(res));
                    console.log(JSON.parse(JSON.stringify(res)).message);
                    // this.base.logger(JSON.stringify(res), "NonImg_maintenance_submit_function_fileTransferRes.txt");
                    this.base.showAlert('提示', '提交成功', () => { });
                    let cacheData = {
                        deviceId: this.deviceId,
                        longitude: this.longtitude, latitude: this.latitude, num: this.newbettle,
                        maleNum: "1", femaleNum: "1", altitude: this.altitude,
                        drug: this.injectTypeValue, remark: this.remarks, workingContent: this.WorkContentValue,
                        otherNum: this.otherbettle, otherType: this.BeetleType
                    };
                    console.log("cacheData");
                    console.log(cacheData);
                    
                    // Base.popTo(this.navCtrl, 'DetailPage');
                }, (msg) => {

                    // this.base.logger(JSON.stringify(msg), "NonImg_maintenance_submit_function_fileTransferError.txt");

                    this.base.showAlert('提示', '提交失败', () => { });
                    let cacheData = {
                        deviceId: this.deviceId,
                        longitude: this.longtitude, latitude: this.latitude, num: this.newbettle,
                        maleNum: "1", femaleNum: "1", altitude: this.altitude,
                        drug: this.injectTypeValue, remark: this.remarks, workingContent: this.WorkContentValue,
                        otherNum: this.otherbettle, otherType: this.BeetleType
                    };
                        console.log("cacheData");
                        console.log(cacheData);

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
                    //         //console.log('已经超出本地存储限定大小！');
                    //             // 可进行超出限定大小之后的操作，如下面可以先清除记录，再次保存
                    //       // localStorage.clear();
                    //       // localStorage.setItem(key,value);
                    //     }
                    // }   
                    localStorage.setItem('maintenanceCache', JSON.stringify(maintenanceCache));
                    console.log("Hello");

                    //this.navCtrl.pop();
                    // confirm.dismiss();
                    // Base.popTo(this.navCtrl, 'DetailPage');
                });

        }

    }
    deviceIdInput() {
        console.log("ok");
        console.log(this.deviceId);
    }
    deviceSerialInput() {
        console.log(this.deviceSerial);
    }

}
