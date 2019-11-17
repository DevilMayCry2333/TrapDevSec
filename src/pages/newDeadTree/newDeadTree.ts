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
import { DeadTreesQueryPage} from '../dead-trees-query/dead-trees-query';
import { LoadingController } from 'ionic-angular';
import { Base64 } from '@ionic-native/base64';
import { File } from "@ionic-native/file";

@Component({
    selector: 'app-deadtree',
    templateUrl: 'newDeadTree.html'
})
export class DeadtreePage {
    deviceId: string;
    deviceSerial: string;
    // longtitude: string;
    // latitude: string;
    // altitude: string;
    // accuracy: string;
    batch: any;
    currentImg:any;
    longtitude="1.1234567";
    latitude="1.1234567";
    altitude="1.1234567";
    accuracy="1.1234567";
    diameter = 0;
    height = 0;
    picNotExist = false;
    have_submit:boolean;
    hasPic = false;
    photosum = 0;
    photolib1:any;
    photolib2:any;
    photolib3:any;
    i:any;
    volume = 0;
    killMethodsValue:string
    killMethods:any[];
    imageData:null
    location_ready:boolean
    remarks = ""
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
        public navCtrl: NavController,
        public loadingCtrl: LoadingController,
        private base64: Base64,
        private file: File
    ) { }

    NavToMap() {
        this.navCtrl.push(AboutPage);
    }

    bindNewId(){
        if(this.deviceId == undefined || this.deviceId=="" || this.deviceSerial == undefined || this.deviceSerial == ""){
            this.base.showAlert("提示","请先输入设备ID和设备编号!",()=>{})
        }else{
            this.httpClient.post(this.base.BASE_URL + 'app/bindId', {},
                {
                    headers: { token: localStorage['token'] }, params: {
                        scanId: this.deviceId, serial: this.deviceSerial, username: localStorage['username']
                    }
                })
                .subscribe(res => {
                    console.log(JSON.stringify(res));
                    console.log(JSON.parse(JSON.stringify(res)).message);
                    // this.base.logger(JSON.stringify(res), "NonImg_maintenance_submit_function_fileTransferRes.txt");
                    this.base.showAlert('提示', '提交成功', () => { });
                    console.log("cacheData");

                    Base.popTo(this.navCtrl, 'switchProjectPage');
                }, (msg) => {

                    // this.base.logger(JSON.stringify(msg), "NonImg_maintenance_submit_function_fileTransferError.txt");

                    this.base.showAlert("提交失败", "提交失败", () => { });
                    console.log(msg);
                    console.log("失败");
                    var transferParam = { scanId: this.deviceId, serial: this.deviceSerial };
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

    test2(){
        localStorage.removeItem("deadCache");
        localStorage.removeItem("deadPhotoCache1");
        localStorage.removeItem("deadPhotoCache2");
        localStorage.removeItem("deadPhotoCache3");
    }

    ionViewDidLoad() {
        var that = this;
        if (localStorage["deadBind"]) {

            var tmpStorage2 = [];

            tmpStorage2 = JSON.parse(localStorage["deadBind"]);

            var i = 0;

            tmpStorage2.forEach(element => {


                this.httpClient.post(this.base.BASE_URL + 'app/bindId', {},
                    {
                        headers: { token: localStorage['token'] },
                        params: new HttpParams({ fromObject: { scanId: element.scanId, serial: element.serial } })
                    })
                    .subscribe(res => {
                        i++;
                        this.base.showAlert("成功绑定了", "", () => { });
                        if (tmpStorage2.length == i) {
                            localStorage.removeItem("deadBind");
                            this.base.showAlert("清理了缓存", "", () => { });
                        }
                    },
                        msg => {

                        })

            })


        }


        //deadCache
        if (localStorage["deadCache"]) {
            const loader = this.loadingCtrl.create({
                content: "缓存数据正在提交，请勿退出",
                duration: 15000
            });
            loader.present();
            var tmpStorage = JSON.parse(localStorage["deadCache"]);
            console.log("照片缓存");
            
            console.log(localStorage["deadPhotoCache1"]);
            console.log(localStorage["deadPhotoCache2"]);
            console.log(localStorage["deadPhotoCache3"]);
            
            
            
            if (localStorage["deadPhotoCache1"]) {
                this.photolib1 = JSON.parse(localStorage["deadPhotoCache1"]);
            }
            if (localStorage["deadPhotoCache2"]) {
                this.photolib2 = JSON.parse(localStorage["deadPhotoCache2"]);
            }
            if (localStorage["deadPhotoCache3"]) {
                this.photolib3 = JSON.parse(localStorage["deadPhotoCache3"]);
            }

            this.i=0;
           
            tmpStorage.forEach(element => {
                this.httpClient.post(this.base.BASE_URL + 'app/addDeviceId', {},
                    {
                        headers: { token: localStorage['token'] }, params: {
                            deviceId: element.deviceId
                        }
                    }).subscribe(res => {
                        console.log("AddDeviceId");
                        //在这里传值到后端去吧
                        //其实已经好了。。批次只有1.。。。。。。。
                        //如果一定要批次对应的话，应该只要批量传列表deviceId一次，然后前端
                        //传当前是第几次,设定好延时。。
                        console.log(res);
                        this.batch = res;
                    })

                // this.base.showAlert(element.hasPic, "hasPic状态", () => { });
                console.log(element.hasPic);

                if (element.hasPic == true) {
                    // this.base.showAlert("有照片", "", () => { });
                    console.log(element);
                    console.log(element.photoSum);

                    for (var j = 1; j <= element.photoSum; j++) {
                        (function (j) {
                            setTimeout(function () {
                                console.log(j);
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
                                    killMethodsValue: element.killMethodsValue, remarks: element.remarks, current: j, batch: element.batch
                                };
                                options.headers = { token: localStorage['token'] };
                                console.log("options");
                                console.log(options);


                                //创建文件对象
                                const fileTransfer: FileTransferObject = that.fileTransfer.create();
                                if (j == 1) {
                                    that.currentImg = that.photolib1;
                                } else if (j == 2) {
                                    that.currentImg = that.photolib2;
                                } else if (j == 3) {
                                    that.currentImg = that.photolib3;
                                }
                                that.base.showAlert("有照片", that.currentImg[that.i].img, () => { });
                                console.log(that.i);
                                console.log(that.currentImg[that.i].img);
                                console.log(that.currentImg[that.i].img);
                                that.file.listDir(that.file.externalCacheDirectory,".").then(
                                    (par)=>{
                                        console.log("名字");
                                        console.log(par);
                                        console.log(par[0].name);
                                        var imgPath = that.currentImg[that.i].img.split("/");
                                        console.log(imgPath[imgPath.length - 1]);
                                    
                                        that.file.readAsDataURL(that.file.externalCacheDirectory, imgPath[imgPath.length - 1]).then((base64) => {
                                            console.log(base64);
                                        }, (err) => {
                                            console.log(err);

                                        }).catch((msg) => {
                                            console.log(msg);

                                        })
                                },(err)=>{
                                    console.log(err);
                                    
                                }).catch((msg)=>{
                                    console.log(msg);
                                })

                                // that.base64.encodeFile(that.currentImg[that.i].img).then((base64File: string) => {
                                //     console.log(base64File);
                                // }, (err) => {
                                //     console.log(err);
                                // });

                                // this.base.logger(JSON.stringify(options), "Img_maintenance_submit_function_fileTransferPar.txt");

                                // fileTransfer.upload(that.currentImg[that.i].img, that.base.BASE_URL + 'app/AddDeadtreePhoto', options)
                                //     .then((res) => {
                                //         console.log(res);
                                //         console.log(JSON.stringify(res));
                                //         console.log(JSON.parse(JSON.stringify(res)).message);

                                //     }, (error) => {//发送失败(网络出错等)
                                //             that.picNotExist = true;
                                //         // this.base.showAlert('提示', '提交失败', () => { });
                                //     }).catch((error) => {
                                //         that.picNotExist = true;
                                //     })

                                if (that.picNotExist) {
                                    that.httpClient.post(that.base.BASE_URL + 'app/AddDeadtrees', {},
                                        {
                                            headers: { token: localStorage['token'] }, params: {
                                                deviceId: element.deviceId, longitude: element.longitude, latitude: element.latitude, altitude: element.altitude,
                                                accuracy: element.accuracy, diameter: element.diameter, height: element.height, volume: element.volume,
                                                killMethodsValue: element.killMethodsValue, remarks: element.remarks, batch: element.batch
                                            }
                                        })
                                        .subscribe(res => {
                                            console.log(JSON.stringify(res));
                                            console.log(JSON.parse(JSON.stringify(res)).message);
                                        }, (msg) => {
                                            // this.base.showAlert('提示', '提交失败', () => { });
                                        });
                                }

                            }, (j + 1) * 1000);
                        })(j)

                    }
                    setTimeout(() => {
                        this.httpClient.post(this.base.BASE_URL + 'app/AddDeadtrees', {},
                            {
                                headers: { token: localStorage['token'] }, params: {
                                    deviceId: element.deviceId, longitude: element.longitude, latitude: element.latitude, altitude: element.altitude,
                                    accuracy: element.accuracy, diameter: element.diameter, height: element.height, volume: element.volume,
                                    killMethodsValue: element.killMethodsValue, remarks: element.remarks, batch: element.batch
                                }
                            })
                            .subscribe(res => {
                                console.log(JSON.stringify(res));
                                console.log(JSON.parse(JSON.stringify(res)).message);
                                // this.base.showAlert('提示', '提交成功', () => { });
                                this.i++;
                                if (this.i >= tmpStorage.length)
                                    localStorage.removeItem('deadCache');
                            }, (msg) => {
                                // this.base.showAlert('提示', '提交失败', () => { });
                            });

                    }, 10000)

                } else {
                    this.httpClient.post(this.base.BASE_URL + 'app/AddDeadtrees', {},
                        {
                            headers: { token: localStorage['token'] }, params: {
                                deviceId: element.deviceId, longitude: element.longitude, latitude: element.latitude, altitude: element.altitude,
                                accuracy: element.accuracy, diameter: element.diameter, height: element.height, volume: element.volume,
                                killMethodsValue: element.killMethodsValue, remarks: element.remarks, batch: element.batch
                            }
                        })
                        .subscribe(res => {
                            console.log(JSON.stringify(res));
                            console.log(JSON.parse(JSON.stringify(res)).message);
                            // this.base.showAlert('提示', '提交成功', () => { });
                            this.i++;
                            if (this.i >= tmpStorage.length)
                                localStorage.removeItem('deadCache');
                        }, (msg) => {
                            // this.base.showAlert('提示', '提交失败', () => { });
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

    NavToQuery(){
        if (this.deviceId) {
            localStorage["DeadMotherDeviceId"] = this.deviceId;
            this.navCtrl.push(DeadTreesQueryPage);
        } else {
            this.base.showAlert("提示", "请先扫码或输入数字的设备ID!!!", () => { });
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
            let options: FileUploadOptions = {};
            options.fileKey = "image";
            var time = Date.parse(Date());
            options.fileName = time + ".jpg";
            options.mimeType = "image/jpeg";
            options.chunkedMode = false;
            options.httpMethod = "POST";
            // options.params = {
            //     deviceId: this.deviceId, longitude: this.longtitude, latitude: this.latitude, altitude: this.altitude,
            //     accuracy: this.accuracy, diameter: this.diameter.toString(), height: this.height.toString(), volume: this.volume.toString(),
            //     killMethodsValue: this.killMethodsValue, remarks: this.remarks
            // };
            options.params = {
                deviceId: this.deviceId, current:this.photosum
            };

            options.headers = { token: localStorage['token'] };
            console.log("options");
            console.log(options);

            //创建文件对象
            const fileTransfer: FileTransferObject = this.fileTransfer.create();

            fileTransfer.upload(this.imageData, this.base.BASE_URL + 'app/AddDeadtreePhoto', options)
                .then((res) => {
                    console.log(res);
                    console.log(JSON.stringify(res));
                    console.log(JSON.parse(JSON.stringify(res)).message);

                    // this.base.logger(JSON.stringify(res), "Img_maintenance_submit_function_fileTransferRes.txt");

                    this.base.showAlert('提示', '提交成功', () => { });
                }, (error) => {//发送失败(网络出错等)
                    this.base.showAlert('提示', '提交失败', () => { });
                    // this.base.logger(JSON.stringify(error), "Img_maintenance_submit_function_fileTransferError.txt");

                    let cacheData = {
                        deviceId: this.deviceId,
                        photoSum:this.photosum,
                        img: this.imageData
                    };
                    let deadCache: any;
                        deadCache = localStorage.getItem('deadPhotoCache' + this.photosum);
                    if (deadCache == null) {
                        deadCache = [];
                    } else {
                        deadCache = JSON.parse(deadCache);
                    }
                    deadCache.push(cacheData);
                        localStorage.setItem('deadPhotoCache' + this.photosum.toString(), JSON.stringify(deadCache));
                    //this.navCtrl.pop();
                    // confirm.dismiss()
                })            
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
                var allDevice = JSON.parse(localStorage["device"]);

                var flag = 0;
                allDevice.forEach(element => {
                    if ((element.scanId == params.id && element.id.charAt(8) == '4')){
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

                    this.httpClient.post(this.base.BASE_URL + 'app/addDeviceId', {},
                        {
                            headers: { token: localStorage['token'] }, params: {
                                deviceId: this.deviceId
                            }
                        }).subscribe(res => {
                            this.batch = res;
                        })

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
        let num1 = 0;
        if (this.volume < 0 || this.volume == NaN) {
            this.diameter = 0;
            this.height = 0;
            this.volume = 0;

            // this.base.showAlert('提示', '请输入数字', () => { });
        }
        if (!this.volume) {
            this.diameter = 0;
            this.height = 0;
            this.volume = 0;
            // this.base.showAlert('提示', '请输入数字', () => { });
        }
        num1 = this.volume;
        
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
        if (!this.altitude || !this.longtitude || !this.latitude || !this.accuracy || !this.diameter || !this.height || !this.volume || !this.killMethodsValue || this.volume < 0 || this.volume == NaN || !this.volume) {
            this.base.showAlert("提示", "数量输入为空或者不合法", () => { });
        } else {
                let options: FileUploadOptions = {};
                options.params = {
                    deviceId: this.deviceId, longitude: this.longtitude, latitude: this.latitude, altitude: this.altitude,
                    accuracy: this.accuracy, diameter: this.diameter.toString(), height: this.height.toString(), volume: this.volume.toString(),
                    killMethodsValue: this.killMethodsValue, remarks: this.remarks, hasPic: this.hasPic, batch: this.batch
                };
                // var options: string = "deviceId: " + this.id +
                //     "longitude:" + this.longitude + "latitude:" + this.latitude + "num:" + this.num +
                //     "maleNum:" + this.maleNum + "femaleNum:" + this.femaleNum + "altitude:" + this.altitude +
                //     "drug:" + this.drug + "remark:" + this.remark + "workingContent:" + this.workingContent + "otherNum:" + this.otherNum + "otherType:" + this.otherType;

                this.base.logger(JSON.stringify(options), "NoImg_newDeadTreePar.txt");
                if (!this.altitude || !this.longtitude || !this.latitude || !this.accuracy || !this.diameter || !this.height || !this.volume || !this.killMethodsValue || this.volume < 0 || this.volume == NaN || !this.volume) {
                    this.base.showAlert("提示", "数量输入为空或者不合法", () => { });
                    return;
                }
                this.httpClient.post(this.base.BASE_URL + 'app/AddDeadtrees', {},
                    {
                        headers: { token: localStorage['token'] }, params: {
                            deviceId: this.deviceId, longitude: this.longtitude, latitude: this.latitude, altitude: this.altitude,
                            accuracy: this.accuracy, diameter: this.diameter.toString(), height: this.height.toString(), volume: this.volume.toString(),
                            killMethodsValue: this.killMethodsValue, remarks: this.remarks, hasPic: this.hasPic.toString(), batch: this.batch
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
                            killMethodsValue: this.killMethodsValue, remarks: this.remarks, hasPic: this.hasPic, batch: this.batch
                        };
                        console.log("cacheData");
                        console.log(cacheData);

                        Base.popTo(this.navCtrl, 'switchProjectPage');
                    }, (msg) => {

                        // this.base.logger(JSON.stringify(msg), "NonImg_maintenance_submit_function_fileTransferError.txt");

                        this.base.showAlert('提示', '提交失败', () => { });
                        let cacheData = {
                            deviceId: this.deviceId, longitude: this.longtitude, latitude: this.latitude, altitude: this.altitude,
                            accuracy: this.accuracy, diameter: this.diameter, height: this.height, volume: this.volume,
                            killMethodsValue: this.killMethodsValue, remarks: this.remarks, hasPic: this.hasPic, photoSum: this.photosum, batch: this.batch
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
                        localStorage.setItem('deadCache', JSON.stringify(deadCache));
                            Base.popTo(this.navCtrl, 'switchProjectPage');
                    });

        }

    }

    trapClick() {
        console.log('deadtree');
    }

    test3(){
        
        for (var i = 0; i < 10000 ; i++){
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
                            // this.base.showAlert('提示', '提交成功', () => { });
                            let cacheData = {
                                deviceId: this.deviceId, longitude: this.longtitude, latitude: this.latitude, altitude: this.altitude,
                                accuracy: this.accuracy, diameter: this.diameter.toString(), height: this.height.toString(), volume: this.volume.toString(),
                                killMethodsValue: this.killMethodsValue, remarks: this.remarks
                            };
                            console.log("cacheData");
                            console.log(cacheData);

                            Base.popTo(this.navCtrl, 'switchProjectPage');
                        }, (msg) => {

                        }); 
                }, 100);
            })(i)

         
        }
    }

    test(){
        for (var i = 0; i < 10000; i++){
            (function (i) {
                setTimeout(function () {
                    this.deviceId = (i + 100000120000).toString();
                    this.httpClient.post(this.base.BASE_URL + 'app/addDeviceId', {},
                        {
                            headers: { token: localStorage['token'] }, params: {
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
        console.log('ok');
        console.log(this.deviceId);
    }
    deviceSerialInput() {
        console.log(this.deviceSerial);
    }

}
