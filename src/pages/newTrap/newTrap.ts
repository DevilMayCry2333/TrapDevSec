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

@Component({
    selector: 'app-home',
    templateUrl: 'newTrap.html',
})
export class TrapPage {
    deviceId: String
    deviceSerial: String
    longtitude: String
    latitude: String
    altitude: String
    accuracy: String
    imageData: null
    remarks:String
    newbettle: String
    otherbettleType:any[]
    injectType:any[]
    workContent:any[]
    // 定位订阅
    subscription: Subscription;
    // 是否定位成功
    location_ready = false;
    otherbettle: String

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
        this.httpClient.post("http://192.168.31.254:8081/app/" + 'getBeetle', {},
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

        this.httpClient.post("http://192.168.31.254:8081/app/" + 'getInject', {},
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

        this.httpClient.post("http://192.168.31.254:8081/app/" + 'getWorkContent', {},
            {
                headers: { token: localStorage['token'] },
                params: new HttpParams({ fromObject: { username: localStorage['username'] } })
            })
            .subscribe(res => {
                var c: any = res;
                this.workContent = Array.from(c);
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
        private camera: Camera) { }

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
    deviceIdInput() {
        console.log("ok");
        console.log(this.deviceId);
    }
    deviceSerialInput() {
        console.log(this.deviceSerial);
    }

}
