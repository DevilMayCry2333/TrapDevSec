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
    templateUrl: 'newDeadTree.html'
})
export class DeadtreePage {
    deviceId: string;
    deviceSerial: string;
    longtitude: string;
    latitude: string;
    altitude: string;
    diameter:number;
    height:number;
    have_submit:boolean;
    accuracy: string;
    volume: number;
    killMethodsValue:string
    killMethods:any[];
    imageData:null
    location_ready:boolean
    remarks:"1"
    subscription:Subscription
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
        public qrScanner: QRScanner,
        private base: Base,
        private geolocation: Geolocation,
        private changeDetectorRef: ChangeDetectorRef,
        private httpClient: HttpClient,
        private camera: Camera,
        private fileTransfer: FileTransfer,
        public navCtrl: NavController
    ) { }

    NavToMap() {
        this.navCtrl.push(AboutPage);
    }

    bindNewId(){
        this.httpClient.post(this.base.BASE_URL  + 'app/bindId', {},
            {
                headers: { token: localStorage['token'] },
                params: new HttpParams({ fromObject: { scanId: this.deviceId, serial:this.deviceSerial} })
            })
            .subscribe(res => {
                console.log(res);
                this.base.showAlert("成功", "", () => { });
            },
                res => {
                    console.log(res);
                })
    }
    ionViewDidLoad() {
        console.log('ionViewDidLoad LocatePage');
        console.log(localStorage['device']);
        //deadCache
        if (localStorage["deadCache"]) {
            var tmpStorage = JSON.parse(localStorage["deadCache"]);
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
                        deviceId: element.deviceId, longitude: element.longitude, latitude: element.latitude, altitude: element.altitude,
                        accuracy: element.accuracy, diameter: element.diameter, height: element.height, volume: element.volume,
                        killMethodsValue: element.killMethodsValue, remarks: element.remarks
                    };
                    options.headers = { token: localStorage['token'] };
                    console.log("options");
                    console.log(options);


                    //创建文件对象
                    const fileTransfer: FileTransferObject = this.fileTransfer.create();


                    // this.base.logger(JSON.stringify(options), "Img_maintenance_submit_function_fileTransferPar.txt");

                    fileTransfer.upload(element.img, this.base.BASE_URL + 'app/AddDeadtrees', options)
                        .then((res) => {
                            console.log(res);
                            console.log(JSON.stringify(res));
                            console.log(JSON.parse(JSON.stringify(res)).message);

                            // this.base.logger(JSON.stringify(res), "Img_maintenance_submit_function_fileTransferRes.txt");

                            this.base.showAlert('提示', '提交成功', () => { });
                            localStorage.removeItem('deadCache');
                        }, (error) => {//发送失败(网络出错等)
                            this.base.showAlert('提示', '提交失败', () => { });
                        })
                } else {
                    console.log(element);
                    this.httpClient.post(this.base.BASE_URL + 'app/AddDeadtrees', {},
                        {
                            headers: { token: localStorage['token'] }, params: {
                                deviceId: element.deviceId, longitude: element.longitude, latitude: element.latitude, altitude: element.altitude,
                                accuracy: element.accuracy, diameter: element.diameter, height: element.height, volume: element.volume,
                                killMethodsValue: element.killMethodsValue, remarks: element.remarks
                            }
                        })
                        .subscribe(res => {
                            console.log(JSON.stringify(res));
                            console.log(JSON.parse(JSON.stringify(res)).message);
                            this.base.showAlert('提示', '提交成功', () => { });
                            localStorage.removeItem('deadCache');
                        }, (msg) => {
                            this.base.showAlert('提示', '提交失败', () => { });
                        });
                }
            });
        }

        if (localStorage["deadKill"]){
            console.log(localStorage["deadKill"]);
            this.killMethods = JSON.parse(localStorage["deadKill"]);
            console.log("缓存");
            console.log(this.killMethods);
        }
        this.httpClient.post(this.base.BASE_URL + 'app/getKillMethods', {},
            {
                headers: { token: localStorage['token'] },
                params: new HttpParams({ fromObject: { worker: localStorage['username'] } })
            })
            .subscribe(res => {
                var c: any = res;
                this.killMethods = Array.from(c);
                console.log("subb",res);
                console.log(this.killMethods);
                localStorage['deadKill'] = JSON.stringify(res);

            },
                res => {
                    console.log(res);
                })

    }

    deviceBind() {
        //这里还没有实现，先弹框
        this.base.showAlert("成功", "", () => { });
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
    diameterInput(){
        console.log(this.diameter);
        var tmp: number = 0.714265437 * 0.0001 * Math.pow(this.diameter * 0.7, 1.867010) * Math.pow(this.height, 0.9014632);
        this.volume = tmp;
        console.log(this.volume.toString());
    }
    heightInput(){
        console.log(this.height);
        var tmp: number = 0.714265437 * 0.0001 * Math.pow(this.diameter * 0.7, 1.867010) * Math.pow(this.height, 0.9014632);
        this.volume = tmp;
    }
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
                    if (element.scanId== params.id)
                        flag = 1;
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
                    }, () => { })
                } else {
                    this.base.showConfirmAlert("二维码无效", params.id, () => {
                    }, () => { })
                }
            } else {

            }
        });
    };
    scan() {
        console.log("scan");
        console.log(localStorage['username']);
        this.navCtrl.push(ScanPage, { callBack: this.callBack });
    }

    submit() {
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
                deviceId: this.deviceId, longitude: this.longtitude, latitude: this.latitude, altitude: this.altitude,
                accuracy: this.accuracy, diameter: this.diameter.toString(), height: this.height.toString(), volume: this.volume.toString(),
                killMethodsValue: this.killMethodsValue, remarks: this.remarks
            };
            options.headers = { token: localStorage['token'] };
            console.log("options");
            console.log(options);

            //创建文件对象
            const fileTransfer: FileTransferObject = this.fileTransfer.create();


            // this.base.logger(JSON.stringify(options), "Img_maintenance_submit_function_fileTransferPar.txt");

            fileTransfer.upload(this.imageData, this.base.BASE_URL + 'app/AddDeadtrees', options)
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
                        deviceId: this.deviceId, longitude: this.longtitude, latitude: this.latitude, altitude: this.altitude,
                        accuracy: this.accuracy, diameter: this.diameter, height: this.height, volume: this.volume,
                        killMethodsValue: this.killMethodsValue, remarks: this.remarks,
                        img: this.imageData
                    };
                    let deadCache: any;
                    deadCache = localStorage.getItem('deadCache');
                    if (deadCache == null) {
                        deadCache = [];
                    } else {
                        deadCache = JSON.parse(deadCache);
                    }
                    deadCache.push(cacheData);
                    //localStorage安全保存数据
                    // try{
                    //   localStorage.setItem('deadCache', JSON.stringify(deadCache));
                    // }catch(oException){
                    //     if(oException.name == 'QuotaExceededError'){
                    //         this.base.showAlert('提示', '无法提交，缓存容量不足，请及时处理', ()=>{});
                    //         //console.log('已经超出本地存储限定大小！');
                    //             // 可进行超出限定大小之后的操作，如下面可以先清除记录，再次保存
                    //       // localStorage.clear();
                    //       // localStorage.setItem(key,value);
                    //     }
                    // } 

                    localStorage.setItem('deadCache', JSON.stringify(deadCache));
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

            this.httpClient.post(this.base.BASE_URL + 'app/AddDeadtrees', {},
                {
                    headers: { token: localStorage['token'] }, params: {
                        deviceId: this.deviceId, longitude: this.longtitude, latitude: this.latitude, altitude: this.altitude,
                        accuracy: this.accuracy, diameter: this.diameter.toString(), height: this.height.toString(), volume: this.volume.toString(),
                        killMethodsValue: this.killMethodsValue, remarks: this.remarks
                    }
                })
                .subscribe(res => {
                    console.log(JSON.stringify(res));
                    console.log(JSON.parse(JSON.stringify(res)).message);
                    // this.base.logger(JSON.stringify(res), "NonImg_maintenance_submit_function_fileTransferRes.txt");
                    this.base.showAlert('提示', '提交成功', () => { });
                    let cacheData = {
                        deviceId: this.deviceId, longitude: this.longtitude, latitude: this.latitude, altitude: this.altitude,
                        accuracy: this.accuracy, diameter: this.diameter, height: this.height, volume: this.volume,
                        killMethodsValue: this.killMethodsValue, remarks: this.remarks
                    };
                    console.log("cacheData");
                    console.log(cacheData);

                    // Base.popTo(this.navCtrl, 'DetailPage');
                }, (msg) => {

                    // this.base.logger(JSON.stringify(msg), "NonImg_maintenance_submit_function_fileTransferError.txt");

                    this.base.showAlert('提示', '提交失败', () => { });
                    let cacheData = {
                        deviceId: this.deviceId, longitude: this.longtitude, latitude: this.latitude, altitude: this.altitude,
                        accuracy: this.accuracy, diameter: this.diameter, height: this.height, volume: this.volume,
                        killMethodsValue: this.killMethodsValue, remarks: this.remarks
                    };
                    console.log("cacheData");
                    console.log(cacheData);

                    let deadCache: any;
                    deadCache = localStorage.getItem('deadCache');
                    if (deadCache == null) {
                        deadCache = [];
                    } else {
                        deadCache = JSON.parse(deadCache);
                    }
                    deadCache.push(cacheData);
                    // try{
                    //   localStorage.setItem('deadCache', JSON.stringify(deadCache));
                    // }catch(oException){
                    //     if(oException.name == 'QuotaExceededError'){
                    //         this.base.showAlert('提示', '无法提交，缓存容量不足，请及时处理', ()=>{});
                    //         //console.log('已经超出本地存储限定大小！');
                    //             // 可进行超出限定大小之后的操作，如下面可以先清除记录，再次保存
                    //       // localStorage.clear();
                    //       // localStorage.setItem(key,value);
                    //     }
                    // }   
                    localStorage.setItem('deadCache', JSON.stringify(deadCache));
                    console.log("Hello");

                    //this.navCtrl.pop();
                    // confirm.dismiss();
                    // Base.popTo(this.navCtrl, 'DetailPage');
                });

        }

    }

    trapClick() {
        console.log('deadtree');
    }
    deviceIdInput() {
        console.log('ok');
        console.log(this.deviceId);
    }
    deviceSerialInput() {
        console.log(this.deviceSerial);
    }

}
